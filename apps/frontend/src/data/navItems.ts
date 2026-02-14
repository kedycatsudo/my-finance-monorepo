import { NavItem } from "@/types/navigation";

export const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/incomes", label: "Incomes" },
    { href: "/outcomes", label: "Outcomes" },
    { href: "/investments", label: "Investments" },
    { href: "/profile", label: "Profile" },
    {
        href: "/logout",
        label: "Logout",

        onClick: () => {
            // Add your logout logic here, e.g. clearing tokens, redirecting, etc.
            // For example:
            // localStorage.removeItem("token");
        }
    },
];