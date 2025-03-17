import { RootLayout } from "@/layouts/RootLayout";

import { BrowserRouter,Route, Routes } from "react-router";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
