import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../Redux/Slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleRedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const expertParam = searchParams.get("expert");
    const returnParam = searchParams.get("returnUrl");

    const user = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;
    const expert = expertParam ? JSON.parse(decodeURIComponent(expertParam)) : null;
    const returnUrl = returnParam ? decodeURIComponent(returnParam) : "/";

    if (token && user) {
      dispatch(googleLogin({ user, expert, token }));
      navigate(returnUrl);
    } else {
      // Optionally handle errors here (invalid/missing params)
      navigate("/auth-error");
    }
  }, [dispatch, navigate, searchParams]);

  return <p>Logging you in...</p>;
};

export default GoogleRedirectHandler;
