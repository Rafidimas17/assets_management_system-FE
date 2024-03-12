import React, { useState, useEffect } from "react";
import { Badge, Button, Card, Table, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from "axios";
import Cookies from 'js-cookie';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const API_BASE_URL = "http://127.0.0.1:8000/api/";

function TableListPersediaan() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const history=useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenFromCookie = Cookies.get('token');
        const userResponse = await axios.get(API_BASE_URL + "user", {
          headers: { Authorization: `Bearer ${tokenFromCookie}` }
        });
        const role = userResponse.data[0].role;
        setUserRole(role);

        const inventoryApiUrl = getInventoryApiUrl(role);
        const inventoryResponse = await axios.get(inventoryApiUrl, {
          headers: { Authorization: `Bearer ${tokenFromCookie}` }
        });
        setInventoryData(inventoryResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInventoryApiUrl = (role) => {
    if (role === 'HQ') {
      return API_BASE_URL + "center/barang";
    } else {
      return API_BASE_URL + "office";
    }
  };

  const handleTambahLink = () => {
    history.push('/admin/persediaan/tambah');
  };

  const handleClick = (id) => {
    history.push(`/admin/persediaan-ubah/${id}`);
  };

  const handleDelete = (id) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan dapat mengembalikan tindakan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus saja!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const tokenFromCookie = Cookies.get('token');
          await axios.delete(`${API_BASE_URL}barang/${id}`, {
            headers: { Authorization: `Bearer ${tokenFromCookie}` }
          });
          MySwal.fire(
            'Dihapus!',
            'Data telah berhasil dihapus.',
            'success'
          );
          // Update state atau fetch data kembali jika diperlukan
        } catch (error) {
          MySwal.fire(
            'Gagal!',
            'Tidak dapat menghapus data.',
            'error'
          );
        }
      }
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">Persediaan Barang</Card.Title>
              <Col md="12">
                {userRole !== 'HQ' ? null : (
                  <Button style={{ borderRadius: "10px", backgroundColor: "white", color: "blue", border: "1px solid lightblue"}} onClick={handleTambahLink}>Tambah</Button>
                )}
              </Col>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">No</th>
                      <th className="border-0">Nama Barang</th>
                      <th className="border-0">Kode Barang</th>
                      <th className="border-0">Tanggal Pengadaan</th>
                      <th className="border-0">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map((item, index) => {
                      const tanggal = new Date(item.tanggal_penambahan);
                      const dd = String(tanggal.getDate()).padStart(2, '0');
                      const mm = String(tanggal.getMonth() + 1).padStart(2, '0');
                      const yyyy = tanggal.getFullYear();
                      const formattedDate = `${dd}/${mm}/${yyyy}`;

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.nama}</td>
                          <td>{item.kode_barang}</td> 
                          <td>{formattedDate}</td>
                          <td>{item.stock}</td>
                          <td>
                            <Button variant="link" style={{ padding: "0", marginRight: "5px", border: "none" }} onClick={() => handleClick(item.id)}><FaEdit color="blue" /></Button>
                            <Button variant="link" style={{ padding: "0", marginRight: "5px", border: "none" }} onClick={() => handleDelete(item.id)}><FaTrash color="red" /></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TableListPersediaan;
