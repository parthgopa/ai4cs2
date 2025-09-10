import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "../styles/Register.css";

const URL = "http://localhost:5000/api/auth/register";
const FIREBASE_URL = "http://localhost:5000/api/auth/firebase-login";

export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const { storeTokenInLS } = useAuth();

  //handling the input values
  const handleInput = (e) => {
    console.log(e);
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  // handle form on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      console.log("res from server", res_data.extraDetails);

      if (response.ok) {
        // Clear form data
        setUser({ username: "", email: "", phone: "", password: "" });
        toast.success("Registration successful! Please check your email for OTP verification.");
        // Navigate to OTP verification with email as state
        navigate("/verify-otp", { state: { email: user.email } });
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }

    } catch (error) {
      console.log("register ", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleGoogleRegister = async () => {
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
      console.error(err);
      toast.error("Google login error");
    }
  };

  //? the CORS(Cross-Origin Resourse Sharing) policy is a security feature implemented by web browsers to restrict webpages from making requests to a different domain tan the one that served the webpage. In the context of a MERN stack application you might encounter CORS issues when the frontend and backend are hosted on different domains

  return (
    <div className="auth-container">
      <section>
        <main>
          <div className="section-registration">
            <div className="container">
              <div className="registration-form">
                <h1 className="main-heading">Registration Form</h1>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      id="username"
                      required
                      autoComplete="off"
                      value={user.username}
                      onChange={handleInput}
                    />
                  </div>
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
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="number"
                      name="phone"
                      placeholder="Enter your phone number"
                      id="phone"
                      required
                      autoComplete="off"
                      value={user.phone}
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
                    Register Now
                  </button>
                </form>
                <div className="google-register-section">
                  <div className="divider">Or</div>
                  <button type="button" className="btn btn-outline-primary" onClick={handleGoogleRegister}>
                    Continue with Google
                  </button>
                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <span style={{ color: 'var(--muted-color)' }}>Already have an account? </span>
                    <button 
                      type="button" 
                      onClick={() => navigate('/login')}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--primary-color)', 
                        textDecoration: 'underline', 
                        cursor: 'pointer',
                        fontSize: 'inherit'
                      }}
                    >
                      Login here
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