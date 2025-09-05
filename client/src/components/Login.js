import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

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

      console.log("login", response);

      const res_data = await response.json();

      if (response.ok) {
        storeTokenInLS(res_data.token);
        // localStorage.setItem("token", res_data.token);

        setUser({ email: "", password: "" });
        toast.success("Login Successful");
        navigate("/");
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }

    } catch (error) {
      console.log(error);
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
      console.error(err);
      toast.error("Google login error");
    }
  };

  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image reg-img">
                <img
                  src="/images/login.png"
                  alt="let's fill the login form"
                  width="400"
                  height="500"
                />
              </div>
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">Login form</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="enter your email"
                      id="email"
                      required
                      autoComplete="off"
                      value={user.email}
                      onChange={handleInput}
                    />
                  </div>

                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="password"
                      id="password"
                      required
                      autoComplete="off"
                      value={user.password}
                      onChange={handleInput}
                    />
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Login
                  </button>
                </form>
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ margin: "0.5rem 0" }}>Or</div>
                  <button type="button" className="btn btn-outline-primary" onClick={handleGoogleLogin}>
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

