import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {useHistory} from 'react-router-dom'

function UbahPersediaan() {
  const { id } = useParams();
  const [deskripsi, setDeskripsi] = useState("");
  const [jumlahStock, setJumlahStock] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
    const history=useHistory()
  useEffect(() => {
    fetchBarangData();
  }, []);

  const fetchBarangData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/barang/${id}`);
      const { barang, jumlah_stock } = response.data;
      setDeskripsi(barang.deskripsi);
      setJumlahStock(jumlah_stock);          
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://127.0.0.1:8000/api/barang/${id}`, {
        deskripsi,
        jumlah_stock: jumlahStock
      });
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Barang berhasil diubah.'
      });
      history.push('/admin/persediaan-barang')
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Ubah Persediaan Barang</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="deskripsi">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                type="text"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="jumlahStock">
              <Form.Label>Jumlah Stock</Form.Label>
              <Form.Control
                type="number"
                value={jumlahStock}
                onChange={(e) => setJumlahStock(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default UbahPersediaan;
