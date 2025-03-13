import { googleLogin } from "@/Redux/Slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleAuthSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const user = JSON.parse(decodeURIComponent(searchParams.get("user")));
        const expert = searchParams.get("expert") ? JSON.parse(decodeURIComponent(searchParams.get("expert"))) : null;

        if (token && user) {
            dispatch(googleLogin({ user, expert, token }));
            navigate("/");
        } else {
            navigate("/login"); // If data is missing, redirect to login
        }
    }, [dispatch, navigate, searchParams]);

    return <div>Logging in...</div>;
};

export default GoogleAuthSuccess;
