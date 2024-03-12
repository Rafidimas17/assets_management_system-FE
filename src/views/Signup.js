import React, { useState, useEffect,Component } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
  const MySwal = withReactContent(Swal);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  console.log(selectedRole)
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
    if (selectedRole === 'HQ') {
      return (
        email.trim() !== "" &&
        password.trim() !== "" &&
        username.trim() !== "" &&
        fullName.trim() !== "" &&
        selectedRole !== "" &&
        email.includes("@")
      );
    } else {
      return (
        email.trim() !== "" &&
        password.trim() !== "" &&
        username.trim() !== "" &&
        fullName.trim() !== "" &&
        selectedRole !== "" &&
        selectedBranch !== null &&
        email.includes("@")
      );
    }
  };
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fill in all fields and provide a valid email address");
      return;
    }
    try {
      let cabangIdValue = selectedBranch;
      if (selectedRole === 'HQ') {
        cabangIdValue = null;
      }
      await axios.post(
        "http://127.0.0.1:8000/api/auth/signup",
        { 
          email, 
          password, 
          username, 
          nama: fullName, 
          role: selectedRole, 
          cabang_id: cabangIdValue
        }
      );
      MySwal.fire({
        icon: 'success',
        title: 'Registrasi berhasil!',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'OK'
      }).then((result) => {                
          history.push("/login");        
      });               
    } catch (error) {
      console.error("Signup error:", error.response);
      setError(error.response.data.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2 className="mb-4"  style={{ fontFamily:"Poppins" }}>Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignUp}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label  style={{ fontFamily:"Poppins" }}>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontFamily:"Poppins" }}
              />
            </Form.Group>

            <Form.Group className="mt-2" controlId="formBasicUsername">
              <Form.Label style={{ fontFamily:"Poppins" }}>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ fontFamily:"Poppins" }}
              />
            </Form.Group>

            <Form.Group className="mt-2" controlId="formBasicFullName">
              <Form.Label  style={{ fontFamily:"Poppins" }}>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ fontFamily:"Poppins" }}
              />
            </Form.Group>

            <Form.Group className="mt-2" controlId="formBasicPassword">
            <Form.Label style={{ fontFamily: "Poppins" }}>Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontFamily: "Poppins" }}
              />
              <div className="d-flex align-items-center pr-2 border border-none" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </Form.Group>

            <Form.Group className="mt-2" controlId="formRole">
              <Form.Label  style={{ fontFamily:"Poppins" }}>Role</Form.Label>
              <Form.Control
                as="select"
                value={selectedRole}
                style={{ fontFamily:"Poppins" }}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={!roleOptions.length} // Disable if roleOptions is empty
              >
                <option value="">Select Role</option>
                {roleOptions.map(role => (
                  <option key={role.id} value={role.id}  style={{ fontFamily:"Poppins" }}>{role.nama_role}</option>
                ))}
              </Form.Control>
            </Form.Group>
           
            <Form.Group className="mt-2" controlId="formBranch">
              <Form.Label style={{ fontFamily: "Poppins" }}>Cabang</Form.Label>
              <Form.Control
                as="select"
                value={selectedBranch}
                style={{ fontFamily: "Poppins" }}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={!branchOptions.length} // Disable if branchOptions is empty
              >
                <option value="">Pilih cabang</option>
                {branchOptions.map(branch => (
                  <option key={branch.id} value={branch.id} style={{ fontFamily: "Poppins" }}>{branch.nama_cabang}</option>
                ))}
              </Form.Control>
            </Form.Group>
          
                 

            <Button variant={isFormValid() ? "primary" : "secondary"} type="submit" className="w-100 mt-3" disabled={!isFormValid()}  style={{ fontFamily:"Poppins" }}>
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
