import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { HomeIcon, Settings, User } from "lucide-react";

const platformItems = [
  { icon: HomeIcon, label: "Playground", active: true },
  { icon: User, label: "Models" },
  { icon: Settings, label: "Documentation" },
  { icon: Settings, label: "Settings" },
];

const projectItems = [
  { label: "Design Engineering" },
  { label: "Sales & Marketing" },
  { label: "Travel" },
];

export function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <span className="font-semibold">Acme Inc</span>
            <span className="text-xs text-muted-foreground">Enterprise</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {platformItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.active}>
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton>{item.label}</SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Support</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Feedback</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
