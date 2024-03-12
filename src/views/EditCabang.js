import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const EditCabang = () => {
    const { id } = useParams();
    const history = useHistory();
    const MySwal = withReactContent(Swal);

    const [formData, setFormData] = useState({
        nama_cabang: '',
        alamat: '',
        nomor_telepon: ''
    });

    useEffect(() => {
        const fetchCabangDetail = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/center/cabang-detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const { nama_cabang, alamat, nomor_telepon } = response.data[0];
                setFormData({
                    nama_cabang,
                    alamat,
                    nomor_telepon
                });
            } catch (error) {
                console.error('Error fetching cabang detail:', error);
            }
        };

        fetchCabangDetail();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            await axios.put(`http://127.0.0.1:8000/api/center/cabang/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            MySwal.fire({
                icon: 'success',
                title: 'Berhasil ubah data!',
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    Cookies.set("token", token);
                    history.push("/admin/list-cabang");
                }
            });
        } catch (error) {
            console.error('Error updating cabang:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="namaCabang">
                <Form.Label>Nama Cabang:</Form.Label>
                <Form.Control
                    type="text"
                    name="nama_cabang"
                    value={formData.nama_cabang}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group controlId="alamatCabang">
                <Form.Label>Alamat:</Form.Label>
                <Form.Control
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group controlId="nomorTelepon">
                <Form.Label>Nomor Telepon:</Form.Label>
                <Form.Control
                    type="text"
                    name="nomor_telepon"
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Simpan Perubahan
            </Button>
        </Form>
    );
};

export default EditCabang;
