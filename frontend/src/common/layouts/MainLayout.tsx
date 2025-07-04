import { Outlet } from "react-router";

import { cn } from "@/lib/utils";

import { Footer, TopNavbar } from "../components/navigation";

const MainLayout = () => {
  return (
    <>
      <div className="h-screen overflow-hidden">
        <TopNavbar />
        <div
          className={cn(
            "mt-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height))] overflow-y-auto",
            "flex flex-col",
          )}
        >
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
