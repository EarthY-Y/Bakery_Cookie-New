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
        <h2>วัตถุดิบ</h2>
        <Link to="create" className="btn btn-outline-warning text-dark">
          เพิ่มวัตถุดิบ
        </Link>
      </div>

      <p>จำนวน {shipping.length} รายการ</p>
      <Table striped bordered hover responsive="sm">
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '15%' }}>บริษัทขนส่ง</th>
            <th className="text-center align-middle" style={{ width: '15%' }}>ประเภท</th>
            <th className="text-center align-middle" style={{ width: '25%' }}>ช่วงน้ำหนัก น้อย-มาก</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ราคา</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>เวลาที่ใช้</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>ดู</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>แก้ไข</th>
            <th className="text-center align-middle" style={{ width: '5%' }}>ลบ</th>
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
              <td><Link to={`view/${shipp.shipping_rate_id }`} className="btn btn-outline-warning text-dark d-grid mx-auto">View</Link></td>
              <td><Link to={`edit/${shipp.shipping_rate_id }`} className="btn btn-outline-warning text-dark d-grid mx-auto"><i className="bi bi-pencil"></i></Link></td>
              <td><button onClick={() => handleDelete(shipp.shipping_rate_id )} className="btn btn-outline-warning btn-danger text-dark d-grid mx-auto"><i className="bi bi-trash"></i></button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListShipping;
