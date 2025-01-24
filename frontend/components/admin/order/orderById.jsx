import React, { useEffect, useState} from 'react';
import { useNavigate, Link, useParams  } from 'react-router-dom';
import Select from 'react-select';
import { getOrderByIdService, getStatusListForChangeOrder, updateStatusOrderService, getOrderHistoryByIdService, getOrderAddressService, updatePostCodeOrderService } from '../../../API/admin/ordersService';
import { formatDate, formatDateThai } from '../../untils/frommatters/datetime';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
import ConfirmPopUpModal from '../../untils/popUp/confirmPopUp';
import LoadingPopup from '../../untils/popUp/loading';
import ErrorPopup from '../../untils/popUp/errorPopup';
import { getTracking } from '../../../API/postMan/thailandPost';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PAYMENT

const orderById = () => {
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(false);;
  const [orderById, setOrderById] = useState([])
  const [statusOrderHistoryById, setStatusOrderHistoryById] = useState([])
  const [statusOrders, setStatusOrder] = useState([])
  const [ordersAddress, setOrderAddress] = useState([])
  const [status, setStatus] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState(null);
  const [showInputPostCode, setShowInputPostCode] = useState(false);
  const [postCode, setPostCode] = useState("");
  const [tracking, setTracking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async() => {
      try {
        const [
          getOrderById,
          getOrderHistoryById,
          getStatusOrder,
          getOrderAddress,
        ] = await Promise.all([
          getOrderByIdService(id),
          getOrderHistoryByIdService(id),
          getStatusListForChangeOrder(),
          getOrderAddressService(id),
        ]);
        console.log(getOrderById,getOrderHistoryById,getStatusOrder,getOrderAddress);
        
        setOrderById(getOrderById.data)
        setPostCode(getOrderById.data[0]?.post_code || "")
        setStatus(getOrderById.data[0]?.status)
        setStatusOrderHistoryById(getOrderHistoryById.data)
        setStatusOrder(getStatusOrder.data)
        setOrderAddress(getOrderAddress.data[0])
      } catch (error) {
        setError(error)
      }finally{
        setIsLoading(false);
      }
    }

    fetchData()
  },[])

  useEffect(() => {
    const trackingData = async () => {
      if (postCode) {
        try {
          const trackingData = await getTracking(postCode); // รอข้อมูลจาก API
          console.log("trackingData:", trackingData.response.items[postCode]); // ดูข้อมูลใน console
          setTracking(trackingData.response.items[postCode]); // ตั้งค่า state ด้วยข้อมูลที่ได้
        } catch (error) {
          console.error("Error fetching tracking data:", error); // จัดการกับ error
        }
      }
    };

    trackingData();
  }, [postCode])

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

  useEffect(()=> {
    console.log(status);
    const statusName = statusOrders.find((statusOrder) => statusOrder.status_order_id === status)?.status_name
    if(statusName === "อยู่ระหว่างการจัดส่ง"){
      setShowInputPostCode(true)
    }
  },[status])

  const handlePostCode = async () => {
    setIsLoading(true);
    try {
      if (postCode.trim() === "") {
        throw new Error("กรุณากรอกรหัสไปรษณีย์");
      }if (postCode.length !== 13) {
        throw new Error("กรุณากรอกรหัสไปรษณีย์ให้ครบ 13 หลัก");
      }else{
        const response = await updatePostCodeOrderService(id, postCode)
        console.log(response);
      }
    } catch (error) {
      setError(error.message); // เก็บข้อความผิดพลาดเเบบนี้จะช่วยให้ใช้ component ของ ErrorPopup ได้
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mt-5 p-3">
      <div className="card col-md-12 px-40 rounded shadow border bg-light card-body">
        <div className='row mb-1'>
          <div className="col-md-8 col-12">
              <label className="form-label fw-bold">รหัสคำสั่งซื้อ</label>
              <p className="border p-2 rounded bg-white">{orderById[0]?.orders_id}</p>
          </div>
          <div className="col-md-4 col-12 mb-1">
            <label className="form-label fw-bold">สถานะ</label>
            {orderById[0]?.status_name === "รอการชำระเงิน" ? (
              // แสดงข้อความธรรมดา
              <p className="border p-2 rounded bg-white">{orderById[0]?.status_name}</p>
            ) : (
              // แสดง select box
              <Select
                options={optionStatusOrders}
                name="material_id"
                value={optionStatusOrders.find((option) => option.value === status) || status}
                onChange={(option) => handleInputChange(option)}
                isSearchable={true}
                // placeholder="เลือกบรรจุภัณฑ์"
              /> 
            )}
            {/* <Select
              options={optionStatusOrders}
              name="material_id"
              value={optionStatusOrders.find((option) => option.value === status) || status}
              onChange={(option) => handleInputChange(option)}
              isSearchable={true}
              // placeholder="เลือกบรรจุภัณฑ์"
            /> */}
          </div>
          {/* ที่ใส่ postCode มาด้วยเพราะถ้าเปลี่ยนสถานะไป step ต่อไปที่ไม่ใช้อยู่ระหว่างการจัดส่งจะได้เห็น input นี้ เเต่ต้องกรอกรหัสพัสดุตั้งเเต่ step อยู่ระหว่างการจัดส่ง เป็นการเเก้ปัญหาจะได้ไม่ต้องเช็คหลายสถานะ */}
          {showInputPostCode || postCode ? (  
              <div className="row">
                <label className="form-label fw-bold">รหัสไปรษณีย์</label>
                <div className='col-md-4 col-8'>
                  <input type="text" className="form-control" placeholder="รหัสไปรษณีย์"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)} />
                </div>
                <div className='col-4'>
                  <button className="btn btn-success" type="button" onClick={handlePostCode}>บันทึก</button>
                </div>
              </div>
              
          ): null}
        </div>
        <div className="d-none d-md-block">
        <label className="form-label fw-bold">รายการคำสั่งซื้อ</label>
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
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
              <td className="text-end">{numberGrouping(orderById[0]?.price || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ค่าส่ง</strong></td>
              <td className="text-end">{numberGrouping(orderById[0]?.cost_shipping || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ค่ากล่อง</strong></td>
              <td className="text-end">{numberGrouping(orderById[0]?.cost_package || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ยอดชำระ</strong></td>
              <td className="text-end">{numberGrouping(orderById[0]?.price + orderById[0]?.cost_package + orderById[0]?.cost_shipping || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>ต้นทุนคำสั่งซื้อ</strong></td>
              <td className="text-end">{numberGrouping(orderById[0]?.total_cost || 0)} บาท</td>
            </tr>
            <tr>
              <td colSpan="5" className="text-end"><strong>กำไร</strong></td>
              <td className="text-end">{numberGrouping(orderById[0]?.profit || 0)} บาท</td>
            </tr>
          </tfoot>
        </table>
        </div>
        <div className="d-block d-md-none mt-3">
          <label className="form-label fw-bold">รายการคำสั่งซื้อ</label>
          <div className="border rounded p-3 bg-white">
            {orderById.map((order, index) => (
              <div key={index}>
                <div className="d-flex">
                  <h6 className="mb-2" style={{ marginRight: "10px" }}>{index + 1}</h6>
                  <img src={API_URL_PICTURE + order.productpic_name} height={100} width={150} alt="Material" className="img-fluid rounded"/>
                  <div className="ms-3 d-flex flex-column w-100">
                  <div className="small text-secondary mt-2">
                    <h6 className="mb-2">{order.product_name}</h6>
                    <p className="mb-1">ต้นทุน: {order.cost_product}</p>
                    <p className="mb-1">ราคาขาย: {order.selling_price_per_quantity}</p>
                    <p className="mb-1">จำนวน: {order.productCartQuantity} ชิ้น</p>
                  </div>
                  </div>
                </div>
                {index < orderById.length - 1 && <hr />}
              </div>
            ))}
          </div>
          <div className="px-3 card-body">
            <div className="row bg-white p-3 border rounded text-end small">
              <p>ราคารวมสินค้ารวม: {numberGrouping(orderById[0]?.price || 0)} บาท</p>
              <p>ค่าส่ง: {numberGrouping(orderById[0]?.cost_shipping || 0)} บาท</p>
              <p>ค่ากล่อง: {numberGrouping(orderById[0]?.cost_package || 0)} บาท</p>
              <p>ยอดชำระ: {numberGrouping(orderById[0]?.price + orderById[0]?.cost_package + orderById[0]?.cost_shipping || 0)} บาท</p>
              <p>ต้นทุนคำสั่งซื้อ: {numberGrouping(orderById[0]?.total_cost || 0)} บาท</p>
              <p>กำไร: {numberGrouping(orderById[0]?.profit || 0)} บาท</p>
            </div>
          </div>
        </div>
        <h5>รายละเอียดลูกค้า</h5>
        <div className='row'>
          <div className="mb-3 col-md-6 col-12">
            <label className="form-label fw-bold">ชื่อ</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.f_name}</p>
          </div>
          <div className="mb-3 col-md-6 col-12">
            <label className="form-label fw-bold">นามสกุล</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.l_name}</p>
          </div>
        </div>
        <div className='row'>
          <div className="mb-3 col-md-6 col-12">
            <label className="form-label fw-bold">ชื่อบัญชีลูกค้า</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.username}</p>
          </div>
          <div className="mb-3 col-md-6 col-12">
            <label className="form-label fw-bold">เบอร์โทรศัพท์</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.phone_number}</p>
          </div>
        </div>
        <div className='row'>
          <div className="mb-3 col-md-6 col-12">
            <label className="form-label fw-bold">ที่อยู่</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.house_no}</p>
          </div>
          <div className="mb-3 col-md-6 col-12">
            <label className="form-label fw-bold">ตำบล</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.tambon_name}</p>
          </div>
        </div>
        <div className='row'>
          <div className="mb-3 col-md-4 col-12">
            <label className="form-label fw-bold">อำเภอ</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.amphure_name}</p>
          </div>
          <div className="mb-3 col-md-4 col-12">
            <label className="form-label fw-bold">จังหวัด</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.province_name}</p>
          </div>
          <div className="mb-3 col-md-4 col-12">
            <label className="form-label fw-bold">รหัสไปรษณีย์</label>
            <p className="border p-2 rounded bg-white">{ordersAddress.zip_code}</p>
          </div>
        </div>

        <div className="mb-3 row">
          <div className='col-md-6 col-12'>
            <label className="form-label fw-bold mt-3">วันที่สั่ง</label>
            <p className="border p-2 rounded bg-white">{formatDate(orderById[0]?.created_at)}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
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
                className="rounded img-fluid"
            />
          </div>
        </div>
        
        <div className="mb-3">
        {tracking ? (
            tracking.length !== 0 ? (
              tracking.slice().reverse().map((item, index) => (
                <div className="row mb-2" key={index}>
                  <div className='col-4'>
                    <label className="form-label fw-bold">สถานะที่ดำเนินการ</label>
                    <p className="border p-2 rounded bg-white">{item.status_description || ""}</p>
                  </div>
                  <div className='col-4'>
                    <label className="form-label fw-bold">วันที่ดำเนินการ</label>
                    <p className="border p-2 rounded bg-white">{formatDateThai(item.status_date) || ""}</p>
                  </div>
                  <div className='col-4'>
                    <label className="form-label fw-bold">หมายเหตุ</label>
                    <p className="border p-2 rounded bg-white">{item.delivery_description || "ไม่มีหมายเหตุ"}</p>
                  </div>
                </div>
              ))
            ) : ("")
          ) : ("")}
          {statusOrderHistoryById.map((order, index) => (
            <div key={index} className="row p-2">
              <div className='col-4'>
                <label className="form-label fw-bold">สถานะที่ดำเนินการ</label>
                <p className="border p-2 rounded bg-white">{order.status_name || "ยังไม่มีคนรับออร์เดอร์"}</p>
              </div>
              <div className='col-4'>
                <label className="form-label fw-bold">วันที่ดำเนินการ</label>
                <p className="border p-2 rounded bg-white">{formatDate(order.change_time ) || "ยังไม่มีคนรับออร์เดอร์"}</p>
              </div>
              <div className='col-4'>
                <label className="form-label fw-bold">ผู้ดำเนินการ</label>
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
        title="เหตุผลในการยกเลิกคำสั่งซื้อ"
        text={errorMsg + ' ต้องการยืนยันใช้สถานะซ้ำไหม'}
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}

      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </div>

  );
};

export default orderById;