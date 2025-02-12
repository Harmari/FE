import { useQuery } from "@tanstack/react-query";
import QUERY_KEY from "@/constants/queryKey";
import Footer from "@/components/common/Footer";
import { getUserReservationList } from "@/apis/userReservationList";
import ReservationList from "./components/ReservationList";

const ReservationListPage = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: QUERY_KEY.userReservation.list,
    queryFn: getUserReservationList,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  let content;
  if (isPending) {
    content = <div>Loading...</div>;
  }

  if (isError) {
    content = (
      <div>
        <h2>데이터를 불러오지 못했습니다.</h2>
        <p>예약 목록을 불러오지 못했습니다. 잠시 후에 다시 시도해주세요.</p>
      </div>
    );
  }

  if (data) {
    content = <ReservationList list={data} />;
  }

  return (
    <>
      <h2 className="pt-4 px-5 text-2xl font-bold mb-2">예약 내역</h2>
      {content}
      <Footer />
    </>
  );
};

export default ReservationListPage;
