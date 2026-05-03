import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "./App";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import "./styles/global.css";
import HomePage from "./pages/HomePage/HomePage";
import CoursesPage from "./pages/TopicsPage/TopicsPage";
import TopicPage from "./pages/TopicPage/TopicPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RequireGrade from "./components/ProtectedRoute/RequireGrade";
import RequireAdmin from "./components/ProtectedRoute/RequireAdmin";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "signup",
          element: <SignupPage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "courses",
          element: (
            <ProtectedRoute>
              <RequireGrade>
                <Outlet />
              </RequireGrade>
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <CoursesPage />,
            },
          ],
        },
        {
          path: "topics",
          element: (
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              path: ":id",
              element: <TopicPage />,
            },
          ],
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )
        },
        {
          path: "admin",
          element: (
            <ProtectedRoute>
              <RequireAdmin>
                <Outlet />
              </RequireAdmin>
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <AdminPage />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
