import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentApi } from '../../services/paymentApi';
import { PATH } from '@/constants/path';
import { AxiosError } from 'axios';

interface PaymentInfo {
  amount: number;
  reservation_id: string;
  approved_at: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const approvePayment = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const pg_token = searchParams.get('pg_token');
        const tid = localStorage.getItem('tid');
        const order_id = localStorage.getItem('order_id');

        if (!pg_token || !tid || !order_id) {
          throw new Error('결제 정보가 없습니다.');
        }

        try {
          const response = await paymentApi.approve({
            tid,
            pg_token,
            order_id
          });
          
          localStorage.removeItem('tid');
          localStorage.removeItem('order_id');
          setLoading(false);
          setPaymentInfo(response);

        } catch (err: unknown) {
          if (err instanceof AxiosError) {
            setError(err.response?.data?.detail || '결제 승인 중 오류가 발생했습니다.');
          } else {
            setError('결제 승인 중 오류가 발생했습니다.');
          }
          setLoading(false);
        }
      } catch {
        setError('결제 정보가 올바르지 않습니다.');
        setLoading(false);
      }
    };

    approvePayment();

    return () => {
      isProcessingRef.current = false;
    };
  }, [searchParams]);

  if (loading) {
    return <div className="text-center p-8">결제 승인 처리 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">에러: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto text-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">결제 완료</h1>
        <div className="mb-8">
          <p className="text-lg mb-2">결제가 성공적으로 완료되었습니다.</p>
          {paymentInfo && (
            <div className="text-left bg-gray-50 p-4 rounded">
              <p className="mb-2">결제 금액: {paymentInfo.amount.toLocaleString()}원</p>
              <p className="mb-2">예약 번호: {paymentInfo.reservation_id}</p>
              <p>결제 시간: {new Date(paymentInfo.approved_at).toLocaleString()}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(PATH.reservationList)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            예약 목록 보기
          </button>
          {paymentInfo && (
            <button
              onClick={() => navigate(PATH.reservationDetail(paymentInfo.reservation_id))}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              예약 상세 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 