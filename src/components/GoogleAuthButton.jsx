import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function GoogleAuthButton({ onSuccessLogin }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential; // Google ID token (JWT)
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/auth/google`,
        { token: idToken },
        { withCredentials: true }
      );
      // res sets httpOnly cookie; also returns profile for UI
      onSuccessLogin?.(res.data);
    } catch (e) {
      console.error("Google Sign-In failed:", e);
      alert(e?.response?.data?.error || "Google Sign-In failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google Sign-In failed")}
      useOneTap={false}
    />
  );
}
