import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/OTPVerification.css";

const OTP_URL = "http://localhost:5000/api/auth/verify-otp";
const RESEND_URL = "http://localhost:5000/api/auth/resend-otp";

export const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state
  const email = location.state?.email || "";
//   const username = location.state?.username || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(OTP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Email verified successfully!");
        // Store token if provided
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/login", { 
          state: { message: "Email verified! You can now login." }
        });
      } else {
        toast.error(data.message || "OTP verification failed");
        if (data.attemptsLeft !== undefined) {
          toast.info(`${data.attemptsLeft} attempts remaining`);
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    
    try {
      const response = await fetch(RESEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("New OTP sent to your email!");
        setTimeLeft(600); // Reset timer
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="auth-container">
      <section>
        <main>
          <div className="section-registration">
            <div className="container">
              <div className="otp-verification-form">
                <h1 className="main-heading">Verify Your Email</h1>
                
                <div className="otp-info">
                  <p>We've sent a 6-digit verification code to:</p>
                  <strong>{email}</strong>
                  <p>Please enter the code below to verify your account.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="otp-input-container">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="otp-input"
                        maxLength="1"
                        pattern="[0-9]"
                        inputMode="numeric"
                        autoComplete="off"
                        disabled={loading}
                      />
                    ))}
                  </div>

                  <div className="timer-container">
                    {timeLeft > 0 ? (
                      <p>Code expires in: <span className="timer">{formatTime(timeLeft)}</span></p>
                    ) : (
                      <p className="expired">Code has expired</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-submit"
                    disabled={loading || otp.join("").length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>
                </form>

                <div className="resend-section">
                  <p>Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="btn-resend"
                    disabled={!canResend || resendLoading}
                  >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                  </button>
                </div>

                <div className="back-to-register">
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="btn-link"
                  >
                    ← Back to Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};
