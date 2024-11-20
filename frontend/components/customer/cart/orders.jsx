import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAddressCustomer, getAddressCustomer, createOrder } from '../../../API/customer/paymentService';
import { getPorductCartService} from '../../../API/customer/productService';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const cartProduct = () => {
  const {id} = useParams();
  const [address, setAddress] = useState([])
  const [productCart, setProductCart] = useState([])
  const [totalPriceProduct, setTotalPriceProduct] = useState(0); 
  const [totalPrice, setTotalPrice] = useState(0); 
  const [totalQuantity, setTotalQuantity] = useState(0); 
  const navigate = useNavigate()
  console.log(id);
  
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
        const response = await getPorductCartService()
        if(!response.data || response.data.length === 0){
          throw new Error("ไม่มีข้อมูล")
        }
        console.log(response.data);
        setProductCart(response.data)
      }
      catch (error) {
        alert(error)
        navigate("/home")
      }
    }
    getCart()
  },[])
  
  useEffect(() => {
    const total = productCart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(total);
  }, [productCart]);

  // คำนวณราคาสินค้า
  useEffect(() => {
    const total = productCart.reduce((acc, item) => acc + item.selling_price_per_quantity * item.quantity, 0);
    setTotalPriceProduct(total);
  }, [productCart]);
  // 
  useEffect(() => {
    const total = totalPriceProduct /* อนาคตต้องทำคำนวนต้นทุนค่าส่ง */;
    setTotalPrice(total);
  }, [totalPriceProduct]);

  const handleSubmmit = async(event) => {
    event.preventDefault();
    try {
      console.log();
      const response = await createOrder(productCart, totalPrice, totalQuantity)
      if(response.data){
        navigate("/payment/"+id)
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
              <b>{address.houseNo} ตำบล{address.tambon_nameTH} อำเภอ{address.amphure_nameTH} จังหวัด{address.province_nameTH} {address.zip_code}</b>
            </div>
          </div>
          
        </div>
        <table className="table table-bordered mt-3 rounded">
          <thead className="thead-light">
            <tr>
              <th>รายการสินค้าที่สั่งซื้อ</th>
              <th>ราคาต่อชุด</th>
              <th>จำนวน</th>
              <th>ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            {productCart.length > 0 ? (
              productCart.map((item) => (
                <tr key={item.cart_product_id }>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={`${API_URL_PICTURE}/${item.productpic_name}`}
                        alt="Product"
                        style={{ width: '150px', height: '100px', marginRight: '10px' }}
                      />
                      <span>ชื่อสินค้า {item.product_name}</span>
                    </div>
                  </td>
                  <td>{numberGrouping(item.selling_price_per_quantity)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                        <p>{item.quantity}</p>
                    </div>
                  </td>
                  <td>{numberGrouping(item.selling_price_per_quantity * item.quantity)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  ไม่มีสินค้าในตะกร้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-end">
          <button type='submit' className="btn btn-success btn-lg">ชำระเงิน</button>
        </div>
      </div>
    </form>
  );
};

export default cartProduct;