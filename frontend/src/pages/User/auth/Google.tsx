import { googleLogin } from "@/services/user/authService";
import { addUser } from "@/store/slice/user/UserSlice";
import { addToken } from "@/store/slice/user/UserTokenSlice";
import type { Client } from "@/Types/User/auth/TGoogle";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";


function Google() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    interface GoogleJwtPayload {
        email: string;
        email_verified: boolean;
        name: string;
        picture: string;

    }

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse?.credential) {
            try {
                const credential = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
                console.log("Google user:", credential);
                const client: Client = {
                    email: credential.email,
                    name: credential.name,
                    googleVerification: true,
                    profile_image: credential.picture,
                    role: 'user'
                }
                const response = await googleLogin(client)
                // console.log(response)
                dispatch(addToken(response.accessToken));
                dispatch(addUser(response.createUser));
                toast.success("Google Login successful!");
                navigate("/", { replace: true });
            } catch {
                toast.error("Something went wrong with Google login.");
            }
        } else {
            toast.error("No credential returned from Google.");
        }
    };

    const handleGoogleFailure = () => {
        toast.error("Google login failed.");
    };

    return (
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                theme="filled_black"
                shape="pill"
                width="100%"
                useOneTap
            />

        </div>
    )
}

export default Google