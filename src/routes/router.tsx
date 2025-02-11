import KakaoTest from "@/KakaoTest";
import Oauth from "@/Oauth";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <KakaoTest />,
  },
  {
    path: "/oauth",
    element: <Oauth />,
  },
]);

export default router;
