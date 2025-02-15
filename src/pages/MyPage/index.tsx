import { getEmailDetail } from "@/apis/emailDetail";
import QUERY_KEY from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import ProfileInfo from "./components/ProfileInfo";
import MyPageHeader from "./components/MyPageHeader";
import { useNavigate } from "react-router-dom";
import { userDelete } from "@/apis/userDelete";

const email = "joajoa70584@gmail.com";

const MyPage = () => {
  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: QUERY_KEY.user.email(email),
    queryFn: () => getEmailDetail(email),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  let content;
  if (isPending) {
    content = <div className="px-5">Loading...</div>;
  }

  if (isError) {
    content = (
      <div>
        <h2>데이터를 불러오지 못했습니다.</h2>
        <p>예약 상세 정보를 불러오지 못했습니다. 잠시 후에 다시 시도해주세요.</p>
      </div>
    );
  }

  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    const response = await userDelete();
    if (response.status === 200) {
      alert("회원탈퇴 되었습니다.");
      navigate("/");
    }
  };

  if (user) {
    content = (
      <div className="pt-8 px-8 pb-5 flex flex-col justify-between">
        <div>
          <MyPageHeader />
          <ProfileInfo user={user} />
        </div>
        <button
          onClick={handleDeleteUser}
          className="w-full bg-gray-scale-100 py-3 text-body1 text-gray-scale-200 rounded-lg"
        >
          회원탈퇴
        </button>
      </div>
    );
  }

  return <>{content}</>;
};

export default MyPage;
