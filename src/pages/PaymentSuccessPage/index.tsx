import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { paymentApi } from "../../services/paymentApi";
import { PATH } from "@/constants/path";
import { AxiosError } from "axios";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { getReservationDetail } from "@/apis/reservationDetail";
import devApi from "@/config/axiosDevConfig";
import { RESERVATION_ENDPOINT } from "@/apis/endpoints";

interface PaymentInfo {
  amount: number;
  reservation_id: string;
  approved_at: string;
  user_id: string;
}

interface ReservationPayload {
  reservation_id: string;
  designer_id: string;
  user_id: string;
  reservation_date_time: string;
  consulting_fee: string;
  google_meet_link: string;
  mode: string;
  status: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const isProcessingRef = useRef(false);

  const [reservationPayload, setReservationPayload] = useState<ReservationPayload>({
    reservation_id: "67b1e3299c941b90f4ffd518",
    designer_id: "67ab727934cd2146254af06a",
    user_id: "67b1e2959c941b90f4ffd517",
    reservation_date_time: "202503181900",
    consulting_fee: "30000",
    google_meet_link: "",
    mode: "비대면",
    status: "예약완료",
  });

  // 예약 생성 API 호출 함수
  const handleCreateReservation = useCallback(async () => {
    try {
      setLoading(true);
      const reservationResponse = await devApi.post(
        RESERVATION_ENDPOINT.create,
        reservationPayload
      );
      console.log("Reservation created:", reservationResponse.data);
      // 예약 생성 후 success 페이지 처리는 이미 이 페이지 내에서 보여주고 있으므로
      // 추가로 navigate 처리할 필요가 없을 수 있습니다.
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || "예약 생성 중 오류가 발생했습니다.");
      } else {
        setError("예약 생성 중 오류가 발생했습니다.");
      }
      setLoading(false);
    }
  }, [reservationPayload]);

  const handlePaymentApproval = async (pg_token: string, tid: string, order_id: string) => {
    try {
      const response = await paymentApi.approve({ tid, pg_token, order_id });
      localStorage.removeItem("tid");
      localStorage.removeItem("order_id");
      return response;
    } catch (err) {
      throw new Error(
        err instanceof AxiosError
          ? err.response?.data?.detail || "결제 승인 처리 중 오류가 발생했습니다."
          : "결제 승인 처리 중 오류가 발생했습니다."
      );
    }
  };

  useEffect(() => {
    const processPaymentAndReservation = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        setLoading(true);
        const pg_token = searchParams.get("pg_token");
        const tid = localStorage.getItem("tid");
        const order_id = localStorage.getItem("order_id");

        if (!pg_token || !tid || !order_id) {
          throw new Error("결제 정보가 없습니다.");
        }

        // 결제 승인 처리
        const paymentResponse = await handlePaymentApproval(pg_token, tid, order_id);
        setPaymentInfo(paymentResponse);

        // 예약 상세 정보 조회 및 예약 생성
        if (paymentResponse.reservation_id) {
          const reservationDetail = await getReservationDetail(paymentResponse.reservation_id);

          if (reservationDetail) {
            setReservationPayload({
              reservation_id: reservationDetail.id,
              designer_id: reservationDetail.designer_id,
              user_id: reservationDetail.user_id,
              reservation_date_time: reservationDetail.reservation_date_time,
              consulting_fee: reservationDetail.consulting_fee.toString(),
              google_meet_link: reservationDetail.google_meet_link,
              mode: reservationDetail.mode,
              status: reservationDetail.status,
            });
            await handleCreateReservation();
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "처리 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
      }
    };

    processPaymentAndReservation();
  }, [handleCreateReservation, searchParams]);

  if (loading) {
    return <div className="text-center p-8">처리 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">에러: {error}</div>;
  }

  return (
    <div className="min-h-dvh">
      {/* 상단 완료 메시지 */}
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <Check className="w-10 h-10 mb-2 text-[#D896FF] stroke-2" />
        <h1 className="text-lg font-medium">예약이 완료되었습니다.</h1>
      </div>

      {/* 예약 정보 (paymentApi.approve 응답 기준) */}
      <Card className="border-0 shadow-none px-6">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex">
              <span className="text-[14px] text-gray-400 w-24">예약 번호</span>
              <span className="text-gray-700">{paymentInfo?.reservation_id}</span>
            </div>
            <div className="flex">
              <span className="text-[14px] text-gray-400 w-24">예약자</span>
              <span className="text-gray-700">{paymentInfo?.user_id || "사용자"}</span>
            </div>
            {/* 추가 정보는 필요에 따라 렌더링 */}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* 결제 정보 */}
      <Card className="border-0 shadow-none px-6">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium">결제 정보</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex">
            <span className="text-[14px] text-gray-400 w-24">결제 금액</span>
            <span className="text-gray-700">{paymentInfo?.amount?.toLocaleString()}원</span>
          </div>
          <div className="flex">
            <span className="text-[14px] text-gray-400 w-24">결제 시간</span>
            <span className="text-gray-700">
              {paymentInfo && new Date(paymentInfo.approved_at).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* 하단 버튼 */}
      <div className="min-w-[375px] max-w-[430px] m-auto p-4 bg-white border-t mt-8">
        <div className="flex gap-3 px-2">
          <Button
            variant="outline"
            className="w-1/2 h-12"
            onClick={() =>
              paymentInfo?.reservation_id
                ? navigate(PATH.reservationDetail(paymentInfo?.reservation_id))
                : navigate(PATH.reservationList)
            }
          >
            예약확인
          </Button>
          <Button
            className="w-1/2 h-12 bg-black hover:bg-gray-800"
            onClick={() => navigate(PATH.designerList)}
          >
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
