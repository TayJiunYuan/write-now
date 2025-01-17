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
import { useNavigate } from "react-router-dom";
import { LayoutDashboardIcon, MailIcon, BookIcon } from "lucide-react";
import { getUserByIdWithoutCredentials } from "../services/api";

export const StyledNavbar = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserByIdWithoutCredentials(userId);
        console.log(response);
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
    <Navbar isBordered className="fixed">
      <NavbarBrand>
        <p className="font-bold text-inherit">SBC</p>
      </NavbarBrand>

      <NavbarContent className="gap-16" justify="center">
        <NavbarItem>
          <Link
            color="foreground"
            href="/email"
            className="flex flex-col items-center"
          >
            <MailIcon />
            Email
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link
            aria-current="page"
            href="/dashboard"
            className="flex flex-col items-center"
          >
            <LayoutDashboardIcon />
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
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
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
