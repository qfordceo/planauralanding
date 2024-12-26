import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Index from "./pages/Index"
import Auth from "./pages/Auth"
import Waitlist from "./pages/Waitlist"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/waitlist" element={<Waitlist />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  )
}

export default App