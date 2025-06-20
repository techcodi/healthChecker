import { useForm } from "react-hook-form";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Verification.css";
function Verification() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storeEamil = localStorage.getItem("pendingEmail");
    if (!storeEamil) {
      setError("No email found. Please try signing up again.");
      return;
    }
    setEmail(storeEamil);
    startCountdown();
  }, []);

  const startCountdown = () => {
    setTimer(60);
    setIsVisible(true);
    const timer = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data) => {
    const { error } = await supabase.auth.verifyOtp({
      token: data.code,
      type: "email",
      email,
    });
    if (error) setError(error.message);
    else {
      localStorage.removeItem("pendingEmail");
      navigate("/app");
    }
  };

  const resendCode = async () => {
    const { error } = await supabase.auth.resend({
      type: "email",
      email: email,
    });
    if (error) setError(error.message);
    else {
      setError("Verification code resent successfully.");
      startCountdown();
    }
  };
  return (
    <div className="verification-container">
      <h3>Enter your verification code</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="verification-form">
        <p>
          We have sent a verification code to your email. Please enter it below
          to verify your account.
        </p>
        <input
          type="text"
          {...register("code", { required: "Code is required" })}
        />
        {errors.code && <p>{errors.code.message}</p>}
        {error && <p>{error}</p>}
        {isVisible ? (
          <p>
            Resend available in <strong>{timer}s</strong>
          </p>
        ) : (
          <button type="button" onClick={resendCode} className="resend-btn">
            Resend Code
          </button>
        )}
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default Verification;
