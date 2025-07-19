import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-dvh min-w-1/1">
      <Header />
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});
