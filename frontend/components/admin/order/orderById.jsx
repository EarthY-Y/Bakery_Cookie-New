import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { getOrderByIdService,getStatusOrderService, updateStatusOrderService } from '../../../API/admin/ordersService';
import { formatDate } from '../../untils/frommatters/datetime';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const orderById = () => {
  const {id} = useParams();
  const [orderById, setOrderById] = useState([])
  const [statusOrders, setStatusOrder] = useState([])
  const [status, setStatus] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const getlistMaterialById = async()=> {
      try {
        const response = await getOrderByIdService(id)
        console.log(response);
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setOrderById(response.data)
      }
      
      catch (error) {
        alert(error)
      }
    }
    getlistMaterialById()
  },[])

  useEffect(() => {
    const getlistMaterialById = async()=> {
      try {
        const response = await getStatusOrderService()
        console.log(response);
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setStatusOrder(response.data)
      }
      
      catch (error) {
        alert(error)
      }
    }
    getlistMaterialById()
  },[])

  
  const handleInputChange = (value) => {
    console.log(value);
    setStatus(value); // อัปเดต formData
    hadleUpadateStatus(value)
  };

  const hadleUpadateStatus = async(value) => {
    try {
      const response = await updateStatusOrderService(value, id)
      console.log(response);
      
    } catch (error) {
      
    }
  }
    

  return (
    <div className="container mt-5 p-4 ">
      <Link to="/orderslist" className="btn btn-light text-black mb-4">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 rounded shadow-sm border bg-light card-body">
        <div className='row'>
          <div className="mb-3 col-8">
              <label className="form-label fw-bold">รหัสคำสั่งซื้อ</label>
              <p className="border p-2 rounded bg-white">{orderById[0]?.orders_id}</p>
          </div>
          <div className="mb-3 col-4">
            <label className="form-label fw-bold">สถานะ</label>
            {/* {orderById[0]?.status === "order-รอชำระเงิน" ? (
              // แสดงข้อความธรรมดา
              <p className="border p-2 rounded bg-white">{orderById[0]?.status}</p>
            ) : (
              // แสดง select box
              <select className="form-select" value={orderById[0]?.status} onChange={(e) => handleInputChange(e.target.value)}>
                  <option disabled>Select Material</option>
                  {statusOrders.map((statusOrder) => (
                      <option key={statusOrder.status_order_id} value={statusOrder.status_order_id}>
                          {statusOrder.status_name}
                      </option>
                  ))}
              </select>
            )} */}
            <select className="form-select" value={status || orderById[0]?.status} onChange={(e) => handleInputChange(e.target.value)}>
              <option disabled>Select Material</option>
              {statusOrders.map((statusOrder) => (
                  <option key={statusOrder.status_order_id} value={statusOrder.status_order_id}>
                      {statusOrder.status_name}
                  </option>
              ))}
            </select>
          </div>
        </div>


        <div className="mb-3">
            <label className="form-label fw-bold">จำนวนคำสั่งซื้อ</label>
            <p className="border p-2 rounded bg-white">{orderById.length}</p>
        </div>
        <label className="form-label fw-bold">รายการคำสั่งซื้อ</label>

        <table className="table table-bordered bg-white">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>รายการที่</th>
              <th style={{ width: '10%' }}>รูปภาพ</th>
              <th style={{ width: '25%' }}>ชื่อสินค้า</th>
              <th style={{ width: '25%' }}>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {orderById.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><img src={API_URL_PICTURE + order.productpic_name} height={100} width={150} alt="Material" className="rounded"/></td>
                <td>{order.product_name}</td>
                <td>{order.productCartQuantity} ชิ้น</td>
              </tr>
            ))}
          </tbody>
        </table>
          
        <div className="mb-3">
            <label className="form-label fw-bold">ปริมาณ</label>
            <p className="border p-2 rounded bg-white">{orderById[0]?.quantity}</p>
        </div>

        <div className="mb-3">
            <label className="form-label fw-bold">รวมเป็นเงิน</label>
            <p className="border p-2 rounded bg-white">{orderById[0]?.price}</p>
        </div>

        <div className="mb-3 row">
          <div className='col-6'>
            <label className="form-label fw-bold ">วันที่สั่ง</label>
            <p className="border p-2 rounded bg-white">{formatDate(orderById[0]?.created_at)}</p>
          </div>
          <div className='col-6'>
            <label className="form-label fw-bold ">วันที่ชำระเงิน</label>
            <p className="border p-2 rounded bg-white">{formatDate(orderById[0]?.updated_at)}</p>
          </div>
        </div>
        <div className="text-center mb-4">
          <label className="form-label fw-bold ">สลิปเงิน</label>
          <div>
            <img
                src={API_URL_PICTURE + orderById[0]?.statement_picture}
                height={250}
                width={400}
                alt="ยังไม่ได้จ่ายเงิน"
                className="rounded"
            />
          </div>
        </div>
        <div className="mb-3">
            <label className="form-label fw-bold">รับออร์เดอร์โดย</label>
            <p className="border p-2 rounded bg-white">{orderById[0]?.updated_by}</p>
        </div>

        </div>
    </div>

  );
};

export default orderById;