import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Cookies from 'js-cookie'; // Import Cookies library
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

function BuatPermintaan() {
  const [barangOptions, setBarangOptions] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState('');
  const [jumlah, setJumlah] = useState(0);
  const [catatan, setCatatan] = useState('');
  const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    // Fetch role options from API
    axios.get("http://127.0.0.1:8000/api/barang")
      .then(response => {
        setBarangOptions(response.data[0]);
      })
      .catch(error => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token'); // Ambil token dari Cookies
      const response = await axios.post('http://127.0.0.1:8000/api/office/transaction/create', {
        barang_id: selectedBarang,
        jumlah,
        catatan,
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Set header Authorization dengan token
        }
      });
      console.log('Response:', response.data);
      // Reset form after successful submission
      setSelectedBarang('');
      setJumlah(0);
      setCatatan('');
      // Show success alert
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Success!',
        text: 'Pengajuan berhasil!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect user to /admi/permintaan-barang after clicking OK
        history.push('/admin/permintaan-barang');
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <h2>Buat Pengajuan</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="barang">
              <Form.Label>Barang:</Form.Label>
              <Form.Control as="select" value={selectedBarang} onChange={(e) => setSelectedBarang(e.target.value)}>
                <option value="">Pilih Barang</option>
                {barangOptions.map((barang) => (
                  <option key={barang.id} value={barang.id}>
                    {barang.nama}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="jumlah">
              <Form.Label>Jumlah:</Form.Label>
              <Form.Control type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="catatan">
              <Form.Label>Catatan:</Form.Label>
              <Form.Control as="textarea" rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default BuatPermintaan;
