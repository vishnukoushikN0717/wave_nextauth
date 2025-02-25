"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, User, FileSpreadsheet, LogOut } from "lucide-react"
import { useSidebar } from "@/hooks/use-sidebar"
import { Button } from "@/components/ui/button"
import { logout } from "@/utils/auth"

// Add logout handler
const handleLogout = () => {
  try {
    logout();
  } catch (error) {
    console.error("Logout error:", error);
  }
};

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Entity Creation",
    href: "/entity-creation",
    icon: FileSpreadsheet,
  },
  {
    title: "Patient Manager",
    href: "/patient-manager",
    icon: Users,
  },
  {
    title: "Account",
    href: "/account",
    icon: User,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()

  return (
    <aside 
      className={cn(
        "fixed top-16 left-0 z-50 border-r h-[calc(100vh-4rem)] bg-background transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
      style={{
        "--sidebar-width": isOpen ? "16rem" : "4rem"
      } as any}
    >
      {/* Main Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-blue-600 hover:text-primary-foreground",
                pathname === item.href 
                  ? "bg-blue-600 text-primary-foreground" 
                  : "text-foreground",
                !isOpen && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {isOpen && <span className="truncate">{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button - Fixed at Bottom */}
      <div className="border-t p-4 mt-auto">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-red-600 hover:text-red-700 hover:bg-red-50",
            !isOpen && "px-2 justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {isOpen && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  )
}