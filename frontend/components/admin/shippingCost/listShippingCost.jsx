import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listShippingService, deleteShippingByIdService } from '../../../API/admin/shippingCostService'
import { numberGrouping } from '../../untils/frommatters/numberFormatting'
import { Table, Button } from 'react-bootstrap'

const ListShipping = () => {
  const [shipping, setShipping] = useState([])

  useEffect(() => {
    const getShipping = async () => {
      try {
        const res = await listShippingService()
        console.log(res.data)
        setShipping(res.data)
      } catch (err) {
        console.error("Error fetching shipping:", err)
      }
    };

    getShipping()
  }, [])

  const handleDelete = (id) => {
    deleteShippingByIdService(id)
      .then(() => {
        // ลบ item ที่มี id ตรงกันออกจาก shipping โดยใช้ filter
        setShipping(prevShipping => prevShipping.filter(shipp => shipp.shipping_rate_id !== id))
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>ขนส่ง</h2>
        <Link to="create" className="btn btn-success d-none d-md-inline-block"><i class="bi bi-plus-circle-fill"></i> เพิ่มการขนส่ง </Link>
        <Link to="create" className="btn btn-success btn-sm d-md-none"><i class="bi bi-plus-circle-fill"></i> เพิ่มการขนส่ง </Link>
      </div>

      <p>จำนวน {shipping.length} รายการ</p>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '15%' }}>บริษัทขนส่ง</th>
              <th style={{ width: '15%' }}>ประเภท</th>
              <th style={{ width: '25%' }}>ช่วงน้ำหนัก น้อย-มาก</th>
              <th style={{ width: '10%' }}>ราคา</th>
              <th style={{ width: '10%' }}>เวลาที่ใช้</th>
              <th style={{ width: '5%' }}>ดู</th>
              <th style={{ width: '5%' }}>แก้ไข</th>
              <th style={{ width: '5%' }}>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {shipping.map((shipp) => (
              <tr key={shipp.shipping_rate_id }>
                <td>{shipp.carrier_name}</td>
                <td>{shipp.service_type}</td>
                <td>{shipp.weight_range_min} กรัม - {shipp.weight_range_max} กรัม</td>
                <td>{numberGrouping(shipp.price)}</td>
                <td>{shipp.estimated_delivery_days} วัน</td>
                <td><Link to={`view/${shipp.shipping_rate_id }`} className="btn btn-info text-light d-grid mx-auto"><i class="bi bi-eye"></i></Link></td>
                <td><Link to={`edit/${shipp.shipping_rate_id }`} className="btn btn-warning d-grid mx-auto"><i className="bi bi-pencil"></i></Link></td>
                <td><button onClick={() => handleDelete(shipp.shipping_rate_id )} className="btn btn-danger d-grid mx-auto"><i className="bi bi-trash"></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-4">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {shipping.map((shipp) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={shipp.shipping_rate_id}>
                <div className="small text-secondary">
                  <td className="d-flex flex-row-reverse bd-highlight">
                  <Link to={`view/${shipp.shipping_rate_id }`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
                  </td>
                  <p className="mb-1">บริษัทขนส่ง: {shipp.carrier_name}</p>
                  <p className="mb-1">ประเภท: {shipp.service_type}</p>
                  <p className="mb-1">ช่วงน้ำหนัก น้อย-มาก: {shipp.weight_range_min} กรัม - {shipp.weight_range_max} กรัม</p>
                  <p className="mb-1">ราคา: {numberGrouping(shipp.price)}</p>
                  <p className="mb-1">เวลาที่ใช้: {shipp.estimated_delivery_days} วัน</p>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <button onClick={() => handleDelete(shipp.shipping_rate_id )} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> ลบ </button>
                  <Link to={`edit/${shipp.shipping_rate_id }`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ListShipping;