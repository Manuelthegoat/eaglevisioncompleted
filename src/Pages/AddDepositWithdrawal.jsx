import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Components/Loader/Loader";
import { CookiesProvider, useCookies } from "react-cookie";

const AddDepositWithdrawal = () => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["userId"]);
  const [debitCredit, setDebitCredit] = useState("");
  const [type, setType] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace 'your_token_key' with the actual key you use to store the token

    fetch(`https://eaglevision.onrender.com/api/v1/customers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Specific Customer Data:", data.data);
        setCustomerDetails(data.data);
      })
      .catch((error) =>
        console.log("Error fetching specific customer data: ", error)
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace 'your_token_key' with the actual key you use to store the token

    fetch(`https://eaglevision.onrender.com/api/v1/users/${cookies.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Logged In User Data:", data.data);
        setUser(data.data);
        console.log("emmanuel", data.data);
      })
      .catch((error) => console.log("Error fetching Logged In data: ", error))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      amount: amount,
      type: debitCredit === "debit" ? "withdrawal" : "deposit",
      choose: debitCredit,
      customerId: customerDetails?._id,
      collectedBy: collectedBy,
      description: description,
      modeOfPayment: type,
      paymentDate: paymentDate,
      uploadedBy: user.firstName+" "+ user.lastName,
      name: customerDetails?.name,

    };
    if (debitCredit !== "debit") {
      formData.modeOfPayment = type;
    }
    console.log(formData);
    setLoading(true);
    const postEndpoint =
      debitCredit === "debit"
        ? "/transactions/withdrawal"
        : "/transactions/deposit";
    const token = localStorage.getItem("token"); // Replace 'your_token_key' with the actual key you use to store the token

    try {
      const response = await fetch(
        `https://eaglevision.onrender.com/api/v1${postEndpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      toast.success(
        `${debitCredit === "debit" ? "Withdrawal" : "Deposit"} added`
      );
      setTimeout(() => {
        navigate("/savings-list");
      }, 1000);
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
      toast.error("An Error Occurred", error.message);
    } finally {
      setLoading(false); // <-- stop the loader
    }
  };
  useEffect(() => {
    fetch("https://eaglevision.onrender.com/api/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data.data);
        setUsers(data.data);
      })
      .catch((error) => console.log("Error fetching data: ", error))
      .finally(() => setLoading(false)); // Set loading to false here, after success or error
  }, []);
  return (
    <CookiesProvider>
      <ToastContainer />
      {loading && <Loader />}
      <div class="col-xl-12 col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Add Deposits/Withdrawal</h4>
          </div>
          <div class="card-body">
            <div class="basic-form">
              <div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Choose Debit / Credit</label>
                    <select
                      value={debitCredit}
                      onChange={(e) => {
                        setDebitCredit(e.target.value);
                        console.log(
                          "Value after changing debitCredit:",
                          e.target.value
                        );
                      }}
                      class="default-select form-control wide"
                    >
                      <option value="">Select One</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                  </div>

                  <div class="mb-3 col-md-6">
                    <label class="form-label">Customer</label>
                    <p>{customerDetails?.name}</p>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      class="form-control"
                      placeholder="Amount"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      class="default-select form-control wide"
                    >
                      <option value="">select one</option>
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                      <option value="credit_card">Credit Card</option>
                    </select>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Collected By</label>

                  <select
                      value={collectedBy}
                      onChange={(e) => setCollectedBy(e.target.value)}
                      class="default-select form-control wide"
                    >
                      <option value="">Select One</option>
                      {users.map((item, index) => (
                        <option value={item.firstName + item.lastName}>{item.firstName}&nbsp;
                        {item.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Payment Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      class="form-control"
                    />
                  </div>
                  <div class="mb-3 col-md-12">
                    <label class="form-label">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      class="form-control"
                      placeholder="Description"
                    />
                  </div>
                </div>

                <button onClick={handleSubmit} class="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CookiesProvider>
  );
};

export default AddDepositWithdrawal;
