import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createCategoryService, getListProductPictureService } from '../../../API/admin/categoryService';
import { Link } from 'react-router-dom';
import { formatDate } from '../../untils/frommatters/datetime';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE

const createCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [statusId, setStatusId] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(statusId,categoryName);      
      // const res = await createCategorService(statusId,categoryName,statusfor); //จะส่งไปเป็น formData เเบบนี้ได้ต้องผ่าน multer ก่อน
      // navigate('/category');
      // console.log(res);
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
    <div className="container mt-5">
      <Link className="btn btn-light text-black mb-4" to="/category">
        <i className="bi bi-arrow-left"></i> ย้อนกลับ
      </Link>
      <div className="mb-4 card col-md-12 px-40 card-body">
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
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
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
                          const productId = e.target.value;
                          setSelectedProducts(prev =>
                              prev.includes(productId)
                                  ? prev.filter(id => id !== productId)
                                  : [...prev, productId]
                          );
                        }}
                      /></td>
                    <td><img src={API_URL_PICTURE + product.productpic_name } className="img-fluid" alt={product.product_name} style={{ maxHeight: '75px', maxWidth: '120px' }}/></td>
                    <td>{product.product_name}</td>
                    {/* <td className="text-center">
                      <Link to={`view/detail/product/${product.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-md-flex justify-content-center" style={{margin:'5%'}}>
            <button className="btn btn-secondary me-5" type="button" style={{ width: '100px', height: '40px' }}>ล้าง</button>
            <button className="btn btn-primary ms-5" type="submit" style={{ width: '100px', height: '40px' }}>เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default createCategory;