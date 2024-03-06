import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const API_BASE_URL = "http://127.0.0.1:8000/api/";

function TambahPersediaan() {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    nama: "",
    deskripsi: "",
    kode_barang: "",
    jumlah_stock: ""
  });

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      try {
        const tokenFromCookie = Cookies.get('token');
        const response = await axios.get(API_BASE_URL + "category", {
          headers: { Authorization: `Bearer ${tokenFromCookie}` }
        });
        setCategoryOptions(response.data[0]);
      } catch (error) {
        console.error("Error fetching category options:", error);
      }
    };

    fetchCategoryOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenFromCookie = Cookies.get('token');
      await axios.post(API_BASE_URL + "barang", formData, {
        headers: { Authorization: `Bearer ${tokenFromCookie}` }
      });
      // Show success message using SweetAlert
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Barang berhasil ditambahkan.'
      });
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="category_id">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="category_id" onChange={handleChange}>
                <option value="">Pilih Kategori</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>{category.nama}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="nama">
              <Form.Label>Nama Barang</Form.Label>
              <Form.Control type="text" name="nama" value={formData.nama} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="deskripsi">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control as="textarea" rows={3} name="deskripsi" value={formData.deskripsi} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="kode_barang">
              <Form.Label>Kode Barang</Form.Label>
              <Form.Control type="text" name="kode_barang" value={formData.kode_barang} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="jumlah_stock">
              <Form.Label>Jumlah Stock</Form.Label>
              <Form.Control type="number" name="jumlah_stock" value={formData.jumlah_stock} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Tambah
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default TambahPersediaan;
