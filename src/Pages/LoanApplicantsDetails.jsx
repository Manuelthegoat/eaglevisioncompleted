import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";

const LoanApplicantsDetails = () => {
  const [loading, setLoading] = useState(true);

  const [loanApplicantsDetails, setLoanApplicantsDetails] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);

  const { id } = useParams();
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
        console.log("Fetched Specific Loan Data:", data.data);
        setLoanApplicantsDetails(data.data);

        // fetch customer details using the id from loanApplicantsDetails.customer
        return fetch(
          `https://eaglevision.onrender.com/api/v1/customers/${data.data?.customer}`, {
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch repayments using the customer id
    if (customerDetails) {
      fetch(
        `https://eaglevision.onrender.com/api/v1/loans/customer/${loanApplicantsDetails?.customer}/loans`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((repaymentsData) => {
          console.log("Fetched Repayments Data:", repaymentsData.data);
          setRepayments(repaymentsData.data);
        })
        .catch((error) => {
          console.log("Error fetching repayments data: ", error);
          toast.error("Repayments Failed To Fetched");
        });
    }
  }, [customerDetails]);

  function capitalizeFirstLetter(word) {
    return word?.charAt(0)?.toUpperCase() + word?.slice(1);
  }

  const exportToExcel = () => {
    const formattedData = repayments.map((loanitem, index) => [
      index + 1,
      `{new Date(loanitem.paymentDate).toDateString()}`,
      `{loanitem.type === 'withdrawal' ? 'Withdrawal' : 'Deposit'}`,

      `{loanitem.status === "withdrawn" ? (
    <>
      {repayment.amount?.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </>
  ) : (
    <>--------</>
  )}`,
      `{loanitem.status === "deposited" ? (
      <>
        {repayment.amount?.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </>
    ) : (
      <>--------</>
    )}`,
      loanitem.interestRate,
      loanitem.balance,
      loanitem.loanEndDate,
      loanitem.uploadedBy,
      `{new Date(loanitem.createdAt).toLocaleString()}`,
      `{new Date(loanitem.updatedAt).toLocaleString()}`,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      [
        "#",
        "Payment Date",
        "Description",
        "Mode",
        "Debit",
        "Credit",
        "interest Amount",
        "Balance",
        "Created At",
        "Updated At",
      ],
      ...formattedData,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loan Data");
    XLSX.writeFile(wb, "Eagle Vision Loan Repayments.xlsx");
  };
  function addCommas(number) {
    return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <div class="row">
        <div class="col-lg-12">
          <div class="profile card card-body px-3 pt-3 pb-0">
            <div class="profile-head">
              <div class="photo-content">
                <div class="cover-photo rounded"></div>
              </div>
              <div class="profile-info">
                <div class="profile-photo">
                  <img
                    src="images/userimage.png"
                    class="img-fluid rounded-circle"
                    alt=""
                  />
                </div>
                <div class="profile-details">
                  <div class="profile-name px-3 pt-2">
                    <h4 class="text-primary mb-0">
                      Name: {capitalizeFirstLetter(customerDetails?.name)}
                    </h4>
                    <p>Phone: {customerDetails?.customersPhoneNo}</p>
                    <p>Sex: {customerDetails?.sex}</p>
                  </div>
                  <div class="profile-email px-2 pt-2">
                    <p className="text-muted mb-0">
                      Guarantor Name:{" "}
                      {loanApplicantsDetails?.firstGuarantorsName}
                    </p>
                    <p>
                      Guarantor Phone:{" "}
                      {loanApplicantsDetails?.firstGuarantorsPhoneNumber}
                    </p>
                    <p>
                      Guarantor Occupation:{" "}
                      {loanApplicantsDetails?.firstGuarantorsOccupation}
                    </p>
                  </div>
                  <div class="profile-email px-2 pt-2">
                    <h2 className="text-muted mb-0">
                      Loan Balance: {addCommas(loanApplicantsDetails?.balance)}
                    </h2>
                  </div>
                  <div class="dropdown ms-auto">
                    <a
                      href="#"
                      class="btn btn-primary light sharp"
                      data-bs-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <rect x="0" y="0" width="24" height="24"></rect>
                          <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                          <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                          <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                        </g>
                      </svg>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li class="dropdown-item">
                        <i class="fa fa-user-circle text-primary me-2"></i> View
                        Customer Details
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div class="card">
          <div class="card-body">
            <div class="profile-statistics">
              <div class="text-center">
                <div class="row">
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-primary mb-2"
                      onClick={() => {
                        exportToExcel();
                      }}
                    >
                      EXPORT AS EXCEL
                    </button>
                  </div>
                  <div class="col">
                    <a class="btn btn-primary mb-1 me-1">Deposits/Withdrawal</a>
                  </div>
                  <div class="col">
                    <a class="btn btn-outline-primary mb-1 me-1">Loans</a>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div class="col-xl-12 col-xxl-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Repayments</h4>
              <div class="d-flex align-items-center flex-wrap flex-sm-nowrap">
                {/* <a href="/add-contribution" className="btn btn-primary mb-2">
                  Repay Loan
                </a> */}
                <Link to={`/repay-loan/${id}`} class="btn btn-primary mb-2">
                  Add Loan/ Repay
                </Link>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive active-projects">
                <div className="rowed"></div>

                <table id="projects-tbl" class="table">
                  <thead>
                    <tr>
                      <th>Payment Date</th>
                      <th>Description</th>
                      <th>Mode</th>
                      <th>Debit</th>
                      <th>Credit</th>
                      <th>Interest Amount</th>
                      <th>Balance</th>
                      <th>Uploaded By</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repayments &&
                      repayments.map((repayment) => (
                        <tr key={repayment._id}>
                          <td>
                            {new Date(
                              repayment.paymentDate
                            ).toDateString()}
                          </td>
                          <td>
                            {repayment.description}
                          </td>
                          <td>{repayment.modeOfPayment}</td>
                          <td>
                            &#8358;
                            {repayment.status === "withdrawn" ? (
                              <>
                              {addCommas(repayment.amount?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }))}
                              </>
                            ) : (
                              <>--------</>
                            )}
                          </td>

                          <td>
                            &#8358;{" "}
                            {repayment.status === "deposited" ? (
                              <>
                              {addCommas(repayment.amount?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }))}
                              </>
                            ) : (
                              <>--------</>
                            )}
                          </td>
                          <td>&#8358;{addCommas(repayment.interestRate)}</td>
                          <td>&#8358;{addCommas(repayment.balance)}</td>
                          <td>{repayment.collectedBy}</td>
                          <td>
                            {new Date(repayment.createdAt).toDateString()}
                          </td>
                          <td>
                            {new Date(repayment.updatedAt).toDateString()}
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

export default LoanApplicantsDetails;
