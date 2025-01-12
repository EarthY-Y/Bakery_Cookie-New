import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../untils/frommatters/datetime';
import { Table, Button } from 'react-bootstrap';
import { listProductService, deleteProductByIdService } from '../../../API/admin/productService';
import Search from '../../untils/fucntion/search';

const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const listProduct = () => {
  const [products, setProducts] = useState([]);
  const [productsSearch, setProductsSearch] = useState([]);
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await listProductService()
        console.log(res.data);
        
        setProducts(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getPosts();
  }, []);

  const handleSearch = (results) => {
    setProductsSearch(results);
  };

  const handleDelete = (id) => {
    deleteProductByIdService(id)
      .then(() => {
        // ลบ item ที่มี id ตรงกันออกจาก materials โดยใช้ filter
        setProducts(prevProduct => prevProduct.filter(product => product.product_id !== id))
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>สินค้าหน้าร้าน</h2>
        <Link to="/product/create" className="btn btn-success d-none d-md-inline-block"><i className="bi bi-plus-circle-fill"></i> เพิ่มสินค้า </Link>
        <Link to="/product/create" className="btn btn-success btn-sm d-md-none"><i className="bi bi-plus-circle-fill"></i> เพิ่มสินค้า </Link>
      </div>
      < Search
        data={products}
        handleSearch={handleSearch}
        name="ชื่อสินค้า"
        itemKeys={["product_name"]}//ถ้าอยากส่งไปเเบบ array
      />
      <p>จำนวน {productsSearch.length} รายการ</p>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{width: '10%' }}>รูปภาพ</th>
              <th style={{width: '20%' }}>ชื่อสินค้า</th>
              <th style={{width: '10%' }}>ต้นทุน</th>
              <th style={{width: '10%' }}>ราคาขาย/ชิ้น</th>
              <th style={{width: '10%' }}>จำนวนที่ทำ/ครั้ง</th>
              <th style={{width: '10%' }}>สถานะสินค้า</th>
              <th style={{width: '5%' }}>ดู</th>
              <th style={{width: '5%' }}>แก้ไข</th>
            </tr>
          </thead>
        
          <tbody>
            {productsSearch.map((products, index) => (
              <tr key={index}>
                <td className='text-center'><img src={API_URL_PICTURE + products.productpic_name} className="img-fluid rounded text-center" style={{ maxHeight: '75px', maxWidth: '120px' }}/></td>
                <td>{products.product_name}</td>
                <td className='text-center'>{products.cost.toFixed(3)} บาท</td>
                <td className='text-center'>{products.selling_price_per_quantity} บาท</td>
                <td className='text-center'>{products.quantity_per_time} ชิ้น</td>
                {/* <td>{formatDate(products.created_at)}</td> */}
                {products.is_active === 1 ? <td className="text-center text-success">วางขาย</td> : <td className="text-center text-danger">เลิกขาย</td>}
                <td><Link to={`view/${products.product_id}`} className="btn btn-info text-light d-grid mx-auto"><i className="bi bi-eye"></i></Link></td>
                <td><Link to={`edit/${products.product_id}`} className="btn btn-warning d-grid mx-auto"><i className="bi bi-pencil"></i></Link></td>
              </tr>
            ) )}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-4">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {products.map((products, index) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={index}>
                <div className="d-flex">
                  <img src={API_URL_PICTURE + products.productpic_name} className="img-fluid rounded text-center" style={{ maxHeight: '75px', maxWidth: '120px' }}/>
                  <div className="ms-3 d-flex flex-column justify-content-between w-100">
                    <h6 className="mb-3">{products.product_name}</h6>
                    <div>
                      <Link to={`view/${products.product_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
                    </div>
                  </div>
                </div>
                <div className="small text-secondary mt-3">
                  <p className="mb-1">ต้นทุน: {products.cost.toFixed(3)} บาท</p>
                  <p className="mb-1">ราคาขาย/ชิ้น: {products.selling_price_per_quantity} บาท</p>
                  <p className="mb-1">จำนวนที่ทำ/ครั้ง: {products.quantity_per_time} ชิ้น</p>
                  {products.is_active === 1 ? <p className="mb-1 text-success">วางขาย</p> : <p className="mb-1 text-danger">เลิกขาย</p>}
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button onClick={() => handleDelete(products.product_id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> ลบ </button>
                  <Link to={`edit/${products.product_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default listProduct;