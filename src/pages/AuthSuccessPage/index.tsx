import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/designer-list");
    } else {
      navigate("/login?error=로그인에 실패하였습니다.");
    }
  }, [navigate, accessToken, refreshToken]);

  return <div>인증 처리 중...</div>;
};
export default AuthSuccessPage;
