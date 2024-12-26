import { BrowserRouter } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import Layout from "@/components/Layout"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toaster />
      </Layout>
    </BrowserRouter>
  )
}

export default App