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
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#productCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className='row'>
        {products.map((product) => ( //(product, index) ถ้าใช้เเบบนี้จะเกิด Each child in a list should have a unique 'key' prop"
          <div key={product.product_id} className="col-3 " style={{ cursor: "pointer" }}>
            <Link to={`/product/${product.product_id}`} className='card m-2' style={{ textDecoration: "none", color: "inherit" }}>
              <img src={API_URL_PICTURE + product.productpic_name} className="card-img-top" alt={product.product_name} style={{ height: "200px", objectFit: "cover" }} />
              <div className="">
                <h5 className="card-title mt-3 ms-3">{product.product_name}</h5>
                <p className="card-text mb-3 ms-3">ราคา: {product.selling_price_per_quantity} บาท</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
