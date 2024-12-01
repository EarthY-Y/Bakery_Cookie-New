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
        <h2>บรรจุภัณฑ์</h2>
        <Link to="create" className="btn btn-success d-none d-md-inline-block"><i class="bi bi-plus-circle-fill"></i> เพิ่มบรรจุภัณฑ์ </Link>
        <Link to="create" className="btn btn-success btn-sm d-md-none"><i class="bi bi-plus-circle-fill"></i> เพิ่มบรรจุภัณฑ์ </Link>
      </div>

      <p>จำนวน {products.length} รายการ</p>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '15%' }}>รูปภาพ</th>
              <th style={{ width: '30%' }}>ชื่อบรรจุภัณฑ์</th>
              <th style={{ width: '10%' }}>ต้นทุน</th>
              <th style={{ width: '10%' }}>จำนวน/ชุด</th>
              <th style={{ width: '10%' }}>ต้นทุน/ชิ้น</th>
              <th style={{ width: '5%' }}>ดู</th>
              <th style={{ width: '5%' }}>แก้ไข</th>
              <th style={{ width: '5%' }}>ลบ</th>
            </tr>
          </thead>

          <tbody>

            {products.map((products, index) => (
              <tr key={index}>
                <td><img src={API_URL_PICTURE + products.package_pic} className="img-fluid rounded" style={{ maxHeight: '75px', maxWidth: '120px' }} /></td>
                <td>{products.package_name}</td>
                <td>{products.cost}</td>
                <td>{products.quantity}</td>
                <td>{products.cost_per_quantity}</td>
                {/* <td>{formatDate(products.created_at)}</td> */}
                <td><Link to={`view/${products.package_id}`} className="btn btn-info text-light d-grid mx-auto"><i class="bi bi-eye"></i></Link></td>
                <td><Link to={`edit/${products.package_id}`} className="btn btn-warning d-grid mx-auto"><i className="bi bi-pencil"></i></Link></td>
                <td><button onClick={() => handleDelete(products.package_id)} className="btn btn-danger d-grid mx-auto"><i className="bi bi-trash"></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-4">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {products.map((products, index) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={index}>
                <div className="d-flex">
                  <img src={API_URL_PICTURE + products.package_pic} className="img-fluid rounded" style={{ maxHeight: '75px', maxWidth: '120px' }} />
                  <div className="ms-3 d-flex flex-column justify-content-between w-100">
                    <h6 className="mb-2">{products.package_name}</h6>
                    <div>
                      <Link to={`view/${products.package_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
                    </div>
                  </div>
                </div>
                <div className="small text-secondary mt-2">
                  <p className="mb-1">ต้นทุน: {products.cost}</p>
                  <p className="mb-1">จำนวน/ชุด: {products.quantity}</p>
                  <p className="mb-1">ต้นทุน/ชิ้น: {products.cost_per_quantity}</p>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <button onClick={() => handleDelete(products.package_id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> ลบ </button>
                  <Link to={`edit/${products.package_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default ListPackage;