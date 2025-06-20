import { useState } from "react";
import { useForm } from "react-hook-form";
import supabase from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";

function AuthForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function onSubmit(data) {
    setMessage("");
    // Clear previous field-specific errors
    setError("email", { message: "" });
    setError("password", { message: "" });

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login")) {
          setError("password", {
            type: "manual",
            message: "Incorrect password. Please try again.",
          });
        } else {
          setError("email", { type: "manual", message: error.message });
        }
      } else {
        setMessage("Login successful!");
        navigate("/app");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { display_name: data.name },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setError("email", {
            type: "manual",
            message: "This email is already registered. Please log in instead.",
          });
        } else {
          setError("email", { type: "manual", message: error.message });
        }
      } else {
        localStorage.setItem("pendingEmail", data.email);
        setMessage("Sign up successful! Check your email.");
        navigate("/verification-code-to-mail");
      }
    }
  }

  return (
    <div className="auth-container">
      <Link to="/" className="logo-link">
        Back
      </Link>

      <h1 className="form-h1">{isLogin ? "Welcome Back 👋" : "Register"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Enter your email"
        />
        {errors.email && <p className="input-error">{errors.email.message}</p>}

        {!isLogin && (
          <input
            type="text"
            {...register("display_name", { required: true })}
            placeholder="Enter your name"
          />
        )}

        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="input-error">{errors.password.message}</p>
        )}

        <button type="submit">{isLogin ? "Login" : "Register"} </button>
        {message && <p style={{ color: "green" }}>{message}</p>}

        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => {
            setMessage("");
            setIsLogin(!isLogin);
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
