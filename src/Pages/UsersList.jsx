import React, { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


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
  function camelToNormalCase(text) {
    return (
      text
        // Insert a space before all capital letters
        .replace(/([A-Z])/g, " $1")
        // Convert the first character of the string to uppercase
        .replace(/^./, (str) => str.toUpperCase())
    );
  }
  return (
    <>
      {loading && <Loader />}
      <div className="card">
        <div className="card-header">
          <h4 class="card-title">Users'List</h4>

          <form class="d-flex align-items-center flex-wrap flex-sm-nowrap">
            <div class="mb-3 mt-2 mx-sm-2">
              <label class="sr-only">Search</label>
              <input type="Search" class="form-control" placeholder="Search" />
            </div>
            &nbsp;
            <button type="submit" class="btn btn-primary mb-2">
              Search
            </button>
            &nbsp;&nbsp;
            <a href="/add-user" className="btn btn-primary mb-2">Add New User</a>
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
                    <strong>Name</strong>
                  </th>
                  <th>
                    <strong>Email</strong>
                  </th>
                  <th>
                    <strong>User Type</strong>
                  </th>
                  <th>
                    <strong>Status</strong>
                  </th>

                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => (
                  <tr>
                    <td>
                      <strong>{index + 1}</strong>
                    </td>
                    <td>
                      {item.firstName}&nbsp;
                      {item.lastName}
                      <br />
                      {camelToNormalCase(item.roles)}
                    </td>
                    <td>{item.email}</td>
                    <td>{camelToNormalCase(item.roles)}</td>
                    <td>
                      <span class="badge light badge-success">
                        {camelToNormalCase(item.status)}
                      </span>
                    </td>

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
                            to={`/user-details/${item._id}`}
                            class="dropdown-item"
                          >
                            View Details
                          </Link>
                          <a class="dropdown-item" href="#">
                            Edit
                          </a>

                          <a class="dropdown-item" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersList;
