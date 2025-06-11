import { Map, Toilet } from "lucide-react";
import { Link } from "react-router";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const TopNavbar = () => {
  return (
    <NavigationMenu
      className={cn(
        "h-[var(--navbar-height)] bg-rose-100 w-full fixed flex max-w-none justify-between",
        "px-5",
      )}
    >
      <NavigationMenuList className="w-full bg-rose-200">
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(navigationMenuTriggerStyle())}
            asChild
          >
            <Link to="/" className="flex flex-row gap-x-1 items-center">
              <Toilet className="h-5 w-5" />
              Heimscheißer
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(navigationMenuTriggerStyle())}
            asChild
          >
            <Link to="/map" className="flex flex-row gap-x-1 items-center">
              <Map className="h-5 w-5" />
              Map
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopNavbar;
