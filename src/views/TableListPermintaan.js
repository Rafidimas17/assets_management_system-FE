import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { FaCheck, FaTimes } from 'react-icons/fa';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Button,
  Col,
} from "react-bootstrap";

function TableListPermintaan() {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const history = useHistory();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    fetchTransactionData();
  }, []);

  const fetchTransactionData = async () => {
    try {
      const token = Cookies.get('token');
      const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const role = userResponse.data[0].role;
      setUserRole(role);

      let transactionApiUrl = role === "HQ" ? "http://127.0.0.1:8000/api/center/transaction/all" : "http://127.0.0.1:8000/api/office/transaction/all";

      const response = await axios.get(transactionApiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.length > 0) {
        const formattedData = role === "HQ" ? response.data.map(item => ({
          id: item.id,
          nama: item.nama,
          cabang: item.cabang,
          jumlah: item.jumlah,
          status: item.status,
          tanggal_pengajuan: formatTanggal(item.tanggal_transaksi),
          created_at: item.created_at
        })) : response.data.map(item => ({
          id: item.id,
          nama: item.nama_pemohon,
          cabang: item.role,
          jumlah: item.jumlah_pengajuan,
          status: item.status_transaksi,
          tanggal_pengajuan: formatTanggal(item.tanggal_transaksi),
          created_at: item.created_at
        }));
        setTransactionData(formattedData);
      } else {
        setError("No data found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = Cookies.get('token');
      const updateUrl = userRole === "HQ" ? "http://127.0.0.1:8000/api/center" : "http://127.0.0.1:8000/api/office";
      const status = userRole === "HQ" ? "approved" : "drafted";
      await axios.put(`${updateUrl}/${id}/update`, { status_transaksi: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchTransactionData();

      MySwal.fire({
        icon: 'success',
        title: 'Pengajuan diterima!',
      });
    } catch (error) {
      console.error("Error approving transaction:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to approve transaction.'
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const token = Cookies.get('token');
      const updateUrl = userRole === "HQ" ? "http://127.0.0.1:8000/api/center" : "http://127.0.0.1:8000/api/office";
      await axios.put(`${updateUrl}/${id}/update`, { status_transaksi: "rejected" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchTransactionData();
      MySwal.fire({
        icon: 'success',
        title: 'Pengajuan ditolak!',
      });
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to reject transaction.'
      });
    }
  };

  const handleTambahClick = () => {
    history.push("/admin/permintaan/buat");
  };

  const formatTanggal = (tanggal) => {
    const tgl = new Date(tanggal);
    const dd = String(tgl.getDate()).padStart(2, '0');
    const mm = String(tgl.getMonth() + 1).padStart(2, '0');
    const yyyy = tgl.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const startingNumber = 1; 
  return (
    <>
    
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Permintaan Barang</Card.Title>              
                <Col className="text-left">
                {userRole==="Office"?
                  <button className="btn btn-primary" onClick={handleTambahClick}>Tambah</button>:""
                }
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
                      <th className="border-0">Nama Pembuat</th>
                      <th className="border-0">{userRole === "HQ" ? "cabang" : "track"}</th>
                      <th className="border-0">Jumlah</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Tanggal Pengajuan</th>
                      {(userRole === "Manager" || userRole === "HQ") && <th className="border-0">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
  {transactionData.map((item, index) => {
   
    if (userRole === "HQ") {
      if (item.status !== "approved"  && item.status !== "pending" && item.status !== "rejected" ) {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.nama}</td>
            <td>{item.cabang}</td>
            <td>{item.jumlah}</td>
            <td>{item.status}</td>
            <td>{item.tanggal_pengajuan}</td>
            {/* Menampilkan tombol hanya jika status bukan "rejected" atau "approved" */}
            {item.status !== "rejected" && (
              <td>
                <Button
                  variant="link"
                  style={{
                    padding: "0",
                    marginRight: "5px",
                    border: "none",
                    backgroundColor: "white",
                    border: "1px solid red" // Set border color to red
                  }}
                  onClick={() => handleReject(item.id)} // Menggunakan handleReject untuk tombol silang
                >
                  <FaTimes color="red" />
                </Button>

                <Button
                  variant="link"
                  style={{
                    padding: "0",
                    marginRight: "5px",
                    border: "none",
                    backgroundColor: "white",
                    border: "1px solid green" // Set border color to green
                  }}
                  onClick={() => handleApprove(item.id)} // Menggunakan handleApprove untuk tombol centang
                >
                  <FaCheck color="green" />
                </Button>
              </td>
            )}
            {/* Menampilkan kosong jika status "rejected" */}
            {item.status === "rejected" && <td></td>}
          </tr>
        );
      } else {
        return null; // Data yang statusnya "approved" tidak ditampilkan
      }
    } else if (userRole === "Manager") {
      if (item.status === "pending") {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.nama}</td>
            <td>{item.cabang}</td>
            <td>{item.jumlah}</td>
            <td>{item.status}</td>
            <td>{item.tanggal_pengajuan}</td>
            {/* Menampilkan tombol hanya jika status bukan "rejected" atau "approved" */}
            {item.status !== "rejected" && (
              <td>
                <Button
                  variant="link"
                  style={{
                    padding: "0",
                    marginRight: "5px",
                    border: "none",
                    backgroundColor: "white",
                    border: "1px solid red" // Set border color to red
                  }}
                  onClick={() => handleReject(item.id)} // Menggunakan handleReject untuk tombol silang
                >
                  <FaTimes color="red" />
                </Button>

                <Button
                  variant="link"
                  style={{
                    padding: "0",
                    marginRight: "5px",
                    border: "none",
                    backgroundColor: "white",
                    border: "1px solid green" // Set border color to green
                  }}
                  onClick={() => handleApprove(item.id)} // Menggunakan handleApprove untuk tombol centang
                >
                  <FaCheck color="green" />
                </Button>
              </td>
            )}
            {/* Menampilkan kosong jika status "rejected" */}
            {item.status === "rejected" && <td></td>}
          </tr>
        );
      } else {
        return null; // Data selain "pending" tidak ditampilkan
      }
    } else if (userRole === "Office") {
      if (item.status == "pending" || item.status==="drafted") {
        return (
          <tr key={index}>
            <td>{index+1}</td>
            <td>{item.nama}</td>
            <td>{item.cabang}</td>
            <td>{item.jumlah}</td>
            <td>{item.status}</td>
            <td>{item.tanggal_pengajuan}</td>
            {/* Menampilkan tombol hanya jika status bukan "rejected" atau "approved" */}
            
            {/* Menampilkan kosong jika status "rejected" */}
            {item.status === "rejected" && <td></td>}
          </tr>
        );
      } else {
        return null; // Data selain "pending" tidak ditampilkan
      }
    }
  })}
</tbody>

                </Table>

                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableListPermintaan;


