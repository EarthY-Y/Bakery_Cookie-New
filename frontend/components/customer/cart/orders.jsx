import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAddressCustomer, getAddressCustomer, createOrder, shippingRate } from '../../../API/customer/paymentService';
import { getPorductCartService} from '../../../API/customer/productService';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
import LoadingPopup from '../../untils/popUp/loading';
import SelectBox from '../../untils/popUp/selectBox'

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const orders = () => {
  const {id} = useParams();
  const [address, setAddress] = useState([])
  const [selectAddress, setSelectAddress] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [productCart, setProductCart] = useState([])
  const [totalPriceProduct, setTotalPriceProduct] = useState(0); ; 
  const [totalPrice, setTotalPrice] = useState(0); 
  const [totalQuantity, setTotalQuantity] = useState(0); 
  const [totalWeight, setTotalWeigth] = useState(0); 
  const [deliveryRate,  setdeliveryRate] = useState(0); 
  const [toatalShippingRate,  setToatalShippingRate] = useState(0); 
  const [showSelectModal, setShowSelectModal] = useState(false);
  const navigate = useNavigate()
  
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
        if(addressCustomer.data.length !== 0 ){
          console.log(addressCustomer.data);
          setAddress(addressCustomer.data)
        }else{
          setIsLoading(false);
          navigate('/create/address')
        }
        if(porductCart){
          console.log(porductCart.data);
          setProductCart(porductCart.data)
        }else{
          setIsLoading(false)
          navigate('/home')
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message);
      }finally{
        setIsLoading(false)
      }
    };
    fetchData();

  }, []);  

  useEffect(() => {
    const totalPriceProduct = productCart.reduce((acc, item) => acc + item.selling_price_per_quantity * item.quantity, 0);
    setTotalPriceProduct(totalPriceProduct);

    const total = productCart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(total);
    
    const weight = productCart.reduce((acc, item) => acc + (item.weight_per_piece * item.quantity), 0)
    console.log(weight);
    setTotalWeigth(weight)
    
  }, [productCart]);

  useEffect(() => {
    const getshippingRate = async() => {
      try {
        const response = await shippingRate(totalWeight)
        console.log(response);
        setdeliveryRate(response.data[0] || 0) //ถ้าไม่มีไรส่งมีให้เป็น 0 เพราะถ้าปิดใช้งาน shipping_rate ตัวนั้น
        
      } catch (error) {
        console.error("Error ShippingRate data:", error);
      }finally {
        setIsLoading(false);
      }
    } 
    if (totalWeight > 0){
      getshippingRate()
    }
    
  },[totalWeight])

  useEffect(() => {
    const totalRate = parseFloat(deliveryRate.price || 0) + parseFloat(deliveryRate.cost_per_quantity || 0)
    setToatalShippingRate(totalRate.toFixed(0))
  },[deliveryRate])

  // คำนวณราคาสินค้า
  // 
  useEffect(() => {
    const total = parseFloat(totalPriceProduct) + parseFloat(toatalShippingRate || 0)
    setTotalPrice(parseInt(total.toFixed(0)));
  }, [toatalShippingRate, totalPriceProduct]); //totalPriceProduct เพราะถ้าไม่ใช่ค่า totalPrice จะไม่อัปตอนไม่มีค่า shipping rate

  const handleSubmmit = async(event) => {
    event.preventDefault();
    setIsLoading(true);
    let selectedAddress;
    if (address.length === 1) {
      selectedAddress = address[0];
    } else if (!isNaN(selectAddress)) {
      alert("กรุณาเลือกที่อยู่ก่อนทำการสั่งซื้อ");
      return;
    } else {
      selectedAddress = selectAddress;
    }
    try {
      console.log( address[0]?.phone_number, productCart, parseFloat(totalPrice), totalPriceProduct , deliveryRate.price || 0, deliveryRate.cost_per_quantity || 0, totalQuantity, deliveryRate.shipping_rate_id, selectedAddress.houseNo,selectedAddress.tambon_nameTH,selectedAddress.amphure_nameTH,selectedAddress.province_nameTH,selectedAddress.zip_code);
      const response = await createOrder(
        address[0]?.phone_number,
        productCart,
        parseFloat(totalPrice) || 0,
        totalPriceProduct || 0,
        deliveryRate.price || 0,
        deliveryRate.cost_per_quantity || 0,
        totalQuantity,
        deliveryRate.shipping_rate_id,
        selectedAddress.houseNo,
        selectedAddress.tambon_nameTH,
        selectedAddress.amphure_nameTH,
        selectedAddress.province_nameTH,
        selectedAddress.zip_code
      );
      if(response.data){
        setIsLoading(false);
        navigate("/payment/"+id)
      }else {
        throw new Error("เกิดข้อผิดพลาดบ้างอย่าง")
      }
      
    } catch (error) {
      console.log(error);
      alert(error)
    }finally{
      setIsLoading(false);
    }
  }

  const handleSelect = async(selectedAddress) => {
    setSelectAddress(selectedAddress)
  }

  return (
    <form className="container my-5" onSubmit={handleSubmmit}>
      <div className="px-3 card-body">
        <div className="row bg-light p-3 border rounded mb-4">
          <h2 className="mb-2 text-center">ชำระเงิน</h2>
          <hr className="my-4 border-secondary"/>
          <h3>ที่อยู่ที่ใช้ในการจัดส่ง</h3>
          {address.length > 1 ? (
            <div>
              {isNaN(selectAddress) ? (
                <p>
                  <strong>
                    {selectAddress.f_name} {selectAddress.l_name} | โทร: 0{selectAddress.phone_number}
                  </strong>
                  <br />
                  {selectAddress.houseNo} ตำบล {selectAddress.tambon_nameTH} อำเภอ {selectAddress.amphure_nameTH} จังหวัด {selectAddress.province_nameTH} {selectAddress.zip_code}
                </p>
              ): (
                <p>กรุณาเลือกที่อยู่</p>
              )}
              <button type='button' className="btn btn-primary" onClick={() => setShowSelectModal(true)}>เลือกที่อยู่</button>
            </div>
          ) : (
            <p>
              <strong>
                {address[0]?.f_name} {address[0]?.l_name} | โทร: 0{address[0]?.phone_number}
              </strong>
              <br />
              {address[0]?.houseNo} ตำบล {address[0]?.tambon_nameTH} อำเภอ {address[0]?.amphure_nameTH} จังหวัด {address[0]?.province_nameTH} {address[0]?.zip_code}
            </p>
          )}
        </div>
        <div className="row bg-light pb-3 pt-3 border rounded fw-bold">
          <div className="col-12 col-md-6 d-none d-md-block text-secondary">รายการสินค้าที่สั่งซื้อ</div>
          <div className="col-4 col-md-2 text-center d-none d-md-block text-secondary">ราคาต่อชุด</div>
          <div className="col-4 col-md-2 text-center d-none d-md-block text-secondary">จำนวน</div>
          <div className="col-4 col-md-2 text-center d-none d-md-block text-secondary">ราคารวม</div>
        </div>
        {productCart.length > 0 ? (
          productCart.map((item) => (
            <div className="row align-items-center pb-3 pt-3 border-bottom rounded bg-white" key={item.cart_product_id}>
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
          <h4>ยอดรวมทั้งหมด: {numberGrouping(totalPriceProduct)} ฿</h4>
          <h4>ค่าจัดส่ง: {toatalShippingRate || 0} ฿</h4>
          <h4>ยอดชำระทั้งหมด: {numberGrouping(totalPrice) || 0} ฿</h4>
        </div>
        <div className="d-flex flex-row-reverse bd-highlight mt-4">
          <button type='submit' className="btn btn-primary btn-lg">ไปหน้าชำระเงิน</button>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      <SelectBox
        showModal={showSelectModal}
        handleClose={() => setShowSelectModal(false)}
        data={address}
        handleSelect={handleSelect} //handleCancelOrder เก็บข้อมูล input ไว้อยู่
      />
      {showSelectModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </form>
  );
};

export default orders;