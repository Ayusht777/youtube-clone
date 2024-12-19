import { configureStore } from "@reduxjs/toolkit";
import auth from "../store/auth/auth.slice";
export const store = configureStore({
  reducer: { auth },
});

export { store as default };
