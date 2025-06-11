import { Outlet } from "react-router";

import { cn } from "@/lib/utils";

import { TopNavbar } from "../components/navigation";

const MinimalLayout = () => {
  return (
    <>
      <div className="h-screen bg-cyan-100 overflow-hidden">
        <TopNavbar />
        <div
          className={cn(
            "mt-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height))] overflow-y-auto",
            "bg-yellow-100 flex flex-col",
          )}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MinimalLayout;
