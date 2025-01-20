import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboardIcon, MailIcon, BookIcon } from "lucide-react";
import { getUserByIdWithoutCredentials } from "../services/api";

export const StyledNavbar = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const isActivePath = (path) => location.pathname === path;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserByIdWithoutCredentials(userId);
        setUser(response);
      } catch (err) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleLogOut = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <Navbar
      isBordered
      className="fixed"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "after:content-['']",
          "after:absolute",
          "after:bottom-0",
          "after:left-0",
          "after:right-0",
          "after:h-[2px]",
          "after:rounded-[2px]",
          "after:bg-primary",
          "after:transition-all",
          "after:duration-300",
          "after:ease-in-out",
          "after:scale-x-0",
          "hover:after:scale-x-100",
          "data-[active=true]:after:scale-x-100",
        ],
      }}
    >
      <NavbarBrand>
        <p className="font-bold text-inherit">SBC</p>
      </NavbarBrand>

      <NavbarContent className="gap-16" justify="center">
        <NavbarItem isActive={isActivePath("/email")}>
          <Link
            color="foreground"
            href="/email"
            className="flex flex-col items-center"
          >
            <MailIcon />
            Email
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActivePath("/dashboard")}>
          <Link
            color="foreground"
            href="/dashboard"
            className="flex flex-col items-center"
          >
            <LayoutDashboardIcon />
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isActivePath("/programmes")}>
          <Link
            color="foreground"
            href="/programmes"
            className="flex flex-col items-center"
          >
            <BookIcon />
            Programmes
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              color="default"
              name=""
              size="sm"
              src=""
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-light">
                {isLoading ? "Loading..." : user ? user.name : "--"}
              </p>
              <p className="font-light">
                {isLoading ? "Loading..." : user ? user.id : "--"}
              </p>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onPress={handleLogOut}
              className="text-danger"
              shortcut="⌘⇧L"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
