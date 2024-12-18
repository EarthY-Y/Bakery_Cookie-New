import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listProductCategoryService } from '../../../API/guest/guestProductService';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PRODUCT

const categoryProductList = () => {
  const [productsCategory, setProductsCategory] = useState([]);
  const {id} = useParams()
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await listProductCategoryService(id)
        console.log(res);
        setProductsCategory(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getProducts();
  }, []);
  return(
      <div className="container">
        <h2 className="text-center my-4" style={{ fontWeight: "bold" }}>{id}</h2>
        <div className="row g-4 justify-content-start card-container">
        {productsCategory.map((product) => (
          <div key={product.product_id} className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center" style={{ cursor: "pointer" }}>
              <Link to={`/Cookie&New/${product.product_id}`} className="card shadow-sm" 
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

  );
};

export default categoryProductList;
