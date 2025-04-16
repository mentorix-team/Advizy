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
    const user = JSON.parse(decodeURIComponent(searchParams.get("user")));
    const expert = searchParams.get("expert")
      ? JSON.parse(decodeURIComponent(searchParams.get("expert")))
      : null;
    const returnUrl = decodeURIComponent(searchParams.get("returnUrl") || "/");

    dispatch(googleLogin({ user, expert, token }));
    navigate(returnUrl);
  }, [dispatch, navigate, searchParams]);

  return <p>Logging you in...</p>;
};

export default GoogleRedirectHandler;
