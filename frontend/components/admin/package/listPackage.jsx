import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../untils/frommatters/datetime';
import { Table, Button } from 'react-bootstrap';
import { listPackageService, deletePackageByIdService } from '../../../API/admin/packageService';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const ListPackage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await listPackageService()
        console.log(res.data);

        setProducts(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getPosts();
  }, []);

  const handleDelete = (id) => {
    deletePackageByIdService(id)
      .then(() => {
        // ลบ item ที่มี id ตรงกันออกจาก materials โดยใช้ filter
        setProducts(prevProduct => prevProduct.filter(product => product.package_id !== id))
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>สินค้าหน้าร้าน</h2>
        <Link to="create" className="btn btn-outline-warning text-dark">
          เพิ่มสินค้า
        </Link>
      </div>

      <p>จำนวน {products.length} รายการ</p>
      <Table striped bordered hover responsive="sm">
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '20%' }}>รูปภาพ</th>
            <th className="text-center align-middle" style={{ width: '30%' }}>ชื่อสินค้า</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ต้นทุน</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>จำนวน/ชุด</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ต้นทุน/ชิ้น</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>ดู</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>แก้ไข</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>ลบ</th>
          </tr>
        </thead>

        <tbody>

          {products.map((products, index) => (
            <tr key={index}>
              <td><img src={API_URL_PICTURE + products.package_pic} className="img-fluid text-center" style={{ maxHeight: '75px', maxWidth: '120px' }} /></td>
              <td>{products.package_name}</td>
              <td>{products.cost}</td>
              <td>{products.quantity}</td>
              <td>{products.cost_per_quantity}</td>
              {/* <td>{formatDate(products.created_at)}</td> */}
              <td><Link to={`view/${products.package_id}`} className="btn btn-outline-warning text-dark d-grid mx-auto">View</Link></td>
              <td><Link to={`edit/${products.package_id}`} className="btn btn-outline-warning text-dark d-grid mx-auto">Edit</Link></td>
              <td><button onClick={() => handleDelete(products.package_id)} className="btn btn-outline-warning btn-danger text-dark d-grid mx-auto">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

  );
};

export default ListPackage;