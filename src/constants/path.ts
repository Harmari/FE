// TODO: 임의로 정한 경로이기 떄문에 회의 후 정 계획
export const PATH = {
  login: "/login",
  logout: "/logout",

  designerList: "/designer-list",
  designerDetail: (id: string) => `/designer/${id}`,

  reservationList: "/reservation-list",
  reservationDetail: (id: string) => `/reservation/${id}`,
  reservationDetailPath: "/reservation/:id",

  payments: "/payment",
  paymentSuccess: "/payment/success",
  paymentPrepare: "/payment-prepare",  // 임시 결제 준비 페이지

  mypage: "/mypage",
  

} as const;
