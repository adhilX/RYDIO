import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { UserRoutes } from "./Routes/UserRoutes";
import { AdminRoutes } from "./Routes/AdminRoutes";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {GoogleOAuthProvider} from '@react-oauth/google'
import SocketManager from "./utils/SocketManager";
function App() {
  const router = createBrowserRouter([
    { path: "/*", element: <UserRoutes /> },
    { path: "/admin/*", element: <AdminRoutes /> },
  ]);
const client_id = import.meta.env.VITE_CLIENT_ID
  return (
    <>
    <Provider store={store}>
      <SocketManager/>
      <GoogleOAuthProvider clientId={client_id}>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
    </>
  );
}

export default App;
