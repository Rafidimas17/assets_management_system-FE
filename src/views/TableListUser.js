import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

function TableListUser() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get("http://127.0.0.1:8000/api/user/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
                
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Container fluid>
        <Row className="mb-3">
          
        </Row>
        <Row>
          <Col md="12">
            <Table bordered hover striped responsive>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Cabang</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.email}</td>
                    <td>{item.username}</td>
                    <td>{item.role}</td>
                    <td>{item.cabang}</td>
                    <td>
                      <Button variant="link" style={{ padding: "0", marginRight: "5px", border: "none" }}><FaEdit color="blue" /></Button>
                      <Button variant="link" style={{ padding: "0", marginRight: "5px", border: "none" }}><FaTrash color="red" /></Button>
                      <Button variant="link" style={{ padding: "0", border: "none" }}><FaEye color="yellow" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableListUser;
