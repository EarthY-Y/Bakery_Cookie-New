import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import liff from '@line/liff'
import { listProductService } from '../../../API/guest/guestProductService';
import LoadingPopup from '../../untils/popUp/loading';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PRODUCT

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const handleLoginLine = async() =>{
  //   await liff.init({liffId: '2006630207-4ENd2JnL', }) // Use own liffId
  //   if(!liff.isLoggedIn()){
  //     liff.login() //ทำการ login ผ่าน Line
  //     return false
  //   }
  //   const profile = await liff.getProfile()
  //   console.log(profile);
      
  // }

  // useEffect(() => {
  //   handleLoginLine()
  // }, []);


  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const res = await listProductService()
        console.log(res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }finally{
        setIsLoading(false)
      }
    };

    getProducts();
  }, []);
  return(
    <div className="container">
      <div id="productCarousel" className="carousel slide mb-5" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-inner w-100 overflow-hidden" style={{ height: "50vh" }}>
          {products.map((product, index) => (
            <div key={product.product_id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img src={API_URL_PICTURE + product.productpic_name} className="d-block w-100" alt={product.product_name} style={{ width: "100%", height: "100%", objectFit: "cover",}}/>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <h2 className="text-center my-4" style={{ fontWeight: "bold" }}>สินค้าทั้งหมด</h2>

      <div className="container">
        <div className="row g-4 justify-content-start card-container">
          {products.map((product) => (
            <div key={product.product_id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center" style={{ cursor: "pointer" }}>
              <Link to={`Cookie&New/${product.product_id}`} className="card shadow-sm" 
                style={{ textDecoration: "none",color: "inherit",width: "100%",maxWidth: "300px", // จำกัดความกว้างของ 
                  cardminHeight: "350px", // ล็อคความสูงของ card ให้เท่ากัน
                }}>
                <img src={API_URL_PICTURE + product.productpic_name} className="card-img-top" alt={product.product_name} style={{ height: "200px", objectFit: "cover" }}/>
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{product.product_name}</h5>
                  <p className="card-text">ราคา: {product.selling_price_per_quantity} บาท</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default Home;
