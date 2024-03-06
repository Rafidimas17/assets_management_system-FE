
import React, { Component } from "react";
import { useLocation, Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";

import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import sidebarImage from "assets/img/sidebar-3.jpg";

function Welcome() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/welcome") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
 
  return (
    <>
      <div className="wrapper">                       
          <div className="content">
            <Switch>{getRoutes(routes)}</Switch>
          </div>         
       
      </div>
     
    </>
  );
}

export default Welcome;
