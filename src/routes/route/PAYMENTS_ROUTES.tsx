import { PATH } from "@/constants/path";
import { PaymentPage, PaymentSuccessPage } from "@/pages";

const PAYMENTS_ROUTES = [
  {
    path: PATH.payments,
    element: <PaymentPage />,
  },
  {
    path: PATH.paymentSuccess,  // '/payment/success'
    element: <PaymentSuccessPage />,
  },
];

export default PAYMENTS_ROUTES;
