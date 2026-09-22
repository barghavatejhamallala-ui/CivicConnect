import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  CheckCircle2,
} from "lucide-react";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formError, setFormError] = useState("");

  const [errors, setErrors] = useState({});

  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    area: "",
    password: "",
    confirmPassword: "",
  });

  // ---------------- LOGIN ----------------

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLoginForm({
      ...loginForm,
      [name]: type === "checkbox" ? checked : value,
    });

    setFormError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setFormError("");
    setErrors({});

    const newErrors = {};

    if (!loginForm.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!loginForm.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Get saved password from localStorage.
      // If no password has been saved yet,
      // use the default worker password.
      const savedPassword =
        localStorage.getItem("workerPassword");

      const validPassword =
        savedPassword || "worker@1234";

      if (
        loginForm.username === "worker" &&
        loginForm.password === validPassword
      ) {
        // Save password if this is the first/default login.
        localStorage.setItem(
          "workerPassword",
          loginForm.password
        );

        // Save worker details for Profile page
        localStorage.setItem(
          "workerAccount",
          JSON.stringify({
            name: "CivicConnect Worker",
            username: "worker",
            email: "worker@civicconnect.com",
            phone: "+91 98765 43210",
            area: "Visakhapatnam",
            workerId: "CW-1025",
            department: "Municipal Services",
          })
        );

        localStorage.setItem("workerLoggedIn", "true");

        if (loginForm.remember) {
          localStorage.setItem(
            "rememberWorker",
            "true"
          );
        } else {
          localStorage.removeItem("rememberWorker");
        }

        navigate("/welcome");
      } else {
        setFormError("Invalid username or password");
        setIsSubmitting(false);
      }
    }, 800);
  };

  // ---------------- SIGNUP ----------------

  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    setSignupForm({
      ...signupForm,
      [name]: value,
    });

    setFormError("");
  };

  const handleSignup = (e) => {
    e.preventDefault();

    setFormError("");
    setErrors({});

    const newErrors = {};

    if (!signupForm.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!signupForm.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!signupForm.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!signupForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!signupForm.area.trim()) {
      newErrors.area = "Area is required";
    }

    if (!signupForm.password) {
      newErrors.password = "Password is required";
    }

    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    }

    if (
      signupForm.password &&
      signupForm.confirmPassword &&
      signupForm.password !== signupForm.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save signup password for Login and
      // Change Password functionality.
      localStorage.setItem(
        "workerPassword",
        signupForm.password
      );

      // Save signup details for Profile page
      localStorage.setItem(
        "workerAccount",
        JSON.stringify({
          name: signupForm.name,
          username: signupForm.username,
          email: signupForm.email,
          phone: signupForm.phone,
          area: signupForm.area,
          workerId:
            "CW-" +
            Math.floor(
              1000 + Math.random() * 9000
            ),
          department: "Municipal Services",
        })
      );

      localStorage.setItem(
        "workerLoggedIn",
        "true"
      );

      // Changed:
      // Signup now goes to Welcome first,
      // just like normal Login.
      navigate("/welcome");
    }, 800);
  };

  // ---------------- FORGOT PASSWORD ----------------

  const handleForgotSubmit = (e) => {
    e.preventDefault();

    setFormError("");

    if (!resetEmail.trim()) {
      setFormError(
        "Please enter your registered username or email."
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setResetSent(true);
    }, 900);
  };

  const openForgotPassword = () => {
    setMode("forgot");
    setFormError("");
    setErrors({});
    setResetEmail("");
    setResetSent(false);
  };

  const backToLogin = () => {
    setMode("login");
    setFormError("");
    setErrors({});
    setResetEmail("");
    setResetSent(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Back to Home */}

        <button
          type="button"
          className="back-home-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        {/* ================= FORGOT PASSWORD ================= */}

        {mode === "forgot" ? (
          <div className="forgot-password-section">

            {!resetSent ? (
              <>
                <div className="forgot-icon">
                  <LockKeyhole size={32} />
                </div>

                <h1>Forgot Password?</h1>

                <p className="login-subtitle forgot-subtitle">
                  Don't worry. Enter your registered username
                  or email and we'll help you reset your password.
                </p>

                {formError && (
                  <div className="form-error">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleForgotSubmit}>

                  <div className="login-field">
                    <label>
                      Username or Email
                    </label>

                    <div className="forgot-input-wrapper">
                      <Mail size={18} />

                      <input
                        type="text"
                        placeholder="Enter username or email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setFormError("");
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="login-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={18}
                          className="loading-icon"
                        />
                        Sending Request...
                      </>
                    ) : (
                      "Send Reset Request"
                    )}
                  </button>

                </form>

                <button
                  type="button"
                  className="back-login-button"
                  onClick={backToLogin}
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <div className="forgot-success-icon">
                  <CheckCircle2 size={38} />
                </div>

                <h1>Request Submitted</h1>

                <p className="login-subtitle forgot-subtitle">
                  Your password reset request has been
                  submitted successfully.
                </p>

                <div className="reset-info-box">
                  <strong>What's next?</strong>

                  <p>
                    Please contact your municipal authority
                    to complete the worker password reset.
                  </p>
                </div>

                <button
                  type="button"
                  className="login-button"
                  onClick={backToLogin}
                >
                  Back to Login
                </button>
              </>
            )}

          </div>
        ) : (
          <>
            {/* Logo */}

            <div className="login-logo">
              <img
                src="/images/logo.png"
                alt="CivicConnect"
              />
            </div>

            <h1>Worker Portal</h1>

            <p className="login-subtitle">
              Access your CivicConnect municipal worker account
            </p>

            {/* Login / Signup Tabs */}

            <div className="login-tabs">

              <button
                type="button"
                className={
                  mode === "login" ? "active" : ""
                }
                onClick={() => {
                  setMode("login");
                  setErrors({});
                  setFormError("");
                }}
              >
                Login
              </button>

              <button
                type="button"
                className={
                  mode === "signup" ? "active" : ""
                }
                onClick={() => {
                  setMode("signup");
                  setErrors({});
                  setFormError("");
                }}
              >
                Sign Up
              </button>

            </div>

            {formError && (
              <div className="form-error">
                {formError}
              </div>
            )}

            {/* ================= LOGIN FORM ================= */}

            {mode === "login" && (
              <form onSubmit={handleLogin}>

                <div className="login-field">
                  <label>Username</label>

                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                  />

                  {errors.username && (
                    <small className="field-error">
                      {errors.username}
                    </small>
                  )}
                </div>

                <div className="login-field">
                  <label>Password</label>

                  <div className="password-wrapper">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Enter password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>

                  {errors.password && (
                    <small className="field-error">
                      {errors.password}
                    </small>
                  )}
                </div>

                <div className="login-options">

                  <label className="remember-me">

                    <input
                      type="checkbox"
                      name="remember"
                      checked={loginForm.remember}
                      onChange={handleLoginChange}
                    />

                    <span>Remember me</span>

                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={openForgotPassword}
                  >
                    Forgot password?
                  </button>

                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="loading-icon"
                      />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

              </form>
            )}

            {/* ================= SIGNUP FORM ================= */}

            {mode === "signup" && (
              <form onSubmit={handleSignup}>

                <div className="login-field">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                  />

                  {errors.name && (
                    <small className="field-error">
                      {errors.name}
                    </small>
                  )}
                </div>

                <div className="login-field">
                  <label>Username</label>

                  <input
                    type="text"
                    name="username"
                    placeholder="Create username"
                    value={signupForm.username}
                    onChange={handleSignupChange}
                  />

                  {errors.username && (
                    <small className="field-error">
                      {errors.username}
                    </small>
                  )}
                </div>

                <div className="login-field">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                  />

                  {errors.email && (
                    <small className="field-error">
                      {errors.email}
                    </small>
                  )}
                </div>

                <div className="login-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={signupForm.phone}
                    onChange={handleSignupChange}
                  />

                  {errors.phone && (
                    <small className="field-error">
                      {errors.phone}
                    </small>
                  )}
                </div>

                <div className="login-field">
                  <label>Assigned Area</label>

                  <input
                    type="text"
                    name="area"
                    placeholder="Enter assigned area"
                    value={signupForm.area}
                    onChange={handleSignupChange}
                  />

                  {errors.area && (
                    <small className="field-error">
                      {errors.area}
                    </small>
                  )}
                </div>

                <div className="login-field">
                  <label>Password</label>

                  <div className="password-wrapper">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Create password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>

                  {errors.password && (
                    <small className="field-error">
                      {errors.password}
                    </small>
                  )}
                </div>

                <div className="login-field">
                  <label>Confirm Password</label>

                  <div className="password-wrapper">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={
                        signupForm.confirmPassword
                      }
                      onChange={handleSignupChange}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>

                  {errors.confirmPassword && (
                    <small className="field-error">
                      {errors.confirmPassword}
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="loading-icon"
                      />
                      Creating account...
                    </>
                  ) : (
                    "Create Worker Account"
                  )}
                </button>

              </form>
            )}

            <p className="login-footer">
              © {new Date().getFullYear()} CivicConnect ·
              Municipal Worker Access Only
            </p>

          </>
        )}

      </div>
    </div>
  );
}

export default Login;