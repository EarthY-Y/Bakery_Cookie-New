import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../datetime';
import { Table, Button } from 'react-bootstrap';
import { listProductService, deleteProductByIdService } from '../../../API/admin/productService';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const listProduct = () => {
  const [products, setProducts] = useState([]);
  
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
        <Link to="/product/create" className="btn btn-outline-warning text-black">
         เพิ่มสินค้า
        </Link>
      </div>

      <p>จำนวน {products.length} รายการ</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center align-middle" style={{width: '20%' }}>รูปภาพ</th>
            <th className="text-center align-middle" style={{width: '30%' }}>ชื่อสินค้า</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ต้นทุน</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ราคาขาย/ชิ้น</th>
            <th className="text-center align-middle" style={{width: '10%' }}>จำนวนที่ทำ/ครั้ง</th>
            <th className="text-center align-middle" style={{width: '5%' }}>ดู</th>
            <th className="text-center align-middle" style={{width: '5%' }}>แก้ไข</th>
            <th className="text-center align-middle" style={{width: '5%' }}>ลบ</th>
          </tr>
        </thead>
      
        <tbody>
          
           {products.map((products, index) => (
              <tr key={index}>
                <td><img src={API_URL_PICTURE + products.productpic_name} height={75} width={120} className='text-center'/></td>
                <td>{products.product_name}</td>
                <td>{products.cost}</td>
                <td>{products.selling_price_per_quantity}</td>
                <td>{products.quantity_per_time}</td>
                {/* <td>{formatDate(products.create_at)}</td> */}
                <td><Link to={`view/${products.product_id}`} className="btn btn-outline-warning text-black">View</Link></td>
                <td><Link to={`edit/${products.product_id}`} className="btn btn-outline-warning text-black">Edit</Link></td>
                <td><button onClick={() => handleDelete(products.product_id)} className="btn btn-outline-warning btn-danger text-black">Delete</button></td>
            </tr>
          ) )}
        </tbody>
      </Table>
    </div>

  );
};

export default listProduct;