import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createCategoryService, getListProductPictureService } from '../../../../API/admin/categoryService';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../untils/frommatters/datetime';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const createCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const selectedProductsMap = selectedProducts.map(productId => {
        // หาข้อมูลของสินค้าโดยใช้ productId
        const product = listProduct.find(item => item.product_id === productId);
        return {
          product_id: product.product_id,
          // product_name: product.product_name
        }
      })
      console.log(categoryName,selectedProductsMap);      
      const res = await createCategoryService(categoryName,selectedProductsMap);
      navigate(-1);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getlistProduct = async() => {
      try {
        const response = await getListProductPictureService()
        console.log(response.data);
        setListProduct(response.data)
      } catch (error) {
        
      }
    }
    getlistProduct()
  },[])
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 bg-light card-body">
        <h4>เพิ่มสถานะ</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-4 justify-content-center">
            <label className="col-sm-2 col-form-label">ชื่อประเภทสินค้า</label>
            <div className="row col-sm-4">
              <input type="text" className="form-control" required placeholder="เช่น เค้ก, คุกกี้" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
              <thead>
                <tr className="table-success">
                  <th className="text-center align-middle" style={{ width: '25%' }} >เลือก</th>
                  <th className="text-center align-middle" style={{ width: '25%' }} >รูปสินค้า</th>
                  <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อสินค้า</th>
                </tr>
              </thead>
              <tbody>
                {listProduct.map((product) => (
                  <tr key={product.product_id}>
                    <td className="text-center align-middle">
                      <input type="checkbox" value={product.product_id} className='form-check-large' style={{width:'20px', height:'20px'}}
                        onChange={(e) => {
                          const productId = e.target.value; //เก็บค่าที่มีการเปลี่ยนเเปลง
                          setSelectedProducts(prev => //setSelect 
                              prev.includes(productId) //ตรวจสอบค่าที่อยู่ใน Array productId ปัจจุบันด้วยการใช้ prev
                                  ? prev.filter(id => id !== productId) //ถ้าถ้าเคยมีเเล้วเพิ่มเข้ามาให้จะลบออก เป็นเหมือนการทำงานของ checkbox
                                  : [...prev, productId]
                          );
                        }}
                      /></td>
                    <td><img src={API_URL_PICTURE + product.productpic_name } className="img-fluid rounded" alt={product.product_name} style={{ maxHeight: '75px', maxWidth: '120px' }}/></td>
                    <td>{product.product_name}</td>
                    {/* <td className="text-center">
                      <Link to={`view/detail/product/${product.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center gap-3 my-4">
            <button className="btn btn-success mt-3 px-4 ms-5" type="submit">เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createCategory;