import { BrowserRouter } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import Layout from "@/components/Layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./App.css"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Toaster />
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App