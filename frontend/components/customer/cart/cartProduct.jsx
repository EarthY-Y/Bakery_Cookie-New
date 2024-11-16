import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { getPorductCartService,deletePorductCartService, upadateCartService } from '../../../API/customer/productService';
import { formatDate } from '../../untils/frommatters/datetime';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const cartProduct = () => {
  const {id} = useParams();
  const [productCart, setProductCart] = useState([])
  const [totalPrice, setTotalPrice] = useState(0); 
  const isPaymentDisabled = totalPrice < 250;  // กำหนดเงื่อนไขการเปิด/ปิดปุ่ม

  useEffect(() => {
    const getCart = async()=> {
      try {
        const response = await getPorductCartService()
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
        console.log(response.data);
        setProductCart(response.data)
      }
      catch (error) {
        alert(error)
      }
    }
    getCart()
  },[])

  const addAmount = (cart_product_id) => {
    const updatedCart = productCart.map((item) => {
      if (item.cart_product_id === cart_product_id) {
        handleUpdateCartProduct(cart_product_id, "add", 1)
        return { ...item, quantity: item.quantity + 1 }; // เพิ่มจำนวนสินค้า
      }
      return item; // ไม่เปลี่ยนแปลงสินค้าชิ้นอื่น
    });
    setProductCart(updatedCart);
  };
  
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

  const minusAmount = (cart_product_id) => {
    const updatedCart = productCart.map((item) => {
      if (item.cart_product_id === cart_product_id && item.quantity > 1) {
        handleUpdateCartProduct(cart_product_id, "minus", 1)
        return { ...item, quantity: item.quantity - 1 }; // ลดจำนวนสินค้า
      }
      return item; // ไม่เปลี่ยนแปลงสินค้าชิ้นอื่น
    });
    setProductCart(updatedCart);
  };

  const handleDeleteProductCart = (id) => {
    deletePorductCartService(id)
      .then(() => {
        // ลบ item ที่มี id ตรงกันออกจาก materials โดยใช้ filter
        setProductCart(prevProductCart => prevProductCart.filter(productCart => productCart.cart_product_id !== id))
      })
      .catch(err => console.log(err))
  }

  // คำนวณราคาทั้งหมด
  useEffect(() => {
    const total = productCart.reduce((acc, item) => acc + item.selling_price_per_quantity * item.quantity, 0);
    setTotalPrice(total);
  }, [productCart]);

  const handleUpdateCartProduct = async(cart_product_id, status, value) => {
      try {
        console.log("handleUpdateCartProduct",cart_product_id, status);
        
        const response = await upadateCartService(cart_product_id, status, value)
        if(!response.data){
          throw new Error("ไม่มีข้อมูล")
        }
      }
      catch (error) {
        alert(error)
      }
  }

  return (    
    <div className="container my-5">
      <h3 className="mb-4">ตะกร้าสินค้าของคุณ</h3>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>สินค้า</th>
            <th>ราคาต่อชุด</th>
            <th>จำนวน</th>
            <th>ราคารวม</th>
            <th>ลบสินค้า</th>
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
                    <button className="btn btn-outline-secondary" onClick={() => minusAmount(item.cart_product_id)}>-</button>
                    <input
                      type="number"
                      className="form-control d-inline text-center"
                      style={{
                        width: '70px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        borderRadius: '5px',
                        display: 'inline-block',
                      }}
                      value={item.quantity}
                      onChange={(e) => inputAmount(e.target.value, item.cart_product_id)}
                    />
                    <button className="btn btn-outline-secondary" onClick={() => addAmount(item.cart_product_id)}>+</button>
                  </div>
                </td>
                <td>{numberGrouping(item.selling_price_per_quantity * item.quantity)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDeleteProductCart(item.cart_product_id)}>ลบ</button>
                </td>
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
      <div className="d-flex justify-content-between">
        <div>
          <strong>ราคารวม: {numberGrouping(totalPrice)}</strong>
        </div>
        <div>
          <button className="btn btn-success " disabled={isPaymentDisabled}>
            <Link className="text-light" to={`/orders/`+id}>สั่งซื้อ</Link> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default cartProduct;