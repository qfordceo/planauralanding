import { Outlet } from "react-router-dom";
import { Footer } from "./layout/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}