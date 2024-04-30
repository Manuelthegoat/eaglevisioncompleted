import React, { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

const LoanApplicants = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]); // stores all fetched data
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const customersPerPage = 10;
  const pagesVisited = pageNumber * customersPerPage;

  function addCommas(number) {
    return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let apiUrl;

        if (startDate && endDate) {
          // If start and end dates are provided, fetch data for the date range
          apiUrl = `https://eaglevision.onrender.com/api/v1/loans/by-payment-date?startDate=${startDate}&endDate=${endDate}`;
        } else {
          // If start and end dates are not provided, fetch all data
          apiUrl = "https://eaglevision.onrender.com/api/v1/loans";
        }

        const token = localStorage.getItem("token");

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        const uniqueLoans = data.data.reduceRight((unique, loan) => {
          const existingIndex = unique.findIndex(
            (uniqueLoan) => uniqueLoan.customer === loan.customer
          );

          if (existingIndex === -1) {
            unique.unshift(loan);
          }

          return unique;
        }, []);

        setLoans(uniqueLoans);
        setAllCustomers(uniqueLoans);
        setDisplayedCustomers(
          uniqueLoans
            .reverse()
            ?.slice(pagesVisited, pagesVisited + customersPerPage)
        );

        toast.success("Fetched All");
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch loan data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, pageNumber]);

  const pageCount = Math.ceil(loans.length / customersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  function safeSumAndFormat(a, b) {
    const numberA = parseFloat(a);
    const numberB = parseFloat(b);

    if (!isNaN(numberA) && !isNaN(numberB)) {
      const sum = (numberA + numberB).toFixed(2);
      return addCommas(sum);
    }

    return "N/A"; // or some other default value if the conversion fails
  }
  const deleteLoan = async (loanId) => {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `https://eaglevision.onrender.com/api/v1/loans/${loanId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("Deleted Loan:", data);
          toast.success("Loan deleted successfully");

          window.location.reload();
        } catch (error) {
          console.error(
            "There was a problem with the delete operation:",
            error.message
          );
          toast.error(
            "An error occurred while deleting the loan",
            error.message
          );
        }
      }
    });
  };

  const exportToExcel = () => {
    const formattedData = loans.map((loanitem, index) => [
      index + 1,
      customerData
        ? `${customerData[index]?.name}\n${customerData[index]?.customersPhoneNo}`
        : "Loading customer data...",
      `₦ ${loanitem.amount}`,
      `₦ ${loanitem.interestRate}`,
      `₦ ${safeSumAndFormat(loanitem.amount, loanitem.interestRate)}`,
      // ... (add more columns as needed)
      loanitem.balance,
      loanitem.paymentDate
        ? new Date(loanitem.paymentDate).toDateString()
        : "N/A",
      loanitem.loanStartDate,
      loanitem.loanEndDate,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      [
        "#",
        "Name",
        "Amt Approved (₦)",
        "Interest On Loan (₦)",
        "Total Loan + Interest (₦)",
        "Balance",
        "Payment Date",
        "Approved Date",
        "Loan Due Date",
      ],
      ...formattedData,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loan Data");
    XLSX.writeFile(wb, "Eagle Vision Loan Report.xlsx");
  };
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);

    // Immediately filter the data when a date is selected
    const date = new Date(event.target.value);
    const filteredCustomers = allCustomers.filter((customer) => {
      const customerCreatedAt = new Date(customer.paymentDate);
      return customerCreatedAt.toDateString() === date.toDateString();
    });

    setDisplayedCustomers(filteredCustomers);
  };
  const handleSearchName = (event) => {
    setSearchQuery2(event.target.value);
    const filteredCustomers = allCustomers.filter((customer) =>
      customer.name?.toLowerCase()?.includes(event.target.value.toLowerCase())
    );
    setDisplayedCustomers(filteredCustomers);
  };

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Loan Application List</h4>
          <div class="d-flex align-items-center flex-wrap flex-sm-nowrap">
            <div class="mb-3 mt-2 mx-sm-2">
              <label class="sr-only">Search</label>
              <input
                type="date"
                class="form-control"
                placeholder="Search"
                onChange={handleDateChange}
              />{" "}
            </div>
            &nbsp;
            <button type="submit" class="btn btn-primary mb-2">
              Filter By Payment Date
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary mb-2"
            onClick={() => {
              exportToExcel();
            }}
          >
            EXPORT AS EXCEL
          </button>
          <form class="d-flex align-items-center flex-wrap flex-sm-nowrap">
            <div class="mb-3 mt-2 mx-sm-2">
              <label class="sr-only">Search By Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name"
                value={searchQuery2}
                onChange={handleSearchName}
              />
            </div>
            &nbsp;
            <button type="submit" class="btn btn-primary mb-2">
              Search
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-primary mb-2">Export As Excel</button>
          </form>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-responsive-md" id="table-to-xls">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>
                    <strong>#</strong>
                  </th>
                  <th>
                    <strong>Name</strong>
                  </th>
                  <th>
                    <strong>Total Amt Approved (&#8358;)</strong>
                  </th>

                  <th>
                    <strong>Total Interest</strong>
                  </th>
                  <th>
                    <strong>TYPE</strong>
                  </th>
                  <th>
                    <strong>Payments (&#8358;)</strong>
                  </th>
                  <th>
                    <strong>Balance</strong>
                  </th>

                  <th>
                    <strong>Payment Date</strong>
                  </th>
                  <th>
                    <strong>Uploaded By</strong>
                  </th>
                  <th>
                    <strong>Approved Date</strong>
                  </th>
                  <th>
                    <strong>Loan Due Date</strong>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((loanitem, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{index + 1}</strong>
                    </td>
                    <td>
                      <Link
                        to={`/loan-applicants-details/${loanitem._id}`}
                        class="dropdown-item"
                      >
                        {loanitem.name}
                      </Link>
                      {loanitem.loanTitle}
                    </td>
                    <td>&#8358; {addCommas(loanitem.totalLoanRecieved)}</td>
                    <td>
                      &#8358;
                      {addCommas(loanitem.totalInterestAccured)}
                    </td>
                    <td>
                      {loanitem.status === "deposited"
                        ? "+"
                        : loanitem.status === "withdrawn"
                        ? "-"
                        : "+"}
                    </td>{" "}
                    <td>&#8358; {addCommas(loanitem.amount)}</td>
                    <td>&#8358;{addCommas(loanitem.balance)}</td>
                    <td>
                      {" "}
                      {loanitem.paymentDate
                        ? new Date(loanitem.paymentDate).toDateString()
                        : "N/A"}
                    </td>
                    <td>{loanitem.uploadedBy ? loanitem.uploadedBy : "N/A"}</td>
                    <td>{loanitem.loanStartDate}</td>
                    <td>{loanitem.loanEndDate}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-success light sharp"
                          data-bs-toggle="dropdown"
                        >
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            version="1.1"
                          >
                            <g
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <rect x="0" y="0" width="24" height="24" />
                              <circle fill="#000000" cx="5" cy="12" r="2" />
                              <circle fill="#000000" cx="12" cy="12" r="2" />
                              <circle fill="#000000" cx="19" cy="12" r="2" />
                            </g>
                          </svg>
                        </button>
                        <div className="dropdown-menu">
                          <Link
                            to={`/loan-applicants-details/${loanitem._id}`}
                            class="dropdown-item"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/edit-loan/${loanitem._id}`}
                            class="dropdown-item"
                          >
                            Edit
                          </Link>

                          <a
                            className="dropdown-item"
                            onClick={() => deleteLoan(loanitem._id)}
                          >
                            Delete
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"pagination-container"}
              previousLinkClassName={"pagination-button"}
              nextLinkClassName={"pagination-button"}
              pageClassName={"pagination-button"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanApplicants;
