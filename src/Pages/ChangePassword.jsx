import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import { CookiesProvider, useCookies } from "react-cookie";



const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["userId"]);


  const navigate = useNavigate();
  const usertokenlocal = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirmed password do not match!");
      return;
    }

    const payload = {
      currentPassword: oldPassword,
      newPassword: confirmPassword,
    };
    setLoading(true);

    try {
      const response = await fetch(`https://eaglevision.onrender.com/api/v1/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${usertokenlocal}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      toast.success("Password Changed Successfully");
      setTimeout(() => {
        navigate("/users");
      }, 1000);
      // Handle response based on your API's response structure
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An Error Occurred", error.message);
    } finally {
      setLoading(false); // <-- stop the loader
    }
  };
  return (
    <>
    <CookiesProvider>
      {loading && <Loader />}
      <ToastContainer />
      <div class="col-xl-12 col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Change Password</h4>
          </div>
          <div class="card-body">
            <div class="basic-form">
              <form onSubmit={handleSubmit}>
                <div class="row">
                  <div class="mb-3 col-md-12">
                    <label class="form-label">Old Password</label>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div class="mb-3 col-md-12">
                    <label class="form-label">New Password</label>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div class="mb-3 col-md-12">
                    <ul>
                      <li>
                        Your password can’t be too similar to your other
                        personal information.
                      </li>
                      <li>Your password must contain at least 8 characters.</li>
                      <li>Your password can’t be a commonly used password.</li>
                      <li>Your password can’t be entirely numeric.</li>
                    </ul>
                  </div>

                  <div class="mb-3 col-md-12">
                    <label class="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" class="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </CookiesProvider>
    </>
  );
};

export default ChangePassword;
