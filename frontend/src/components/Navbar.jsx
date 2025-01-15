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
} from "@nextui-org/react";

export const StyledNavbar = () => {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">SBC</p>
      </NavbarBrand>

      <NavbarContent className="gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/email">
            Email
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/programmes">
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
              color="secondary"
              name="John Doe"
              size="sm"
              src=""
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">john_doe@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};
