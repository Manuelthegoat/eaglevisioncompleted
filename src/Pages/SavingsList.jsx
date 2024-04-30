import React, { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";


const SavingsList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]); // stores all fetched data
  const [displayedCustomers, setDisplayedCustomers] = useState([]); // stores data currently displayed in table
  const [pageNumber, setPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  const customersPerPage = 10;
  const pagesVisited = pageNumber * customersPerPage;
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch("https://eaglevision.onrender.com/api/v1/customers", {
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
        toast.success("Customer Fetched Successfully");
        setCustomers(data.data);
        setAllCustomers(data.data);
        setDisplayedCustomers(
          data.data.slice(pagesVisited, pagesVisited + customersPerPage)
        );      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
        toast.error("Customer Failed To Fetched");
      })
      .finally(() => setLoading(false)); // Set loading to false here, after success or error
  }, [pageNumber]);

  const pageCount = Math.ceil(customers.length / customersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const deleteCustomer = (customerId) => {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        fetch(`https://eaglevision.onrender.com/api/v1/customers/${customerId}`, {
          method: "DELETE",
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
            // If successfully deleted from backend, remove from local state
            const updatedCustomers = customers.filter(
              (customer) => customer._id !== customerId
            );
            toast.success("Customer Deleted Successfully");
            setCustomers(updatedCustomers);
          })
          .catch((error) => {
            console.log("Error deleting customer: ", error);
            toast.error("Failed to delete customer");
          })
          .finally(() => {
            // Hide loader
            setDeleting(false);
          });
      }
    });
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);

    // Immediately filter the data when a date is selected
    const date = new Date(event.target.value);
    const filteredCustomers = allCustomers.filter((customer) => {
      const customerCreatedAt = new Date(customer.updatedAt);
      return customerCreatedAt.toDateString() === date.toDateString();
    });

    setDisplayedCustomers(filteredCustomers);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filteredCustomers = allCustomers.filter((customer) =>
      customer.accountNumber.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setDisplayedCustomers(filteredCustomers);
  };
  const handleSearchName = (event) => {
    setSearchQuery2(event.target.value);
    const filteredCustomers = allCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setDisplayedCustomers(filteredCustomers);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toDateString(undefined, options);
  };

  

  return (
    <>
      {loading && <Loader />}
      {deleting && <Loader />}
      <div className="card">
        <div className="card-header">
          <h4 class="card-title">All Savings</h4>

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
              Filter By Date
            </button>
          </div>

          {/* <form class="d-flex align-items-center flex-wrap flex-sm-nowrap">
            <div class="mb-3 mt-2 mx-sm-2">
              <label class="sr-only">Search</label>
              <input type="date" class="form-control" placeholder="Search" />
              <input type="date" class="form-control" placeholder="Search" />
            </div>
            &nbsp;
            <button type="submit" class="btn btn-primary mb-2">
              Search by Payment date
            </button>
           
          </form> */}
          <form class="d-flex align-items-center flex-wrap flex-sm-nowrap">
            <div class="mb-3 mt-2 mx-sm-2">
              <label class="sr-only">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Account Number"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            &nbsp;
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
          <div class="table-responsive">
            <table class="table table-responsive-md">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>
                    <strong>#</strong>
                  </th>
                  <th>
                    <strong>Customer</strong>
                  </th>
                  <th>
                    <strong>Customer ID</strong>
                  </th>
                  <th>
                    <strong>Phone No</strong>
                  </th>
                  <th>
                    <strong>Avail Balance(&#8358;)</strong>
                  </th>
                  <th>
                    <strong>Account Officer</strong>
                  </th>
                  <th>
                    <strong>Created At</strong>
                  </th>
                  <th>
                    <strong>Payment Date</strong>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{index + 1 + pagesVisited}</strong>
                    </td>
                    <td>
                      <Link  to={`/customer-profile/${customer._id}`}>{customer.name}</Link>
                    </td>
                    <td>{customer.accountNumber}</td>
                    <td>{customer.customersPhoneNo}</td>
                    <td>{customer.accountBalance}</td>
                    <td>{customer.officerIncharge}</td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>{formatDate(customer.updatedAt)}</td>
                    <td>
                      <div class="dropdown">
                        <button
                          type="button"
                          class="btn btn-success light sharp"
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
                        <div class="dropdown-menu">
                          <Link
                            to={`/customer-profile/${customer._id}`}
                            class="dropdown-item"
                          >
                            View Details
                          </Link>

                          <a
                            class="dropdown-item"
                            onClick={() => deleteCustomer(customer._id)}
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

export default SavingsList;
