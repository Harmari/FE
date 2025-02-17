import { userDelete } from "@/apis/userDelete";
import { useNavigate } from "react-router-dom";
import MyPageHeader from "./components/MyPageHeader";
import ProfileInfo from "./components/ProfileInfo";
import DeleteUserDialog from "./components/DeleteUserDialog";
import { useUser } from "@/hooks/useUser";

const MyPage = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser();

  const handleDeleteUser = async () => {
    const response = await userDelete();
    if (response.message) {
      alert("회원탈퇴 되었습니다.");
      navigate("/");
    }
  };

  if (isLoading) {
    return <div className="px-5">Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        <h2>데이터를 불러오지 못했습니다.</h2>
        <p>예약 상세 정보를 불러오지 못했습니다. 잠시 후에 다시 시도해주세요.</p>
      </div>
    );
  }

  if (!user) {
    return <div>사용자 정보가 없습니다.</div>;
  }

  return (
    <div className="pt-8 px-8 pb-5 flex flex-col justify-between">
      <div>
        <MyPageHeader />
        <ProfileInfo user={user} />
      </div>
      <DeleteUserDialog onDelete={handleDeleteUser} />
    </div>
  );
};

export default MyPage;
