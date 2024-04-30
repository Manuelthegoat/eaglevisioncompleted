import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import { CookiesProvider, useCookies } from "react-cookie";

const RepayLoan = () => {
  const [loading, setLoading] = useState(true);

  const [loanApplicantsDetails, setLoanApplicantsDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [debitCredit, setDebitCredit] = useState("");
  const [repaymentDate, setRepaymentDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [collectedBy, setcollectedBy] = useState("");
  const [description, setDescription] = useState("");
  const [cookies] = useCookies(["userId"]);

  const [type, setType] = useState("");
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [userss, setUserss] = useState([]);


  const { id } = useParams();
  const navigate = useNavigate();
  // const deleteLoan = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://eaglevision.onrender.com/api/v1/loans/${id}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     console.log("Deleted Loan:", data);
  //   } catch (error) {
  //     console.error("There was a problem with the delete operation:", error.message);
  //     toast.error("An Error Occurred while deleting the loan", error.message);
  //   }
  // };

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
        setUserss(data.data);
      })
      .catch((error) => console.log("Error fetching Logged In data: ", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://eaglevision.onrender.com/api/v1/loans/${id}`, {
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
        console.log("Fetched Specific Loan  ewe Data:", data.data);
        setLoanApplicantsDetails(data.data);

        // fetch customer details using the id from loanApplicantsDetails.customer
        return fetch(
          `https://eaglevision.onrender.com/api/v1/customers/${data.data.customer}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
        return response.json();
      })
      .then((customerData) => {
        console.log("Fetched Customer Data:", customerData);
        setCustomerDetails(customerData.data);
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
        toast.error("Customer Failed To Fetched");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      type: debitCredit === "debit" ? "withdrawal" : "deposit",
      customerId: customerDetails._id,
      amount: repaymentAmount,
      interestRate: interestRate,
      loanStartDate: loanApplicantsDetails?.loanStartDate,
      loanEndDate: loanApplicantsDetails?.loanEndDate,
      repaymentDate: repaymentDate,
      modeOfPayment: type,
      collectedBy: collectedBy,
      paymentDate: paymentDate,
      name: loanApplicantsDetails?.name ,
      description: description,
      firstGuarantorsName: loanApplicantsDetails?.firstGuarantorsName,
      firstGuarantorsPhoneNumber: loanApplicantsDetails?.firstGuarantorsPhoneNumber,
      firstGuarantorsOccupation: loanApplicantsDetails?.firstGuarantorsOccupation,
      secondGuarantorsName: loanApplicantsDetails?.firstGuarantorsName,
      secondGuarantorsOccupation: loanApplicantsDetails?.secondGuarantorsOccupation,
      secondGuarantorsPhoneNumber: loanApplicantsDetails?.secondGuarantorsPhoneNumber,
      uploadedBy: userss.firstName+" "+ userss.lastName,
    };

    console.log(formData);
    setLoading(true);
    const postEndpoint =
      debitCredit === "debit" ? "/loans/withdrawals" : "/loans/deposits";
    const token = localStorage.getItem("token");

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
      toast.success("Repayment Added");
      // deleteLoan();
      setTimeout(() => {
        navigate("/loan-applicants");
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
    <>
          <CookiesProvider>

      {loading && <Loader />}
      <ToastContainer />
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
                    <label class="form-label">Repayment Amount</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Repayment Amount"
                      value={repaymentAmount}
                      onChange={(e) => setRepaymentAmount(e.target.value)}
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      class="default-select form-control wide"
                    >
                      <option value="">Select One</option>
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                  {/* <div class="mb-3 col-md-6">
                    <label class="form-label">Uploaded By</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      class="default-select form-control wide"
                    >
                    <option value="">Select One</option>
                    
                    </select>
                  </div>*/}
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Interest Amount</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder={loanApplicantsDetails?.interestRate}
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Collected By</label>

                    <select
                      value={collectedBy}
                      onChange={(e) => setcollectedBy(e.target.value)}
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
                    <label class="form-label">Loan Start Date</label>
                    <p>{loanApplicantsDetails?.loanStartDate}</p>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Loan End Date</label>
                    <p>{loanApplicantsDetails?.loanEndDate}</p>
                  </div>

                  <div class="mb-3 col-md-6">
                    <label class="form-label">Payment Date</label>
                    <input
                      type="date"
                      class="form-control"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Re-Payment Date</label>
                    <input
                      type="date"
                      class="form-control"
                      value={repaymentDate}
                      onChange={(e) => setRepaymentDate(e.target.value)}
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label">Description</label>
                    <input
                      type="text"
                      class="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
    </>
  );
};

export default RepayLoan;
