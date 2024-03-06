import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login",
        { email, password }
      );
      const token = response.data.token;
      Cookies.set("token", token); // Set token di cookies
      history.push("/admin/persediaan-barang"); // Arahkan ke halaman setelah login
    } catch (error) {
      console.error("Login error:", error);
      // Handle error
    }
  };

  const handleSignupClick = () => {
    history.push("/signup");
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <p className="mt-3">
            Belum punya akun?{" "}
            <span className="signup-link" onClick={handleSignupClick}>
              Daftar akun
            </span>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
