import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Components/Loader/Loader";

const UsersDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactData, setTransactData] = useState(null);
  const token = localStorage.getItem("token");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const { id } = useParams();
  useEffect(() => {
    fetch(`https://eaglevision.onrender.com/api/v1/users/${id}`, {
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
        console.log("Fetched Specific User Data:", data.data);
        setUserDetails(data.data);

        fetch(
          `https://eaglevision.onrender.com/api/v1/transactions/getAllTransactionsByCollector?collectedBy=${data.data.lastName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((transactionsResponse) => {
            if (!transactionsResponse.ok) {
              throw new Error("Network response was not ok");
            }
            return transactionsResponse.json();
          })
          .then((transactionsData) => {
            console.log("Fetched Transactions Data:", transactionsData);
            setTransactData(transactionsData); // Set the transactions data to the state
          })

          .catch((error) =>
            console.log("Error fetching transactions data: ", error)
          );
      })
      .catch((error) =>
        console.log("Error fetching specific User data: ", error)
      )
      .finally(() => setLoading(false));
  }, [id, token]);
  useEffect(() => {
    // ... (your existing useEffect code)

    // Calculate the sum of 'amount'
    const calculatedTotalAmount = transactData?.data.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Set the total amount in the state
    setTotalAmount(calculatedTotalAmount);
  }, [transactData]);
  return (
    <>
      {loading && <Loader />}
      <div className="row">
        <h2>
          Savings Collected By {userDetails?.firstName} {userDetails?.lastName}
        </h2>
        <div class="col-xl-4 col-xxl-4 col-sm-6">
          <div class="card crm-cart bg-primary border-0">
            <div class="card-header border-0 pt-15"></div>
            <div class="card-body">
              <div class="crm-cart-data">
                <p class="text-white">&#8358; 0.00</p>
                <span class="d-block mb-3 text-white">Daily Savings</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-xxl-4 col-sm-6">
          <div class="card crm-cart bg-primary border-0">
            <div class="card-header border-0 pt-15"></div>
            <div class="card-body">
              <div class="crm-cart-data">
                <p class="text-white">&#8358; {totalAmount?.toFixed(2)}</p>
                <span class="d-block mb-3 text-white">Total Savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div class="col-xl-12 col-xxl-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title"></h4>
              <div class="d-flex align-items-center flex-wrap flex-sm-nowrap">
                <div class="mb-3 mt-2 mx-sm-2">
                  <label class="sr-only">Search</label>
                  <input
                    type="Search"
                    class="form-control"
                    placeholder="Search"
                  />
                </div>
                &nbsp;
                <button type="submit" class="btn btn-primary mb-2">
                  Search
                </button>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive active-projects">
                <div className="rowed"></div>

                <table id="projects-tbl" class="table">
                  <thead>

                    <tr>
                      <th>Customer</th>
                      <th>Payment Date</th>
                      <th>Desc</th>
                      <th>Type</th>
                      <th>Credit</th>
                      <th>Debit</th>
                      <th>Avail Bal (N)</th>
                      <th>Old Bal (N)</th>
                      <th>Mode</th>
                      <th>Collected By</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {transactData &&
                    transactData.data.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{transaction.customer}</td>
                        <td>{new Date(transaction.paymentDate).toDateString()}</td>
                        <td>{transaction.description}</td>
                        <td>
                          <span className={`badge light badge-${transaction.choose === 'credit' ? 'success' : 'danger'}`}>
                            {transaction.choose}
                          </span>
                        </td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.type === 'withdrawal' ? transaction.amount : '-----'}</td>
                        <td>{transaction.balance}</td>
                        <td>{transaction.balance - transaction.amount}</td>
                        <td>{transaction.modeOfPayment}</td>
                        <td>{transaction.collectedBy}</td>
                        <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                        <td>{new Date(transaction.updatedAt).toLocaleString()}</td>
                        <td>
                          <div className="dropdown">
                            {/* Your existing dropdown button and menu */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersDetails;
