import { RouterProvider } from "react-router-dom";
import { ChangePasswordProvider } from "./contexts/ChangePasswordContext";
import { router } from "./routes";

function App() {
  return (
    <ChangePasswordProvider>
      <RouterProvider router={router} />
    </ChangePasswordProvider>
  );
}

export default App;