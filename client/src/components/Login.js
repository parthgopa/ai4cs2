import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "../styles/Login.css";

const URL = "http://localhost:5000/api/auth/login";
const FIREBASE_URL = "http://localhost:5000/api/auth/firebase-login";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { storeTokenInLS } = useAuth();

  // let handle the input field value
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });


      const res_data = await response.json();

      if (response.ok) {
        storeTokenInLS(res_data.token);
        // localStorage.setItem("token", res_data.token);

        setUser({ email: "", password: "" });
        toast.success("Login Successful");
        navigate("/");
      } else {
        // Check if the error is related to email verification
        if (res_data.message === "Please verify your email before logging in" || 
            res_data.message === "Email not verified") {
          toast.error("Please verify your email first. Redirecting to OTP verification...");
          setTimeout(() => {
            navigate("/verify-otp", { state: { email: user.email } });
          }, 2000);
        } 
        // Check if account is locked
        else if (res_data.accountLocked) {
          toast.error(res_data.message, {
            duration: 6000,
            style: {
              background: '#dc3545',
              color: 'white',
            },
          });
        }
        // Check if this is a failed login attempt with remaining attempts
        else if (res_data.attemptsRemaining !== undefined) {
          toast.error(res_data.message, {
            duration: 4000,
            style: {
              background: '#fd7e14',
              color: 'white',
            },
          });
        } 
        else {
          toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
        }
      }

    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await fetch(FIREBASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      if (response.ok) {
        storeTokenInLS(data.token);
        toast.success("Login Successful");
        navigate("/");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (err) {
      // User closed popup or other error
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error("Google login error:", err);
      }
    }
  };

  return (
    <div className="auth-container">
      <section>
        <main>
          <div className="section-registration">
            <div className="container">
              <div className="registration-form">
                <h1 className="main-heading">Login Form</h1>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      id="email"
                      required
                      autoComplete="off"
                      value={user.email}
                      onChange={handleInput}
                    />
                  </div>

                  <div>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      id="password"
                      required
                      autoComplete="off"
                      value={user.password}
                      onChange={handleInput}
                    />
                  </div>
                  <button type="submit" className="btn btn-submit">
                    Login
                  </button>
                </form>
                <div className="google-login-section">
                  <div className="divider">Or</div>
                  <button type="button" className="btn btn-outline-primary" onClick={handleGoogleLogin}>
                    Continue with Google
                  </button>
                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <span style={{ color: 'var(--muted-color)' }}>Don't have an account? </span>
                    <button 
                      type="button" 
                      onClick={() => navigate('/register')}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--primary-color)', 
                        textDecoration: 'underline', 
                        cursor: 'pointer',
                        fontSize: 'inherit'
                      }}
                    >
                      Sign up here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

