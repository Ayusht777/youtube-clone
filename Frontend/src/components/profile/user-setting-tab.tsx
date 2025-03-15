import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Key, Trash2, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import UpdateUserProfile from "./update-user-profile";
import UserProfile from "./user-profile";

const UserSettingTab = () => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-6 pb-0">
        <Tabs defaultValue="update-profile" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-8 bg-transparent border-b">
            <TabsTrigger
              value="update-profile"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent"
            >
              <User className="size-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="update-password"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent"
            >
              <Key className="size-4" />
              <span>Password</span>
            </TabsTrigger>
            <TabsTrigger
              value="delete-account"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent"
            >
              <Trash2 className="size-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="update-profile">
            <UserProfile />
            <UpdateUserProfile />
          </TabsContent>

          <TabsContent value="update-password">
            <Card className="border-none rounded-none shadow-none bg-transparent">
              <CardHeader className="px-6">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>
              </CardHeader>
              {/* Password update form would go here */}
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Password update form coming soon
                </p>
                <Button
                  disabled
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Update Password
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="delete-account">
            <Card className="border-none rounded-none shadow-none bg-transparent">
              <CardHeader className="px-6">
                <h3 className="text-lg font-semibold">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </CardHeader>
              <div className="p-6 space-y-6">
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This action cannot be undone. All your data will be
                    permanently removed.
                  </AlertDescription>
                </Alert>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default UserSettingTab;
