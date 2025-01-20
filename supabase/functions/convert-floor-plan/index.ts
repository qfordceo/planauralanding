import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { PDFDocument } from 'https://esm.sh/pdf-lib@1.17.1'
import DxfParser from 'https://esm.sh/dxf-parser@1.1.0'
import { parse as parseSvg } from 'https://esm.sh/svg-parser@2.0.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileUrl, fileType } = await req.json()
    console.log(`Processing ${fileType} file from ${fileUrl}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the original file
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('floor-plan-originals')
      .download(fileUrl)

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    let convertedData
    let metadata = {}

    switch (fileType.toLowerCase()) {
      case 'application/pdf':
        // Convert PDF to images
        const pdfBytes = await fileData.arrayBuffer()
        const pdfDoc = await PDFDocument.load(pdfBytes)
        const pages = pdfDoc.getPages()
        
        if (pages.length === 0) {
          throw new Error('PDF has no pages')
        }

        const page = pages[0] // Get first page
        const { width, height } = page.getSize()
        
        metadata = {
          pageCount: pages.length,
          dimensions: { width, height }
        }

        // Convert to PNG
        convertedData = await page.toPng()
        break

      case 'application/x-dwg':
      case 'application/x-dxf':
        // CAD file processing
        const parser = new DxfParser()
        const cadData = await fileData.text()
        const parsedDxf = parser.parseSync(cadData)
        
        metadata = {
          fileSize: cadData.length,
          format: fileType === 'application/x-dwg' ? 'DWG' : 'DXF',
          entities: parsedDxf.entities.length,
          layers: Object.keys(parsedDxf.tables.layer).length
        }

        // Store the parsed data for further processing
        convertedData = new TextEncoder().encode(JSON.stringify(parsedDxf))
        break

      case 'image/svg+xml':
        // Vector file processing
        const svgText = await fileData.text()
        const parsedSvg = parseSvg(svgText)
        
        metadata = {
          originalFormat: 'SVG',
          elements: countElements(parsedSvg),
          viewBox: extractViewBox(svgText),
          size: svgText.length
        }
        
        // Convert SVG to a standardized format
        convertedData = new TextEncoder().encode(JSON.stringify(parsedSvg))
        break

      default:
        throw new Error(`Unsupported file type: ${fileType}`)
    }

    // Upload converted file
    const convertedFilePath = `converted/${crypto.randomUUID()}`
    const { error: uploadError } = await supabase
      .storage
      .from('floor-plans')
      .upload(convertedFilePath, convertedData)

    if (uploadError) {
      throw new Error(`Failed to upload converted file: ${uploadError.message}`)
    }

    // Create conversion record
    const { error: dbError } = await supabase
      .from('file_conversions')
      .insert({
        original_file_path: fileUrl,
        converted_file_path: convertedFilePath,
        file_type: fileType,
        conversion_status: 'completed',
        metadata
      })

    if (dbError) {
      throw new Error(`Failed to create conversion record: ${dbError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'File converted successfully',
        convertedFilePath,
        metadata 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing file:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process file', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

// Helper functions for SVG processing
function countElements(ast: any): number {
  let count = 0
  if (ast.children) {
    for (const child of ast.children) {
      count += 1 + countElements(child)
    }
  }
  return count
}

function extractViewBox(svgText: string): string | null {
  const match = svgText.match(/viewBox=["']([^"']+)["']/)
  return match ? match[1] : null
}