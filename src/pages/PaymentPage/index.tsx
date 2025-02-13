import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../../services/paymentApi';
import { PaymentInfo } from '../../types/payment';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const readyResponse = await paymentApi.ready({
        reservation_id: "67a9fb08bff81f47736a1592",
        user_id: "test-user",
        payment_method: "KAKAO_PAY",
        amount: 10000,
        status: "pending"
      });

      window.location.href = readyResponse.next_redirect_pc_url;
    } catch (err) {
      setError('결제 준비 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 결제 승인 처리
  React.useEffect(() => {
    const pg_token = searchParams.get('pg_token');
    const tid = localStorage.getItem('tid');
    
    if (pg_token && tid) {
      const approvePayment = async () => {
        try {
          const response = await paymentApi.approve({
            tid,
            pg_token,
            order_id: "test-order"
          });
          // 결제 성공 처리
          navigate('/payment/success', { state: response });
        } catch (err) {
          navigate('/payment/fail');
        }
      };
      
      approvePayment();
    }
  }, [searchParams]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">결제 페이지</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">결제 정보</h2>
          <p>결제 금액: 10,000원</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? '처리중...' : '결제하기'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
