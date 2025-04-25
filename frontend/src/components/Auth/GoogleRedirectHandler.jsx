import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../Redux/Slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../LoadingSkeleton/Spinner";

const GoogleRedirectHandler = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const expertParam = searchParams.get("expert");
        const returnUrl = searchParams.get("returnUrl") || "/";

        if (!token || !userParam) {
          throw new Error("Missing authentication data");
        }

        const user = JSON.parse(decodeURIComponent(userParam));
        const expert = expertParam ? JSON.parse(decodeURIComponent(expertParam)) : null;

        await dispatch(googleLogin({ user, expert, token }));
        navigate(decodeURIComponent(returnUrl), { replace: true });
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/auth-error");
      } finally {
        setIsLoading(false);
      }
    };

    processAuth();
  }, [dispatch, navigate, searchParams]);

  if (isLoading) {
    return <Spinner />
  }

  return null;
};

export default GoogleRedirectHandler;
