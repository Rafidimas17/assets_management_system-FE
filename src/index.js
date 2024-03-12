import React from "react";
import ReactDOM from "react-dom/client";
import Cookies from "js-cookie";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "layouts/Admin.js";
import WelcomeLayout from "layouts/Welcome.js";
import Login from "views/Login";
import Signup from "views/Signup";

const root = ReactDOM.createRoot(document.getElementById("root"));

const isAuthenticated = () => {
  const token = Cookies.get('token');
  return token ? true : false;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <PrivateRoute path="/admin" component={AdminLayout} />
      <Route path="/welcome" component={WelcomeLayout} />
      <Redirect from="/" to={isAuthenticated() ? "/admin/persediaan-barang" : "/login"} />
    </Switch>
  </BrowserRouter>
);
