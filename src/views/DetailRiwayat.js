import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";

const DetailRiwayat = ({ match }) => {
  const [transactionData, setTransactionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        // Mengambil id dari params
        const id = match.params.id;

        // Mengambil token dari cookies
        const token = Cookies.get('token');

        // Mengambil data transaksi dari API
        const response = await axios.get(`http://127.0.0.1:8000/api/center/transaction/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTransactionData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [match.params.id]);

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">Detail Riwayat Transaksi</Card.Title>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <div>
                  <p><strong>Nama Barang:</strong> {transactionData.nama_barang}</p>
                  <p><strong>Tanggal Transaksi:</strong> {transactionData.tanggal_transaksi}</p>
                  <p><strong>Kategori:</strong> {transactionData.nama_category}</p>
                  <p><strong>Status:</strong> {transactionData.status}</p>
                  <p><strong>Cabang:</strong> {transactionData.nama_cabang}</p>
                  <p><strong>Catatan:</strong> {transactionData.catatan}</p>
                  <p><strong>Nama Pemohon:</strong> {transactionData.nama_pemohon}</p>
                  <Link to="/admin/riwayat">
                    <Button variant="primary">Tutup</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailRiwayat;
