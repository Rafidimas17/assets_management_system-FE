import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function TableListUser() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

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

  const handleClick = (id) => {
    history.push(`/admin/edit-user/${id}`);    
  }

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get('token');
      await axios.delete(`http://127.0.0.1:8000/api/user/${id}/delete`, { headers: { Authorization: `Bearer ${token}` } });
      
      const updatedUserData = userData.filter(user => user.id !== id);
      setUserData(updatedUserData);

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Hapus user berhasil.'
      });
      
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <>
      <Container fluid>
        <Row className="mb-3"></Row>
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
                      <Button variant="link" style={{ padding: "0", marginRight: "5px", border: "none" }} onClick={() => handleClick(item.id)}><FaEdit color="blue" /></Button>
                      <Button variant="link" style={{ padding: "0", marginRight: "5px", border: "none" }} onClick={() => handleDelete(item.id)}><FaTrash color="red" /></Button>
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
