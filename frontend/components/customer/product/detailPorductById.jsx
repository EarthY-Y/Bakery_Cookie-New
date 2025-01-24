import React, { useEffect, useState} from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { detailProductByIdService, createCartService, getCartService } from '../../../API/customer/productService';
import { useCart } from '../layOut/navbar/CartContext';
import LoadingPopup from '../../untils/popUp/loading';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PRODUCT

const detailPorductById = () => {
  const {id} = useParams();
  const { addToCart } = useCart();
  const [productById, setproductMyId] = useState([])
  const [CartId, setCartId] = useState()
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // ฟังก์ชันลดปริมาณสินค้า
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  
  useEffect(() => {
    const fetchData = async()=> {
      try {
        setIsLoading(true);
        const [
          response,
          getDetailProductById
        ] = await Promise.all([
          getCartService(),
          detailProductByIdService(id)
        ]) 
        if(!response.data || !getDetailProductById.data){
          throw new Error("ไม่มีข้อมูล")
        }
        setCartId(response.data[0])
        setproductMyId(getDetailProductById.data[0])
      }
      catch (error) {
        console.log(error)
      }finally{
        setIsLoading(false);
      }
    }
    fetchData()
  },[])

  const handleSubmitProductMaterial = async (event) => {
    event.preventDefault();
    addToCart(productById, quantity);
    try {
      setIsLoading(true);
        const res = await createCartService(id, CartId.cartId, productById.selling_price_per_quantity, quantity);
        console.log(res);
        // navigate('/product');
    } catch (error) {
        console.log(error); // แสดงข้อผิดพลาด
    }finally{
      setIsLoading(false);
    }
};

  return (    
    <div className="container my-5">
      {/* กรอบพื้นหลังคลุมทั้งหมด */}
      <div className="bg-light p-4 rounded shadow">
        {/* แถวข้อมูลสินค้า */}
        <div className="row g-4">

          {/* กรอบพื้นหลังรูปสินค้า */}
          <div className="col-md-6">
            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
              {productById.productpic_name ? (
                <img src={API_URL_PICTURE + productById.productpic_name} alt={productById.product_name} className="img-fluid rounded shadow-sm"
                  style={{ width: '100%',maxWidth: '700px',height: 'auto',objectFit: 'cover',}}/>
              ) : (
                <div className="bg-light border rounded p-5 d-flex align-items-center justify-content-center text-secondary">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* ข้อมูลสินค้า */}
          <div className="col-md-6 text-center">
            <h1 className="fw-bold">{productById.product_name}</h1>
            <h3 className="text-danger fw-bold">
              {`฿${productById.selling_price_per_quantity}`}
              <button onClick={handleDecreaseQuantity} className="btn ms-3">
                <h2 className="bi bi-patch-minus-fill"></h2>
              </button>
              <input type="number"className="form-control d-inline text-center" style={{  width: '70px',fontSize: '20px',fontWeight: 'bold',borderRadius: '5px',display: 'inline-block',}}
                value={quantity}
                onChange={(e) => {
                  const newValue = Math.max(Number(e.target.value), 1);
                  setQuantity(newValue);
                }}
              />
              <button onClick={handleIncreaseQuantity} className="btn">
                <h2 className="bi bi-patch-plus-fill"></h2>
              </button>
            </h3>

            {/* ปุ่มเพิ่มสินค้า */}
            <div className="gap-3 mt-3 text-center" style={{ flexWrap: 'nowrap' }}>
              <button onClick={(e) => handleSubmitProductMaterial(e)} className="btn btn-success" style={{ padding: '10px 20px', width: '160px', whiteSpace: 'nowrap' }} >
                เพิ่มไปยังตะกร้า
              </button>
            </div>
          </div>
        </div>
        
        {/* รายละเอียดสินค้า */}
        <div className="row mt-5">
          <div className="col-12 p-4 rounded shadow-sm" style={{ backgroundColor: '#EEEEEE', color: '#000',}}>
            <h2 className="fw-bold mb-4">รายละเอียดสินค้า</h2>

                {/* เส้นคั่นระหว่างข้อมูลสินค้าและรายละเอียด */}
                <hr className="my-4" />
            <h5 className="text-muted">{productById.description}</h5>
          </div>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default detailPorductById;