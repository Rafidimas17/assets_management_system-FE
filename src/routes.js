/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableListPersediaan from "views/TableListPersediaan.js";
import TableListPermintaan from "views/TableListPermintaan.js";
import TableListRiwayat from "views/TableListRiwayat.js";
import DetailRiwayat from "views/DetailRiwayat.js";
import TableListCabang from "views/TableListCabang.js";
import TambahPersediaan from "views/TambahPersediaan.js";
import TableDetailBarangCabang from "views/TableDetailBarangCabang.js";
import BuatPermintaan from "views/BuatPermintaan.js";
import TambahCabang from "views/TambahCabang.js";
import TableListUser from "views/TableListUser.js";
import EditCabang from "views/EditCabang.js";
import UpdateUser from "views/UpdateUser.js";
import UbahPersediaan from "views/UbahPersediaan.js";


const dashboardRoutes = [  
 
  {
    path: "/persediaan-barang",
    name: "Persediaan barang",
    icon: "nc-icon nc-notes",
    component: TableListPersediaan,
    layout: "/admin"
  },
  {
    path: "/persediaan/tambah",   
    component: TambahPersediaan,
    layout: "/admin"
  },
  {
    path: "/persediaan-ubah/:id",   
    component: UbahPersediaan,
    layout: "/admin"
  },

  {
    path: "/permintaan-barang",
    name: "Permintaan barang",
    icon: "nc-icon nc-notes",
    component: TableListPermintaan,
    layout: "/admin"
  },
  {
    path: "/permintaan/buat",   
    component: BuatPermintaan,
    layout: "/admin"
  },
  {
    path: "/list-cabang",
    name: "Daftar Cabang",
    icon: "nc-icon nc-notes",
    component: TableListCabang,
    layout: "/admin"
  },

  {
    path: "/detail-cabang/:id",
    component: TableDetailBarangCabang,
    layout: "/admin"
  },
  
  {
    path: "/buat-cabang",
    component: TambahCabang,
    layout: "/admin"
  },
  {
    path: "/edit-cabang/:id",
    component: EditCabang,
    layout: "/admin"
  },
  {
    path: "/edit-user/:id",
    component: UpdateUser,
    layout: "/admin"
  },

  {
    path: "/list-user",
    name: "Daftar User",
    icon: "nc-icon nc-notes",
    component: TableListUser,
    layout: "/admin"
  },
  {
    path: "/riwayat",
    name: "Riwayat",
    icon: "nc-icon nc-notes",
    component: TableListRiwayat,
    layout: "/admin"
  },

  {
    path: "/detail/:id",   
    component: DetailRiwayat,
    layout: "/admin"
  },
  // {
  //   path: "/user",
  //   name: "Daftar Cabang",
  //   icon: "nc-icon nc-circle-09",
  //   component: UserProfile,
  //   layout: "/admin"
  // },  
];

export default dashboardRoutes;
