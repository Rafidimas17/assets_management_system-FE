import React, { Component, useEffect,useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "assets/img/reactlogo.png";
import Cookies from 'js-cookie';
import axios from "axios";

function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  console.log(userRole)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenFromCookie = Cookies.get('token');
        setToken(tokenFromCookie || '');
        const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${tokenFromCookie}` }
        });
        const role = userResponse.data[0].role;
        setUserRole(role);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);
  
  

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const filteredRoutes = routes.filter(prop => {  
    return prop.name === "Persediaan barang" || prop.name === "Permintaan barang" || prop.name === "Riwayat" ;
  });

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")"
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href=""
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              
            </div>
          </a>
          <a className="simple-text" href="">
            AMS
          </a>
        </div>
       <Nav>
  {userRole === "HQ" ? (
    routes.map((prop, key) => (
  // Memeriksa apakah prop.name tidak kosong atau tidak terdefinisi
  prop.name && (
    <li className={activeRoute(prop.layout + prop.path)} key={key}>
      <NavLink to={prop.layout + prop.path} className="nav-link" activeClassName="active">
        <p>{prop.name}</p>
      </NavLink>
    </li>
  )
))

  ) : (
    filteredRoutes.map((prop, key) => (
      <li className={activeRoute(prop.layout + prop.path)} key={key}>
        <NavLink to={prop.layout + prop.path} className="nav-link" activeClassName="active">
          <p>{prop.name}</p>
        </NavLink>
      </li>
    ))
  )}
</Nav>

      </div>
    </div>
  );
}

export default Sidebar;
