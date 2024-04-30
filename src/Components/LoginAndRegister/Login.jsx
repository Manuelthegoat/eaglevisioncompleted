import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/Loader";
import { useCookies } from "react-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['userToken', 'userId']);
  const [showPassword, setShowPassword] = useState(false);


  const onPress = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://eaglevision.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            roles: role,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data);
        toast.success("Login Successfull");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("username", data.data.user.fullName);
        localStorage.setItem("userId", data.data.user._id);

        const sevenDaysInSeconds = 7 * 24 * 60 * 60;
        setCookie('userToken', data.data.token, { path: '/', maxAge: sevenDaysInSeconds });
        setCookie('userId', data.data.user._id, { path: '/', maxAge: sevenDaysInSeconds });
        window.location.reload();
      } else {
        console.error("Login failed", data.message);
      }
    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
      toast.error("Login failed");
    } finally {
      setLoading(false); // <-- stop the loader
    }
  };
  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <div
        class="vh-100"
        style={{
          "background-image": "url('images/bg.png')",
          "background-position": "center",
        }}
      >
        <div class="authincation h-100">
          <div class="container h-100">
            <div class="row justify-content-center h-100 align-items-center">
              <div class="col-md-6">
                <div class="authincation-content">
                  <div class="row no-gutters">
                    <div class="col-xl-12">
                      <div class="auth-form">
                        <div class="text-center mb-3">
                          <a>
                            <img src="./images/logo/logofull.png" alt="" />
                          </a>
                        </div>
                        <h4 class="text-center mb-4">
                          Sign in to your account
                        </h4>
                        <div>
                          <div class="mb-3">
                            <label class="mb-1">
                              <strong>Email</strong>
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              class="form-control"
                              placeholder="hello@example.com"
                            />
                          </div>
                          <div className="mb-3 position-relative">
        <label className="mb-1">
          <strong>Password</strong>
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
          <i
            className={`password-toggle-icon position-absolute ${
              showPassword ? "fa fa-eye-slash" : "fa fa-eye"
            }`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
      </div>
                          <div class="mb-3">
                            <label class="mb-1">
                              <strong>Role</strong>
                            </label>
                            <select
                              id="inputState"
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                              class="default-select form-control wide"
                            >
                              <option selected>Select Role</option>
                              <option value={"dpo"}>Dpo</option>
                              <option value={"accountOfficer"}>
                                Account Officer
                              </option>
                              <option value={"assistantManager"}>
                                Assistant Manager
                              </option>
                              <option value={"manager"}>
                                Manager
                              </option>
                              <option value={"superAdmin"}>
                                Super Admin
                              </option>
                            </select>
                          </div>
                          <div class="text-center mt-4">
                            <button
                              class="btn btn-primary btn-block"
                              onClick={onPress}
                            >
                              Sign me In
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
