import { PATH } from "@/constants/path";
import { AuthSuccessPage, LoginPage } from "@/pages";

const LOGIN_ROUTES = [
  {
    index: true,
    element: <LoginPage />,
  },
  {
    path: PATH.login,
    element: <LoginPage />,
  },
  {
    path: PATH.authSuccess,
    element: <AuthSuccessPage />,
  },
];

export default LOGIN_ROUTES;
