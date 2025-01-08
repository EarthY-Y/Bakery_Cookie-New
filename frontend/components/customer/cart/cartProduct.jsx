import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { getPorductCartService,deletePorductCartService, upadateCartService } from '../../../API/customer/productService';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
import LoadingPopup from '../../untils/popUp/loading';
import ErrorPopup from '../../untils/popUp/errorPopup';
import AlertPopUp from '../../untils/popUp/alertPopUp';
import ConfirmPopUpModal from '../../untils/popUp/confirmPopUp';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const cartProduct = () => {
  const {id} = useParams();
  const navigate = useNavigate()
  const [productCart, setProductCart] = useState([])
  const [totalPrice, setTotalPrice] = useState(0); 
  const isPaymentDisabled = totalPrice < 250;  // กำหนดเงื่อนไขการเปิด/ปิดปุ่ม
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const getCart = async()=> {
      try {
        setIsLoading(true);
        const response = await getPorductCartService()
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setProductCart(response.data)
      }
      catch (error) {
        setError(error)
      }finally{
        setIsLoading(false)
      }
    }
    getCart()
  },[])

  const inputAmount = (value, cart_product_id) => {
    const updatedCart = productCart.map((item) => {
      if (item.cart_product_id === cart_product_id) {
        const newValue = Math.max(Number(value), 1); // ตรวจสอบให้ค่าต่ำสุดคือ 1 ใช้ parseInt(value) ก้็ได้เพื่อเเปลงค่าให้มี dataType เดียวกัน
        handleUpdateCartProduct(cart_product_id, "input" , newValue)
        return { ...item, quantity: newValue };
      }
      return item;
    });
    setProductCart(updatedCart);
  };

  const handleUpdateCartProduct = async (cart_product_id, status, value) => {
    try {
      const response = await upadateCartService(cart_product_id, status, value);
      if (!response.data) throw new Error('ไม่มีข้อมูล');
    } catch (error) {
      setError(error);
    }
  };

  const handleQuantityChange = (cart_product_id, change) => {
    setProductCart((prevCart) =>
      prevCart.map((item) =>
        item.cart_product_id === cart_product_id
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
    handleUpdateCartProduct(cart_product_id, change > 0 ? 'add' : 'minus', 1);
  };

  const handleDeleteProductCart = (id) => {
    deletePorductCartService(id)
      .then(() => {
        setProductCart((prev) => prev.filter((item) => item.cart_product_id !== id));
      })
      .catch(err => console.log(err))
  }

  // คำนวณราคาทั้งหมด
  useEffect(() => {
    const total = productCart.reduce((acc, item) => acc + item.selling_price_per_quantity * item.quantity, 0);
    setTotalPrice(total);
  }, [productCart]);

  const handleConfirm = async() => {
    try {
      navigate('/orders/'+id)
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const handleConditionNotification = async() => {
    try {
      setShowCancelModal(true)
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <div className="container my-5">
      <div className="px-3 card-body">
        <div className="row bg-light pb-3 pt-3 border rounded mb-0 fw-bold">
          <h2 className="mb-2 text-center">ตะกร้าสินค้าของคุณ</h2>
          <hr className="d-none d-md-block my-4 border-secondary"/>
          <div className="col-12 col-md-8 d-none d-md-block text-secondary">สินค้า</div>
          <div className="col-4 col-md-1 text-center d-none d-md-block text-secondary">ราคาต่อชิ้น</div>
          <div className="col-4 col-md-1 text-center d-none d-md-block text-secondary">จำนวน</div>
          <div className="col-4 col-md-1 text-center d-none d-md-block text-secondary">ราคารวม</div>
          <div className="col-4 col-md-1 text-center d-none d-md-block text-secondary">ลบสินค้า</div>
        </div>
        <div className="cart-table">
          {productCart.length > 0 ? (
            productCart.map((item) => (
              <div className="row align-items-center pb-3 pt-3 border-bottom rounded bg-white" key={item.cart_product_id}>
                <div className="col-12 col-md-8 d-flex align-items-center">
                  <img
                    src={`${API_URL_PICTURE}/${item.productpic_name}`}
                    alt={item.product_name}
                    className="img-fluid rounded"
                    style={{ width: '120px', height: '80px' }}
                  />
                  <span className="ms-3">{item.product_name}</span>
                </div>
                <div className="col-4 col-md-1 text-center text-sm">
                  <span className="text-secondary d-block d-md-none">ราคาต่อชิ้น</span>
                  <strong>{numberGrouping(item.selling_price_per_quantity)} ฿</strong>
                </div>
                <div className="input-group-sm col-3 col-md-1 text-center cart-item-quantity d-flex align-items-center justify-content-center">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item.cart_product_id, -1)}>-</button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={item.quantity}
                    style={{ width: '60px' }}
                    onChange={(e) => inputAmount(e.target.value, item.cart_product_id)}
                  />
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item.cart_product_id, 1)}>+</button>
                </div>
                <div className="col-3 col-md-1 text-center">
                  <span className="text-secondary d-block d-md-none">ราคารวม</span>
                  <strong>{numberGrouping(item.selling_price_per_quantity * item.quantity)} ฿</strong>
                </div>
                <div className="col-1 col-md-1 text-center">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProductCart(item.cart_product_id)}><i className="bi bi-trash"></i></button>
                </div>
              </div>
            ))
          ) : (
            <p className="row bg-white p-3 justify-content-center align-items-center">ไม่มีสินค้าในตะกร้า</p>
          )}
        </div>
        <div className="row bg-light p-3 border rounded text-end">
          <h4>ราคารวม: {numberGrouping(totalPrice)} ฿</h4>
          <span className='text-danger'>ราคานี้ไม่รวมค่าจัดส่งเเละค่าบรรจุภัณฑ์</span>
        </div>
        <div className="d-flex flex-row-reverse bd-highlight mt-4">
          <button className="btn btn-success btn-lg" disabled={isPaymentDisabled} type='button' onClick={handleConditionNotification}>สั่งซื้อ</button>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      {!isLoading && error && (
        <ErrorPopup message={error} onClose={() => setError(null)} />
      )}
      {!isLoading && isPaymentDisabled ? (
        <AlertPopUp message={"กรุณาสั่งซื้อขั้นต่ำ 250 บาท"} title="ยอดคำสั่งซื้อไม่ถึงที่กำหนด" onClose={() => setError(null)} />
      ): ("")}

      <ConfirmPopUpModal
        showModal={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleConfirm={handleConfirm}
        title={'เงื่อนไขการสั่งซื้อ'}
        text={<>
            <p>1) ราคาที่เห็นยังไม่รวมค่าขนส่งเเบบ EMS เเละกล่องพัสดุ</p>
            <p>2) กรุณาตรวจสอบรายการสินค้าให้ถูกต้องก่อนสั่งซื้อ</p>
            <p>3) ทางร้านจะไม่คืนเงินทุกกรณีหากคำสั่งซื้ออยู่ในรหว่างการผลิต</p>
          </>
        }
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default cartProduct;