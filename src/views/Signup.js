import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    // Fetch role options from API
    axios.get("http://127.0.0.1:8000/api/role")
      .then(response => {
        setRoleOptions(response.data[0]); // Ambil array pertama dari respons
      })
      .catch(error => {
        console.error("Error fetching roles:", error);
      });

    // Fetch branch options from API
    axios.get("http://127.0.0.1:8000/api/cabang")
      .then(response => {
        setBranchOptions(response.data[0]); // Ambil array pertama dari respons
      })
      .catch(error => {
        console.error("Error fetching branches:", error);
      });
  }, []);

  const isFormValid = () => {
    return (
      email.trim() !== "" &&
      password.trim() !== "" &&
      username.trim() !== "" &&
      fullName.trim() !== "" &&
      selectedRole !== "" &&
      selectedBranch !== "" &&
      email.includes("@")
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fill in all fields and provide a valid email address");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/signup",
        { 
            email, 
            password, 
            username, 
            nama: fullName, 
            role: selectedRole, // Menggunakan id dari role yang dipilih
            cabang_id: selectedBranch // Menggunakan id dari cabang yang dipilih
          }
      );
      console.log("Signup response:", response.data);
      // Redirect to login page after successful signup
      history.push("/login");
    } catch (error) {
      console.error("Signup error:", error.response);
      setError(error.response.data.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2 className="mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignUp}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={!roleOptions.length} // Disable if roleOptions is empty
              >
                <option value="">Select Role</option>
                {roleOptions.map(role => (
                  <option key={role.id} value={role.id}>{role.nama_role}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBranch">
              <Form.Label>Branch</Form.Label>
              <Form.Control
                as="select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={!branchOptions.length} // Disable if branchOptions is empty
              >
                <option value="">Select Branch</option>
                {branchOptions.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.nama_cabang}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={!isFormValid()}>
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
