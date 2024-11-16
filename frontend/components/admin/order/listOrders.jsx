import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { listOrderService } from '../../../API/admin/ordersService';
import { formatDate } from '../../untils/frommatters/datetime';

const ListOrders = () => {
  const [orders, setorders] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res  = await listOrderService()
        console.log(res.data);
        setorders(res.data)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getPosts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>รายการสั่งซื้อ</h2>
      </div>

      {/* <p>จำนวน {materials.length} รายการ</p> */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '25%' }}>รหัสคำสั่งซื้อ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ปริมาณ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>ราคารวม</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่สั่งซื้อ</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่ชำระเงิน</th>
            <th className="text-center align-middle" style={{ width: '15%' }}>status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orders_id}>
              <td>{order.orders_id}</td>
              <td>{order.quantity} ชิ้น</td>
              <td>{order.price} บาท</td>
              <td>{formatDate(order.create_at)}</td>
              <td>{ formatDate(order.updated_at) || `รอชำระเงิน`}</td>
              <td>{order.status}</td>
              <td><Link to={`view/${order.material_id}`} className="btn btn-outline-warning text-black">View</Link></td>
              <td><Link to={`edit/${order.material_id}`} className="btn btn-outline-warning text-black"><i className="bi bi-pencil"></i></Link></td>
              <td><button onClick={() => handleDelete(order.material_id)} className="btn btn-outline-warning btn-danger text-black"><i className="bi bi-trash"></i></button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListOrders;
