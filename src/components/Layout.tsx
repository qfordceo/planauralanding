import { Routes, Route } from "react-router-dom"
import Auth from "@/pages/Auth"
import Index from "@/pages/Index"
import Waitlist from "@/pages/Waitlist"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/waitlist" element={<Waitlist />} />
        </Routes>
      </main>
      {children}
    </div>
  )
}