import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAddressCustomer, getAddressCustomer, createOrder, getShippingRate } from '../../../API/customer/paymentService';
import { getPorductCartService} from '../../../API/customer/productService';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
import LoadingPopup from '../../untils/popUp/loading';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const orders = () => {
  const {id} = useParams();
  const [address, setAddress] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [productCart, setProductCart] = useState([])
  const [totalPriceProduct, setTotalPriceProduct] = useState(0); 
  const [totalPrice, setTotalPrice] = useState(0); 
  const [totalQuantity, setTotalQuantity] = useState(0); 
  const [totalWeight, setTotalWeigth] = useState(0); 
  const [toatalShippingRate, settoatalShippingRate] = useState(0); 
  const navigate = useNavigate()
  console.log(id);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 3000)); //ถ้าอยากลองดูหน้า loading
        // โหลดข้อมูลพร้อมกันเพื่อลดปัญหาการโหลดข้อมูลไม่ทัน
        const [
          porductCart,
          addressCustomer,
        ] = await Promise.all([
          getPorductCartService(),
          getAddressCustomer(),

        ]);
        if(addressCustomer){
          setAddress(addressCustomer.data[0])
        }else{
          navigate('/create/address')
        }
        if(addressCustomer){
          setProductCart(porductCart.data)
        }else{
          navigate('/home')
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

  }, [id]);  

  useEffect(() => {
    const total = productCart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(total);
    
    const weight = productCart.reduce((acc, item) => acc + (item.weight_per_piece * item.quantity), 0)
    console.log(weight);
    setTotalWeigth(weight)
    
  }, [productCart]);

  useEffect(() => {
    const shippingRate = async() => {
      try {
        const response = await getShippingRate(totalWeight)
        console.log(response);
        settoatalShippingRate(response.data[0])
        
      } catch (error) {
        console.error("Error ShippingRate data:", error);
      }
      shippingRate()
    } 
  },[totalWeight])

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
    <form className="container my-5" onSubmit={handleSubmmit}>
      <div className="px-3 card-body">
        <div className="row bg-light p-3 border rounded mb-4">
          <h2 className="mb-2 text-center">ชำระเงิน</h2>
          <hr className="my-4 border-secondary"/>
          <h3>ที่อยู่ที่ใช้ในการจัดส่ง</h3>
          <p>
            <strong>
              {address.f_name} {address.l_name} | โทร: 0{address.phone_number}
            </strong>
            <br />
            {address.houesNo} ตำบล {address.tambon_nameTH} อำเภอ {address.amphure_nameTH} จังหวัด {address.province_nameTH} {address.zip_code}
          </p>
        </div>
        <div className="row bg-light p-3 border rounded fw-bold">
          <div className="col-12 col-md-6 d-none d-md-block text-secondary">รายการสินค้าที่สั่งซื้อ</div>
          <div className="col-4 col-md-2 text-center d-none d-md-block text-secondary">ราคาต่อชุด</div>
          <div className="col-4 col-md-2 text-center d-none d-md-block text-secondary">จำนวน</div>
          <div className="col-4 col-md-2 text-center d-none d-md-block text-secondary">ราคารวม</div>
        </div>
        {productCart.length > 0 ? (
          productCart.map((item) => (
            <div className="row align-items-center p-3 border-bottom rounded bg-white" key={item.cart_product_id}>
              <div className="col-12 col-md-6 d-flex align-items-center">
                <img
                  src={`${API_URL_PICTURE}/${item.productpic_name}`}
                  alt={item.product_name}
                  className="img-fluid rounded"
                  style={{ width: '120px', height: '80px' }}
                />
                <span className="ms-3">{item.product_name}</span>
              </div>
              <div className="col-4 col-md-2 text-center">
                <span className="text-secondary d-block d-md-none">ราคาต่อชุด</span>
                <div>{numberGrouping(item.selling_price_per_quantity)} ฿</div>
              </div>
              <div className="col-4 col-md-2 text-center">
                <span className="text-secondary d-block d-md-none">จำนวน</span>
                <div>{item.quantity}</div>
              </div>
              <div className="col-4 col-md-2 text-center">
                <span className="text-secondary d-block d-md-none">ราคารวม</span>
                <div>{numberGrouping(item.selling_price_per_quantity * item.quantity)} ฿</div>
              </div>
            </div>
          ))
        ) : (
          <p className="row bg-white p-3 justify-content-center align-items-center">ไม่มีสินค้าในตะกร้า</p>
        )}
        <div className="row bg-light p-3 border rounded text-end fw-bold">
          <h4>ยอดรวมทั้งหมด: {numberGrouping(totalPrice)} ฿</h4>
        </div>
        <div className="d-flex flex-row-reverse bd-highlight mt-4">
          <button type='submit' className="btn btn-success btn-lg">ชำระเงิน</button>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </form>
  );
};

export default orders;