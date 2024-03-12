import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const MySwal = withReactContent(Swal);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login",
        { email, password }
      );
      const token = response.data.token;
      MySwal.fire({
        icon: 'success',
        title: 'Berhasil masuk!',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          Cookies.set("token", token);
          history.push("/admin/persediaan-barang");
        }
      });
      
    } catch (error) {
      // console.error("Login error:", error);    
      MySwal.fire({
        icon: 'error',
        title: 'Periksa kembali email dan password!',
      });
    }
  };

  const handleSignupClick = () => {
    history.push("/signup");
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2 style={{ fontFamily:"Poppins" }}>Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label style={{ fontFamily:"Poppins" }}>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label style={{ fontFamily:"Poppins" }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              Login
            </Button>
          </Form>
          <p className="mt-3">
            Belum punya akun?{" "}
            <span className="signup-link"  onClick={handleSignupClick} style={{ cursor:"pointer",color:"blue"}}>
              Daftar akun
            </span>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
