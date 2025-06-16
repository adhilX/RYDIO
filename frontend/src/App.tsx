import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { UserRoutes } from "./Routes/UserRoutes";
import { AdminRoutes } from "./Routes/AdminRoutes";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";
function App() {
  const router = createBrowserRouter([
    { path: "/*", element: <UserRoutes /> },
    { path: "/admin/*", element: <AdminRoutes /> },
  ]);

  return (
    <>
    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </Provider>
    </>
  );
}

export default App;
