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
import { getUserById } from "../services/api";

export const StyledNavbar = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(userId);
        setUser(response);
      } catch (err) {
        setIsLoading(false);
      } finally {
        setIsLoading(true);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleLogOut = () => {
    setUser(null);
    localStorage.clear();
    setIsLoading(false);
    navigate("/");
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
              <p className="font-semibold">
                {isLoading ? (
                  <p className="font-light">Loading...</p>
                ) : user?.email ? (
                  user?.email
                ) : (
                  "--"
                )}
              </p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={handleLogOut} className="text-danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
