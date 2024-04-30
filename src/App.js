import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import NavHeader from "./Components/NavHeader";
import Routing from "./Routes";
import Login from "./Components/LoginAndRegister/Login";
import { useEffect, useState } from "react";
import { UserContextProvider } from "./UserContext";
import { CookiesProvider, useCookies } from "react-cookie";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [cookies2] = useCookies(["userToken"]);

  // useEffect(() => {
  //   let token = "token";
  //   if (token != "token") {
  //     setAuthenticated(false);
  //   } else if (token === "token") {
  //     setAuthenticated(true);
  //   }
  // }, []);
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === "undefined") {
      localStorage.removeItem("token");
      setAuthenticated(false);
    } else if (token) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <CookiesProvider>
      <UserContextProvider>
        {authenticated ? (
          <div id="main-wrapper">
            <NavHeader />
            <Header />
            <Sidebar />
            <div class="content-body">
              <div class="container-fluid">
                {/* ========  START Route ========= */}
                <Routing />
              </div>
            </div>
            <div class="footer">
              <div class="copyright">
                <p>
                  Copyright © 2024 Eagle Vision || Developed by{" "}
                  <a href="https://techmint.africa/" target="_blank">
                    Techmint
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </UserContextProvider>
    </CookiesProvider>
  );
}

export default App;
