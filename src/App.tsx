import { AuthProvider } from "./context/AuthProvider";
import { RouterProvider } from "react-router";
import { router } from "./router";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
