import { useEffect } from "react";
import { apiClient } from "./utils/axiosInstance";

const App = () => {
  useEffect(() => {
    const apiHandle = async () => {
      try {
        const res = await apiClient.post("/users/login", {
          userName: "ayushx2",
          password: "@yushT92",
          email: "ax2@gmail.in",
        });
        console.log("API Response:", res);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    apiHandle();
  }, []);

  return <div>App</div>;
};

export default App;
