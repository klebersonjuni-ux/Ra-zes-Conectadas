import React from "react"
import { cn } from "@/utils"

const SidebarProvider = ({ children }) => <div className="flex min-h-screen w-full">{children}</div>
const Sidebar = ({ className, children }) => <aside className={cn("w-64 flex flex-col h-screen sticky top-0", className)}>{children}</aside>
const SidebarHeader = ({ className, children }) => <div className={cn("", className)}>{children}</div>
const SidebarContent = ({ className, children }) => <div className={cn("flex-1 overflow-auto", className)}>{children}</div>
const SidebarFooter = ({ className, children }) => <div className={cn("", className)}>{children}</div>
const SidebarGroup = ({ className, children }) => <div className={cn("", className)}>{children}</div>
const SidebarGroupLabel = ({ className, children }) => <div className={cn("", className)}>{children}</div>
const SidebarGroupContent = ({ children }) => <div>{children}</div>
const SidebarMenu = ({ children }) => <nav className="space-y-1">{children}</nav>
const SidebarMenuItem = ({ children }) => <div>{children}</div>
const SidebarMenuButton = ({ asChild, className, children }) => {
  const Comp = asChild ? "div" : "button"
  return <Comp className={cn("w-full text-left", className)}>{children}</Comp>
}
const SidebarTrigger = ({ className }) => <button className={className}>☰</button>

export {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger
}