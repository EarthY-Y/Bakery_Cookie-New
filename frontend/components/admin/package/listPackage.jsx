import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../untils/frommatters/datetime';
import { Table, Button } from 'react-bootstrap';
import { listPackageService, deletePackageByIdService } from '../../../API/admin/packageService';
import Search from '../../untils/fucntion/search';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const ListPackage = () => {
  const [packges, setPackges] = useState([]);
  const [packgesSearch, setPackgesSearch] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await listPackageService()
        console.log(res.data);

        setPackges(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getPosts();
  }, []);

  const handleSearch = (results) => {
    setPackgesSearch(results);
  };

  const handleDelete = (id) => {
    deletePackageByIdService(id)
      .then(() => {
        // ลบ item ที่มี id ตรงกันออกจาก materials โดยใช้ filter
        setPackges(prevProduct => prevProduct.filter(product => product.package_id !== id))
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>บรรจุภัณฑ์</h2>
        <Link to="create" className="btn btn-success d-none d-md-inline-block"><i className="bi bi-plus-circle-fill"></i> เพิ่มบรรจุภัณฑ์ </Link>
        <Link to="create" className="btn btn-success btn-sm d-md-none"><i className="bi bi-plus-circle-fill"></i> เพิ่มบรรจุภัณฑ์ </Link>
      </div>
      <Search 
        data={packges}
        handleSearch = {handleSearch}
        name = "ชื่อวัตถุดิบ"
        itemKeys = "package_name"
      />
      <p>จำนวน {packgesSearch.length} รายการ</p>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '15%' }}>รูปภาพ</th>
              <th style={{ width: '30%' }}>ชื่อบรรจุภัณฑ์</th>
              <th style={{ width: '10%' }}>ต้นทุน</th>
              <th style={{ width: '10%' }}>จำนวน/ชุด</th>
              <th style={{ width: '10%' }}>ต้นทุน/ชิ้น</th>
              <th style={{ width: '15%' }}>สถานะ</th>
              <th style={{ width: '5%' }}>ดู</th>
              <th style={{ width: '5%' }}>แก้ไข</th>
            </tr>
          </thead>

          <tbody>
            {packgesSearch.map((packges, index) => (
              <tr key={index}>
                <td><img src={API_URL_PICTURE + packges.package_pic} className="img-fluid rounded" style={{ maxHeight: '75px', maxWidth: '120px' }} /></td>
                <td>{packges.package_name}</td>
                <td>{packges.cost} บาท</td>
                <td>{packges.quantity} ชิ้น</td>
                <td>{packges.cost_per_quantity} บาท/ชิ้น</td>
                {packges.is_active == 1 ? (<td className="text-center text-success">เปิดใช้งาน</td>):(<td className="text-center text-danger">ปิดการใช้งาน</td>)}
                {/* <td>{formatDate(packges.created_at)}</td> */}
                <td><Link to={`view/${packges.package_id}`} className="btn btn-info text-light d-grid mx-auto"><i className="bi bi-eye"></i></Link></td>
                <td><Link to={`edit/${packges.package_id}`} className="btn btn-warning d-grid mx-auto"><i className="bi bi-pencil"></i></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-4">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {packgesSearch.map((packges, index) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={index}>
                <div className="d-flex">
                  <img src={API_URL_PICTURE + packges.package_pic} className="img-fluid rounded" style={{ maxHeight: '75px', maxWidth: '120px' }} />
                  <div className="ms-3 justify-content-between">
                    <h6 className="mb-3">{packges.package_name}</h6>
                    <Link to={`view/${packges.package_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
                  </div>
                </div>
                <div className="small text-secondary mt-3">
                  <p className="mb-1">ต้นทุน: {packges.cost} บาท</p>
                  <p className="mb-1">จำนวน/ชุด: {packges.quantity} ชิ้น</p>
                  <p className="mb-1">ต้นทุน/ชิ้น: {packges.cost_per_quantity} บาท/ชิ้น</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  {packges.is_active == 1 ? (<p className="mb-1 text-success">เปิดใช้งาน</p>):(<p className="mb-1 text-danger">ปิดใช้งาน</p>)}
                  <Link to={`edit/${packges.package_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
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