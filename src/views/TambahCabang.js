import React, { useState } from 'react';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';
import Cookies from 'js-cookie'; // Import js-cookies library
import { useHistory } from 'react-router-dom'; // Import useHistory hook

const MySwal = withReactContent(Swal);

const TambahCabang = () => {
    const [namaCabang, setNamaCabang] = useState('');
    const [alamat, setAlamat] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState('');
    const history = useHistory(); // Initialize useHistory

    const handleTambahCabang = async () => {
        try {
            const token = Cookies.get('token'); // Ambil token dari cookies
            const response = await axios.post('http://127.0.0.1:8000/api/center/cabang', {
                nama_cabang: namaCabang,
                alamat: alamat,
                nomor_telepon: nomorTelepon
            }, {
                headers: { Authorization: `Bearer ${token}` } // Sertakan token dalam header
            });
            
            if(response){
                MySwal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Cabang berhasil ditambahkan.'
                }).then(() => {                   
                    history.push('/admin/list-cabang');
                });
            }
            
            // Reset form setelah berhasil tambah cabang
            setNamaCabang('');
            setAlamat('');
            setNomorTelepon('');
        } catch (error) {
            console.error('Error:', error);
            // Menampilkan alert jika terjadi error
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan, silahkan coba lagi.'
            });
        }
    }

    return (
        <div>
            <h1>Tambah Cabang</h1>
            <Form>
                <Form.Group controlId="namaCabang">
                    <Form.Label>Nama Cabang</Form.Label>
                    <Form.Control type="text" placeholder="Masukkan nama cabang" value={namaCabang} onChange={(e) => setNamaCabang(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="alamat">
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control type="text" placeholder="Masukkan alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="nomorTelepon">
                    <Form.Label>Nomor Telepon</Form.Label>
                    <Form.Control type="text" placeholder="Masukkan nomor telepon" value={nomorTelepon} onChange={(e) => setNomorTelepon(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={handleTambahCabang}>
                    Tambah Cabang
                </Button>
            </Form>
        </div>
    );
}

export default TambahCabang;
