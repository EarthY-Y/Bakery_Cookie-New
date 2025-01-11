import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCategoryProductService, getListProductPictureService, getCategoryByIdService } from '../../../../API/admin/categoryService';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../untils/frommatters/datetime';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PRODUCT

const CategoryById = () => {
  const {id} = useParams()
  const [categoryName, setCategoryName] = useState("");
  const [listCategoryProduct, setListCategoryProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategoryById = async() => {
      try {
        const response = await getCategoryByIdService(id)
        console.log(response.data);
        setListCategoryProduct(response.data)
        setCategoryName(response.data[0]?.category_name || '')
        const initialSelected = response.data.map((item) => item.product_id); //map เอาเเค่ product_id
      } catch (error) {
        
      }
    }
    getCategoryById()
  },[])
  
  return (
    <div className="container mt-5 p-3">
      <div className="mb-4 card col-md-12 px-40 card-body bg-light shadow">
        <h4></h4>
        <div className="mb-4 ">
          <label className="col-form-label">ชื่อประเภทสินค้า</label>
          <input type="text" className="form-control" value={categoryName}readOnly/>
        </div>
        <div>
          <table className="table table-striped table-bordered rounded-3 overflow-hidden">
            <thead>
              <tr className="table-success">
                <th className="text-center align-middle" style={{ width: '25%' }} >รูปสินค้า</th>
                <th className="text-center align-middle" style={{ width: '25%' }} >ชื่อสินค้า</th>
              </tr>
            </thead>
            <tbody>
              {listCategoryProduct.map((product) => (
                <tr key={product.product_id}>
                  <td><img src={API_URL_PICTURE + product.productpic_name } className="img-fluid rounded" alt={"ไม่มีสินค้าในประเภทนี้"} style={{ maxHeight: '100px', maxWidth: '120px' }}/></td>
                  <td>{product.product_name}</td>
                  {/* <td className="text-center">
                    <Link to={`view/detail/product/${product.orders_id}`} className="btn btn-outline-warning text-black">View</Link>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{listCategoryProduct[0]?.created_by}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">วันเวลาที่สร้าง</label>
            <p className="border p-2 rounded bg-white">{formatDate(listCategoryProduct[0]?.created_at)}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">เเก้ไขโดย</label>
            <p className="border p-2 rounded bg-white">{listCategoryProduct[0]?.updated_by}</p>
          </div>
          <div className='col-md-6 col-12 mt-3'>
            <label className="form-label fw-bold">วันเวลาที่เเก้ไข</label>
            <p className="border p-2 rounded bg-white">{formatDate(listCategoryProduct[0]?.updated_at)}</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to={`/category/prduct/edit/${id}`} className="text-center mt-3 px-4 btn btn-warning"><i className="bi bi-pencil"></i> แก้ไข </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryById;