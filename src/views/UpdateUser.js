import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const UpdateUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    id: '',
    nama: '',
    email: '',
    username: '',
    role: '',
    cabang: '',
  });
  const history=useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    const token = Cookies.get('token');

    // Fetch user data
    axios.get(`http://127.0.0.1:8000/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      const userDataFromApi = response.data;
      setUserData(userDataFromApi);
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
    });

    // Fetch role options
    axios.get("http://127.0.0.1:8000/api/role")
      .then(response => {
        setRoleOptions(response.data[0]);
      })
      .catch(error => {
        console.error("Error fetching roles:", error);
      });

    // Fetch branch options
    axios.get("http://127.0.0.1:8000/api/cabang")
      .then(response => {
        setBranchOptions(response.data[0]);

        // Set selectedBranch to userData.cabang if it exists
        if (userData.cabang) {
          // Check if userData.cabang exists in branchOptions
          const foundBranch = response.data[0].find(branch => branch.nama_cabang === userData.cabang);
          if (foundBranch) {
            setSelectedBranch(foundBranch.id);
          }
        }
      })
      .catch(error => {
        console.error("Error fetching branches:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log(userData.cabang)
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    axios.put(`http://127.0.0.1:8000/api/user/${id}/update`, { 
        email: userData.email,        
        username: userData.username, 
        nama: userData.nama, 
        role: selectedRole, 
        cabang_id: selectedBranch
      }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('User updated successfully:', response.data);
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Update user berhasil.'
      });
      history.push('/admin/list-user')
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="nama">
        <Form.Label>Nama</Form.Label>
        <Form.Control type="text" name="nama" value={userData.nama} onChange={(e) => setFullName(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={userData.email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" name="username" value={userData.username} onChange={(e) => setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="role">
        <Form.Label>Role</Form.Label>
        <Form.Control as="select" name="role" onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="">Select Role</option>
          {roleOptions.map(role => (
            <option key={role.id} value={role.id} selected={userData.role === role.nama_role}>
              {role.nama_role}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
     <Form.Group controlId="cabang">
      <Form.Label>Cabang</Form.Label>
      <Form.Control as="select" name="cabang_id" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
        <option value="">Select Cabang</option>
        {branchOptions.map(cabang => (
          <option key={cabang.id} value={cabang.id}>
            {cabang.nama_cabang}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
      <Button variant="primary" type="submit">
        Update
      </Button>
    </Form>
  );
};

export default UpdateUser;
