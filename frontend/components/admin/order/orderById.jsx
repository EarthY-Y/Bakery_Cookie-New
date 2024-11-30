import React, { useEffect, useState} from 'react';
import { useNavigate, Link, useParams  } from 'react-router-dom';
import Select from 'react-select';
import { getOrderByIdService, getStatusOrderService, updateStatusOrderService, getOrderHistoryByIdService } from '../../../API/admin/ordersService';
import { formatDate } from '../../untils/frommatters/datetime';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
import ConfirmPopUpModal from '../../untils/popUp/confirmPopUp';


const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const orderById = () => {
  const {id} = useParams();
  const [orderById, setOrderById] = useState([])
  const [orderHistoryById, setOrderHistoryById] = useState([])
  const [statusOrders, setStatusOrder] = useState([])
  const [status, setStatus] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [totalCost, setTotalCost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrderById = async()=> {
      try {
        const response = await getOrderByIdService(id)
        console.log(response);
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setOrderById(response.data)
        setStatus(response.data[0]?.status)
      }
      
      catch (error) {
        alert(error)
      }
    }
    getOrderById()
  },[])

  useEffect(() => {
    const getOrderHistoryById = async()=> {
      try {
        const response = await getOrderHistoryByIdService(id)
        console.log(response);
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setOrderHistoryById(response.data)
      }
      
      catch (error) {
        alert(error)
      }
    }
    getOrderHistoryById()
  },[showCancelModal])

  useEffect(() => {
    const getStatusOrderById = async()=> {
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
    getStatusOrderById()
  },[])

  const handleInputChange = (option) => {
    console.log(option.value);
    setStatus(option.value); // อัปเดต formData
    hadleUpadateStatus(option.value)
  };

  const hadleUpadateStatus = async(value) => {
    try {
      const response = await updateStatusOrderService(value, id)
      console.log(response);
      
    } catch (error) {
      console.log(error);
      if(error.response.data.message){
        setErrorMsg(error.response.data.message)
        setShowCancelModal(true)
      }
    }
  }

  const optionStatusOrders = statusOrders.map((status) => ({
    value: status.status_order_id,
    label: status.status_name
  }));

  const handleConfirm = async() => {
    try {
      const response = await updateStatusOrderService(status, id, 'skip')
      console.log(response);
      
    } catch (error) {
      console.log(error);
    }
  };

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
            {/* {orderById[0]?.status === "รอการชำระเงิน" ? (
              // แสดงข้อความธรรมดา
              <p className="border p-2 rounded bg-white">{orderById[0]?.status}</p>
            ) : (
              // แสดง select box
              <select className="form-select" value={orderById[0]?.status} onChange={(e) => handleInputChange(e.target.value)}>
                  <option disabled>Select status</option>
                  {statusOrders.map((statusOrder) => (
                      <option key={statusOrder.status_order_id} value={statusOrder.status_order_id}>
                          {statusOrder.status_name}
                      </option>
                  ))}
              </select>
            )} */}
            <Select
              options={optionStatusOrders}
              name="material_id"
              value={optionStatusOrders.find((option) => option.value === status) || status}
              onChange={(option) => handleInputChange(option)}
              isSearchable={true}
              // placeholder="เลือกบรรจุภัณฑ์"
            />
          </div>
        </div>
        <label className="form-label fw-bold">รายการคำสั่งซื้อ</label>

        <table className="table table-bordered bg-white">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>รายการที่</th>
              <th style={{ width: '10%' }}>รูปภาพ</th>
              <th style={{ width: '25%' }}>ชื่อสินค้า</th>
              <th style={{ width: '15%' }}>ต้นทุน</th>
              <th style={{ width: '15%' }}>ราคาขาย</th>
              <th style={{ width: '22%' }}>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {orderById.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><img src={API_URL_PICTURE + order.productpic_name} height={100} width={150} alt="Material" className="rounded"/></td>
                <td>{order.product_name}</td>
                <td>{order.cost_product}</td>
                <td>{order.selling_price_per_quantity}</td>
                <td>{order.productCartQuantity} ชิ้น</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="text-end"><strong>ราคารวมสินค้ารวม</strong></td>
              <td>{numberGrouping(orderById[0]?.price || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ค่าส่ง</strong></td>
              <td>{numberGrouping(orderById[0]?.cost_shipping || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ค่ากล่อง</strong></td>
              <td>{numberGrouping(orderById[0]?.cost_package || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ยอดชำระ</strong></td>
              <td>{numberGrouping(orderById[0]?.price + orderById[0]?.cost_package + orderById[0]?.cost_shipping || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ต้นทุนคำสั่งซื้อ</strong></td>
              <td>{numberGrouping(orderById[0]?.total_cost || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>กำไร</strong></td>
              <td>{numberGrouping(orderById[0]?.profit || 0)} บาท</td>
            </tr>
          </tfoot>
        </table>

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
          {orderHistoryById.map((order, index) => (
            <div key={index} className="row p-2">
              <div className='col-4'>
                <label className="form-label fw-bold">วันที่ดำเนินการ</label>
                <p className="border p-2 rounded bg-white">{formatDate(order.change_time ) || "ยังไม่มีคนรับออร์เดอร์"}</p>
              </div>
              <div className='col-4'>
                <label className="form-label fw-bold">สถานะที่ดำเนินการ</label>
                <p className="border p-2 rounded bg-white">{order.status_name || "ยังไม่มีคนรับออร์เดอร์"}</p>
              </div>
              <div className='col-4'>
                <label className="form-label fw-bold">ชื่อผู้ดำเนินการ</label>
                <p className="border p-2 rounded bg-white">{order.username || "ยังไม่มีคนรับออร์เดอร์"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmPopUpModal
        showModal={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleConfirm={handleConfirm}
        text={errorMsg + ' ต้องการยืนยันใช้สถานะซ้ำไหม'}
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>

  );
};

export default orderById;