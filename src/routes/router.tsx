import RootLayout from "@/layouts/RootLayout";
import HomeLayout from "@/layouts/HomeLayout";
import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "@/pages";
import {
  LOGIN_ROUTES,
  DESIGNER_ROUTES,
  PAYMENTS_ROUTES,
  RESERVATION_ROUTES,
  MYPAGE_ROUTES,
} from "./route";
import { checkAuthLoader, tokenLoader } from "@/utils/authToken";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        children: LOGIN_ROUTES,
      },
      {
        path: "/",
        element: <HomeLayout />,
        loader: checkAuthLoader,
        children: [
          {
            path: "/",
            children: [
              ...DESIGNER_ROUTES,
              ...PAYMENTS_ROUTES,
              ...RESERVATION_ROUTES,
              ...MYPAGE_ROUTES,
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
