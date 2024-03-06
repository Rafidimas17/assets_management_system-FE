import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import routes from "routes.js";
import Cookies from 'js-cookie';
import axios from 'axios';

function Header() {
  const location = useLocation();
  const history = useHistory();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Mengambil token dari cookies
        const token = Cookies.get('token');

        // Mengambil data user dari API
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Mengambil nama pengguna dari response dan memperbarui state
        const { username } = response.data[0];
        setUserName(username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const removeToken = () => {
    Cookies.remove("token");
    history.push("/login");
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#home">{getBrandText()}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link className="mr-2">{userName}</Nav.Link>
            <Nav.Link onClick={removeToken}>Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
