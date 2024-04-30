import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNewUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setemail] = useState("");
  const [sex, setSex] = useState("");
  const [passport, setPassport] = useState("");
  const [role, setRole] = useState("");
  const [bvn, setBvn] = useState("");
  const [address, setaddress] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      phone: phone,
      email: email,
      sex: sex,
      roles: role,
      bvn: bvn,
      homeAddress: address,
      password: password,
    };
    const token = localStorage.getItem("token"); // Replace 'your_token_key' with the actual key you use to store the token

    try {
      const response = await fetch(
        "https://eaglevision.onrender.com/api/v1/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("User added successfully", data);
        navigate("/users-list");
        // Further actions on successful addition of user
      } else {
        console.error("Failed to add user", data.message);
        // Handle error message or failed addition
      }
    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
    }
  };

  return (
    <>
      <div class="col-xl-12 col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Add User</h4>
          </div>
          <div class="card-body">
            <div class="basic-form">
              <div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      class="form-control"
                      placeholder="First Name"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Middle Name</label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Middle Name"
                      class="form-control"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setlastName(e.target.value)}
                      class="form-control"
                      placeholder="Last Name"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label>Phone</label>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      class="form-control"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Sex</label>
                    <select
                      id="inputState"
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      class="default-select form-control wide"
                    >
                      <option selected>Select Gender</option>
                      <option value={"male"}>Male</option>
                      <option value={"female"}>Female</option>
                    </select>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Passport</label>
                    <input
                      type="file"
                      value={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Role:</label>
                    <select
                      id="inputState"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      class="default-select form-control wide"
                    >
                      <option selected>Select Role</option>
                      <option value={"accountOfficer"}>Account Officer</option>
                      <option value={"superAdmin"}>Super Admin</option>
                      <option value={"manager"}>Manager</option>
                      <option value={"accountManager"}>Account Manager</option>
                      <option value={"dpo"}>DPO</option>
                    </select>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">BVN</label>
                    <input
                      type="number"
                      value={bvn}
                      onChange={(e) => setBvn(e.target.value)}
                      placeholder="BVN"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Home Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setaddress(e.target.value)}
                      placeholder="Home Address"
                      class="form-control"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Email</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      placeholder="Email"
                      class="form-control"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      class="form-control"
                    />
                  </div>
                </div>

                <button class="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewUser;
