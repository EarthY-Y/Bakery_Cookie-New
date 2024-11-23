import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProductService } from '../../../API/customer/productService';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE
const Home = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await listProductService()
        console.log(res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getProducts();
  }, []);
  return(
    <div className="container">
      <div id="productCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-inner">
          {products.map((product) => (
             <div key={product.product_id} className={`carousel-item ${products[0].product_id === product.product_id ? "active" : ""}`}>
              <img src={API_URL_PICTURE + product.productpic_name} className="d-block w-100"alt={product.product_name} style={{ height: "400px", objectFit: "cover" }}/>
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
    <div className="row g-4 justify-content-center">
      {products.map((product) => (
        <div key={product.product_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center" style={{ cursor: "pointer" }}>
            <Link to={`/product/${product.product_id}`} className="card shadow-sm" 
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
    </div>
  );
};

export default Home;
