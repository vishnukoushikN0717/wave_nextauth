"use client"
import { MainNav } from "@/components/main-nav"
import { SidebarNav } from "@/components/internal/sidebar-nav"
import { useSidebar } from "@/hooks/use-sidebar"
import { use } from "react"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode


}) {
  const { isOpen } = useSidebar()
  return (
    <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>
      <MainNav />
      <div className="flex">
        <SidebarNav />
        <main className="flex-1 p-8 mt-16">
          {children}
        </main>
      </div>
    </div>
  )
}