import { PATH } from "@/constants/path";
import { 
  PaymentPage, 
  PaymentSuccessPage,
  PaymentPreparePage,
} from "@/pages";

const PAYMENTS_ROUTES = [
  {
    path: PATH.paymentPrepare,
    element: <PaymentPreparePage />,
  },
  {
    path: PATH.payments,
    element: <PaymentPage />,
  },
  {
    path: PATH.paymentSuccess,
    element: <PaymentSuccessPage />,
  },
];

export default PAYMENTS_ROUTES;
