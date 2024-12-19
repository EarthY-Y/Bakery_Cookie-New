import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { listProductService } from '../../../API/customer/productService';

const SearchShowList = ({ name, itemKeys }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  //useMemo เพื่อเก็บ instance ของ Fuse ช่วยลดการสร้างตัวแปรใหม่ทุกครั้งที่ component render หรือ data เปลี่ยนแปลง
  const fuse = useMemo(() => new Fuse(products, {
    keys: ["product_name"], //ได้เเค่ Array
    threshold: 0.2,
  }), [products]); //เเต่จะถูก reder เมื่อ data ถูกเปลี่ยนเเปลงจริงๆ

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          getListProduct,
        ] = await Promise.all([
          listProductService(),
        ])
        // console.log(getListProduct.data);
        setProducts(getListProduct.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = fuse.search(searchTerm).map((result) => result.item);
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  return (
    <div className="mb-3">
      <input className="form-control me-2 mt-0 d-none d-lg-block " style={{ width: "400px" }} type="search" placeholder={name} aria-label="Search" onChange={(e) => setSearchTerm(e.target.value)} />
      {/* <button onClick={handleSearch} className="btn btn-danger btn-outline-light" type="submit"><i className="bi bi-search"></i></button> */}
      {filteredProducts ? (
        <ul className="list-group position-absolute d-none d-md-block" style={{ zIndex: 1000, width: "400px" }}>
          {filteredProducts.map((item, index) => (
            <li key={index} className="list-group-item">
              <Link to={`/product/${item.product_id}`} onClick={location.reload} className='text-black' style={{ textDecoration: "none"}}>
                {item.product_name} {/* เปลี่ยนเป็นฟิลด์ที่ต้องการแสดง */}
              </Link>
            </li>
          ))}
        </ul>
      ) : (        
        <ul className="list-group position-absolute d-none d-md-block" style={{ zIndex: 1000, width: "400px" }}>
          <li className="text-black">ไม่พบข้อมูล</li>
        </ul>
        )}

      <input className="form-control me-2 mt-0 d-block d-lg-none " style={{ width: "300px" }} type="search" placeholder={name} aria-label="Search" onChange={(e) => setSearchTerm(e.target.value)} />
      {filteredProducts ? (
        <ul className="list-group position-absolute d-block d-md-none" style={{ zIndex: 1000, width: "70%" }}>
          {filteredProducts.map((item, index) => (
            <li key={index} className="list-group-item">
              <Link to={`/product/${item.product_id}`} onClick={location.reload} className='text-black' style={{ textDecoration: "none"}}>
                {item.product_name} {/* เปลี่ยนเป็นฟิลด์ที่ต้องการแสดง */}
              </Link>
            </li>
          ))}
        </ul>
      ) : (        
        <ul className="list-group position-absolute d-block d-md-none" style={{ zIndex: 1000, width: "70%" }}>
          <li className="text-black">ไม่พบข้อมูล</li>
        </ul>
        )}
    </div>
    
  );
};

export default SearchShowList;
