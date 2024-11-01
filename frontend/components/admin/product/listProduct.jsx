import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../datetime';
import { Table, Button } from 'react-bootstrap';
import { listProductService } from '../../../API/productService';

const listProduct = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await listProductService()
        console.log(res.data);
        
        setPosts(res.data);
      } catch (err) {
        console.error("Error data:", err);
      }
    };

    getPosts();
  }, []);
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>สินค้าหน้าร้าน</h2>
        <Link to="/product/create" className="btn btn-outline-warning text-black">
         เพิ่มสินค้า
        </Link>
      </div>

      <p>จำนวน {posts.length} รายการ</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center align-middle" style={{width: '20%' }}>รูปภาพ</th>
            <th className="text-center align-middle" style={{width: '30%' }}>ชื่อสินค้า</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ต้นทุน</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ราคาขาย</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ติดจอง</th>
            <th className="text-center align-middle" style={{width: '10%' }}>แก้ไข</th>
            <th className="text-center align-middle" style={{width: '10%' }}>ลบ</th>
          </tr>
        </thead>
      
        <tbody>
          
           {posts.map((posts, index) => (
              <tr key={index}>
                <td><img src={"http://localhost:5000/picture/" + posts.productpic_name} height={75} width={120} className='text-center'/></td>
                <td>{posts.product_name}</td>
                <td>{posts.quantity}</td>
                <td>{posts.cost}</td>
                <td>{formatDate(posts.create_at)}</td>
            </tr>
          ) )}
        </tbody>
      </Table>
    </div>

  );
};

export default listProduct;