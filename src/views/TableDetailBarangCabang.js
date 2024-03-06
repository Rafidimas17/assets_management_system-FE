import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom"; // Import useParams
import Cookies from 'js-cookie'; // Import Cookies

function TableDetailBarangCabang() {
  const { id } = useParams(); // Dapatkan nilai id dari URL menggunakan useParams
  const [barangData, setBarangData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarangData = async () => {
      try {
        const token = Cookies.get('token'); // Ambil token dari cookies
        const response = await axios.get(`http://127.0.0.1:8000/api/center/barang/cabang/${id}`, {
          headers: { Authorization: `Bearer ${token}` } // Sertakan token dalam header request
        });

        // Mengubah format tanggal menjadi "dd/mm/yyyy"
        const formattedData = response.data.map((item, index) => ({
          id: index + 1, // Ubah ID menjadi nomor urut dari 1
          nama: item.nama,
          deskripsi: item.deskripsi,
          category: item.category,
          tanggal_penambahan: formatDate(item.tanggal_penambahan), // Format tanggal
          kode_barang: item.kode_barang,
          stock: item.stock
        }));

        setBarangData(formattedData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBarangData();
  }, [id]);

  // Function untuk mengubah format tanggal menjadi "dd/mm/yyyy"
  const formatDate = (tanggal) => {
    const tgl = new Date(tanggal);
    const dd = String(tgl.getDate()).padStart(2, '0');
    const mm = String(tgl.getMonth() + 1).padStart(2, '0');
    const yyyy = tgl.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Table bordered hover striped responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Barang</th>
                  <th>Deskripsi</th>
                  <th>Kategori</th>
                  <th>Tanggal Penambahan</th>
                  <th>Kode Barang</th>
                  <th>Stok</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7">Error: {error}</td>
                  </tr>
                ) : (
                  barangData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nama}</td>
                      <td>{item.deskripsi}</td>
                      <td>{item.category}</td>
                      <td>{item.tanggal_penambahan}</td>
                      <td>{item.kode_barang}</td>
                      <td>{item.stock}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableDetailBarangCabang;
