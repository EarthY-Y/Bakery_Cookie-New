import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListCategoryService } from '../../../../API/admin/categoryService';
import { formatDate } from '../../../untils/frommatters/datetime';

const categoey = () => {
  const [listCategory, setListCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const res = await getListCategoryService();
        console.log(res.data);
        setListCategory(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getCategoryList();
  }, []);


  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = listCategory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(listCategory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>ประเภทสินค้า</h2>
        <Link to="create" className="btn btn-success d-none d-md-inline-block"><i className="bi bi-plus-circle-fill"></i> เพิ่มประเภทสินค้า </Link>
        <Link to="create" className="btn btn-success btn-sm d-md-none"><i className="bi bi-plus-circle-fill"></i> เพิ่มประเภทสินค้า </Link>
      </div>
      <p>รอการชำระเงิน</p>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '15%' }}>ประเภท</th>
              <th style={{ width: '10%' }}>จำนวนสินค้า</th>
              <th style={{ width: '10%' }}>วันที่สร้าง</th>
              <th style={{ width: '10%' }}>วันที่เเก้ไข</th>
              <th style={{ width: '10%' }}>สร้างโดย</th>
              <th style={{ width: '10%' }}>เเก้ไขโดย</th>
              <th style={{ width: '10%' }}>รายละเอียด</th>
              <th style={{ width: '10%' }}>แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((category) => (
              <tr key={category.category_id}>
                <td>{category.category_name}</td>
                <td>{category.amountCategoryProduct} ชิ้น</td>
                <td>{formatDate(category.created_at)}</td>
                <td>{formatDate(category.updated_at)}</td>
                <td className="text-center">{category.created_by}</td>
                <td className="text-center">{category.updated_by}</td>
                <td className="text-center">
                  <Link to={`view/${category.category_id}`} className="btn btn-info text-light"><i className="bi bi-eye"></i></Link>
                </td>
                <td className="text-center">
                  <Link to={`edit/${category.category_id}`} className="btn btn-warning"><i className="bi bi-pencil"></i></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-3">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {currentOrders.map((category) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={category.category_id}>
                <div className="small text-secondary">
                  <p className="mb-1">ประเภท: {category.category_name}</p>
                  <p className="mb-1">จำนวนสินค้า: {category.amountCategoryProduct} ชิ้น</p>
                  <p className="mb-1">วันที่สร้าง: {formatDate(category.created_at)}</p>
                  <p className="mb-1">วันที่เเก้ไข: {formatDate(category.updated_at)}</p>
                  <p className="mb-1">สร้างโดย: {category.created_by}</p>
                  <p className="mb-1">เเก้ไขโดย: {category.updated_by}</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <Link to={`view/${category.category_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
                  <Link to={`edit/${category.category_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav>
        <ul className="pagination justify-content-end"> 
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> {/* หน้าเเรก */}
            <button className="page-link" onClick={() => handlePageChange(1)}>First</button> 
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> {/*หน้าก่อนหน้านี้*/}
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          </li>
          {[...Array(totalPages)].map((_, index) => ( //หน้าปัจุบันเเละหน้าทั้งหมดที่มี
            <li key={index + 1} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> {/*หน้าต่อไป*/}
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> {/*หน้าสุดท้าย */}
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>Last</button>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default categoey;
