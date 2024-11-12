import React, { useEffect, useState } from 'react';
import { getPorductCartService, deletePorductCartService } from '../../../API/customer/productService';
import { formatDate } from '../../datetime';
import { Link } from 'react-router-dom';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE;

const CartProduct = () => {
  const [productCart, setProductCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);  // สถานะสำหรับเก็บราคาทั้งหมด
  const formatPrice = (price) => `฿${price.toLocaleString()}`;
  const isPaymentDisabled = totalPrice < 250;  // กำหนดเงื่อนไขการเปิด/ปิดปุ่ม
  
  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await getPorductCartService();
        if (!response.data) {
          throw new Error('ไม่มีข้อมูล');
        }
        console.log(response.data);
        setProductCart(response.data);
      } catch (error) {
        alert(error);
      }
    };
    getCart();
  }, []);

  // คำนวณราคาทั้งหมด
  useEffect(() => {
    const total = productCart.reduce((acc, item) => acc + item.selling_price_per_quantity * item.quantity, 0);
    setTotalPrice(total);
  }, [productCart]);

  const addAmount = (cart_product_id) => {
    const updatedCart = productCart.map((item) => {
      if (item.cart_product_id === cart_product_id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setProductCart(updatedCart);
  };

  const inputAmount = (value, cart_product_id) => {
    const updatedCart = productCart.map((item) => {
      if (item.cart_product_id === cart_product_id && item.quantity > 1) {
        return { ...item, quantity: value };
      }
      return item;
    });
    setProductCart(updatedCart);
  };

  const minusAmount = (cart_product_id) => {
    const updatedCart = productCart.map((item) => {
      if (item.cart_product_id === cart_product_id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setProductCart(updatedCart);
  };

  const handleDeleteProductCart = (id) => {
    deletePorductCartService(id)
      .then(() => {
        setProductCart(prevProductCart => prevProductCart.filter(productCart => productCart.cart_product_id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">ตะกร้าสินค้าของคุณ</h3>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th><input type="checkbox" /></th>
            <th>สินค้า</th>
            <th>ราคาต่อชุด</th>
            <th>จำนวน</th>
            <th>ราคารวม</th>
            <th>แอคชัน</th>
          </tr>
        </thead>
        <tbody>
          {productCart.length > 0 ? (
            productCart.map((item) => (
              <tr key={item.cart_product_id}>
                <td><input type="checkbox" /></td>
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
                <td>{formatPrice(item.selling_price_per_quantity)}</td>
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
                <td>{formatPrice(item.selling_price_per_quantity * item.quantity)}</td>
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
          <strong>ราคารวม: {formatPrice(totalPrice)}</strong>
        </div>
        <div>
          <Link className="btn btn-success text-light" disabled={isPaymentDisabled}>
            ชำระเงิน
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
