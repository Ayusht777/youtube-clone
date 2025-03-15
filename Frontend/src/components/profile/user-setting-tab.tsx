import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader } from "../ui/card";
import UpdateUserProfile from "./update-user-profile";

const UserSettingTab = () => {
  return (
    <Card>
      <CardHeader>
        <Tabs>
          <TabsList className="w-full">
            <TabsTrigger value="update-profile">Update Profile</TabsTrigger>
            <TabsTrigger value="update-password">Update Password</TabsTrigger>
            <TabsTrigger value="delete-account">Delete Account</TabsTrigger>
          </TabsList>
          <TabsContent value="update-profile">
            <UpdateUserProfile />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default UserSettingTab;
