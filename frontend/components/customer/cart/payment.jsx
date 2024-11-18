import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAddressCustomer, getAddressCustomer, updatePaymentOrder, getOrdersService } from '../../../API/customer/paymentService';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const cartProduct = () => {
  const id = useParams().id //เพราะว่ามันส่งมาจาก navigate ของหน้า orders เลยมาเป็น object ทำให้เกิดปัญหากับหลังบ้านเลยต้อง .id ในกรณีที่ไม่ใส่ {id}
  const [address, setAddress] = useState([])
  const [productOrder, setOrders] = useState([])
  const [totalPriceProduct, setTotalPriceProduct] = useState(0); 
  const [totalPrice, setTotalPrice] = useState(0); 
  const [Picture, setPicture] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    const validateAddress = async() => {
      try {
          const response = await validateAddressCustomer()
          if(!response.data || response.data.length === 0){
            throw new Error("ไม่มีข้อมูล")
          }
          console.log(response.data);
        }
        catch (error) {
          alert("คุณยังไม่ได้กรอกข้อมูลที่อยู่")
          navigate('/create/address')
        }
    }
    validateAddress()
  },[])

  useEffect(() => {
    const getAddress = async() => {
      try {
          const response = await getAddressCustomer()
          if(!response.data || response.data.length === 0){
            throw new Error("ไม่มีข้อมูล")
          }
          console.log(response.data);
          setAddress(response.data[0])
        }
        catch (error) {
          alert("คุณยังไม่ได้กรอกข้อมูลที่อยู่")
          navigate('/create/address')
        }
    }
    getAddress()
  },[])

  useEffect(() => {
    const getCart = async()=> {
      try {
        const response = await getOrdersService(id)
        // if(!response.data || response.data.length === 0){
        //   throw new Error("ไม่มีข้อมูล")
        // }
        console.log(response.data);
        setOrders(response.data[0])
        setTotalPriceProduct(response.data[0].price)
      }
      catch (error) {
        alert(error)
        navigate("/home")
      }
    }
    getCart()
  },[])
  
  // 
  useEffect(() => {
    const total = totalPriceProduct + 52 /* อนาคตต้องทำคำนวนต้นทุนค่าส่ง */;
    setTotalPrice(total);
  }, [productOrder]);

  const handleSubmmit = async(event) => {
    event.preventDefault();
    try {
      const formData = new FormData();  
      formData.append('file', Picture);
      console.log();
      const response = await updatePaymentOrder(formData, id )
      console.log(response);
      if(response.data){
        navigate("/home")
      }else {
        throw new Error("เกิดข้อผิดพลาดบ้างอย่าง")
      }
    } catch (error) {
      console.log(error);
      alert(error)
    }
  }

  return (    
    <form onSubmit={handleSubmmit}>
      <div className="container my-5">
        <h1 className="mb-4">ชำระเงิน</h1>
        <div className='bg-light p-3 rounded'>
          <h3>ที่อยู่ที่ใช้ในการจัดส่ง</h3>
          <div className='row'>
            <div className='col-4'>
              <b>{address.f_name} {address.l_name} 0{address.phone_number}</b>
            </div>
            <div className='col-8'>
              <b>{address.houesNo} ตำบล{address.tambon_nameTH} อำเภอ{address.amphure_nameTH} จังหวัด{address.province_nameTH} {address.zip_code}</b>
            </div>
          </div>
        </div>
        <div className=" bg-light mt-3 p-3 rounded text-center">
          <div className='d-flex justify-content-between'>
            <div>
                <h3>ช่องทางการชำระเงิน</h3>
                <div>
                  <h5>ธนาคารกรุงไทย เลขที่บัญชี: <strong>000-000-000-0</strong> </h5> 
                </div>
              </div>
              
              <div className='me-5'>
                <div className='mb-3'>
                  <strong className="text-uppercase">ราคารวมสินค้า: {numberGrouping(totalPriceProduct)}</strong> <br />
                  <strong className="text-uppercase">ราคาส่ง: {numberGrouping(52)}</strong> <br />
                  <strong className="text-uppercase text-danger">ราคารวม: {numberGrouping(totalPrice)}</strong> <br />
                </div>
              </div>
            </div>
            <div className="position-relative " style={{ margin: '2%', width: '300px', height: '300px', border: '1px dashed #ccc', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {Picture ? (
                <img src={URL.createObjectURL(Picture)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              ) : (
                <span>เพิ่มรูปวัตถุดิบ</span>
              )}
              <input type="file" className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0, cursor: 'pointer' }} onChange={(e) => setPicture(e.target.files[0])} />
            </div>
            <div>
              <button type='submit' className="btn btn-success btn-lg" disabled={!Picture}>ชำระเงิน</button>
            </div>
          </div>
        </div>
    </form>
  );
};

export default cartProduct;