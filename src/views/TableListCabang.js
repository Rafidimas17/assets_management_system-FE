import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { FaEye } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

function TableListCabang() {
  const [cabangData, setCabangData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchCabangData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Authorization Token not found');
        }
        const response = await axios.get("http://127.0.0.1:8000/api/center/cabang", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formattedData = response.data.map(item => ({
          id: item.id,
          nama_cabang: item.nama_cabang,
          alamat: item.alamat,
          nomor_telepon: item.nomor_telepon,
          created_at: formatDate(item.created_at)
        }));
        setCabangData(formattedData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCabangData();
  }, []);

  const handleClick = (id) => {
    history.push(`/admin/detail-cabang/${id}`); // Perubahan disini, menambahkan '/admin' sesuai dengan konfigurasi layout
  };
  
  // Function to format tanggal to "dd/mm/yyyy"
  const formatDate = (tanggal) => {
    const tgl = new Date(tanggal);
    const dd = String(tgl.getDate()).padStart(2, '0');
    const mm = String(tgl.getMonth() + 1).padStart(2, '0');
    const yyyy = tgl.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleTambah = () => {
    history.push('/admin/buat-cabang'); // Perubahan disini, menambahkan '/admin' sesuai dengan konfigurasi layout
  };

  return (
    <>
      {error && <div>Error: {error}</div>}
      <Container fluid>
        <Row className="mb-3">
          <Col md="12">
            <Button style={{ borderRadius: "10px", backgroundColor: "white", color: "blue", border: "1px solid lightblue" }} onClick={handleTambah}>Tambah</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Table bordered hover striped responsive>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Cabang</th>
                  <th>Alamat</th>
                  <th>Nomor Telepon</th>
                  <th>Tanggal Berdiri</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cabangData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.nama_cabang}</td>
                    <td style={{ maxWidth: "300px", wordWrap: "break-word" }}>{item.alamat}</td>
                    <td>{item.nomor_telepon}</td>
                    <td>{item.created_at}</td>
                    <td>
                      <Button variant="link" style={{ padding: "0", marginRight: "5px", border: "none" }} onClick={() => handleClick(item.id)}><FaEye color="yellow" /></Button>
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

export default TableListCabang;
