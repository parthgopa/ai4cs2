import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

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

        //stored the token in localstorage
        storeTokenInLS(res_data.token);
        // localStorage.setItem("token", res_data.token);
        setUser({ username: "", email: "", phone: "", password: "" });
        toast.success("Registration Successful");
        navigate("/login");
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }


    } catch (error) {
      console.log("register ", error);
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
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image reg-img">
                <img
                  src="/images/register.png"
                  alt="fill the registration form"
                  width="400"
                  height="500"
                />
              </div>
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">registration form</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="username">username</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="username"
                      id="username"
                      required
                      autoComplete="off"
                      value={user.username}
                      onChange={handleInput}
                    />
                  </div>
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
                    <label htmlFor="phone">phone</label>
                    <input
                      type="number"
                      name="phone"
                      id="phone"
                      required
                      autoComplete="off"
                      value={user.phone}
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
                    Register Now
                  </button>
                </form>
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ margin: "0.5rem 0" }}>Or</div>
                  <button type="button" className="btn btn-outline-primary" onClick={handleGoogleRegister}>
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