import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListCategoryService } from '../../../../API/admin/categoryPackageService';
import { formatDate } from '../../../untils/frommatters/datetime';

const CategoeyPackage = () => {
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
        <Link to="create" className="btn btn-outline-warning text-black">
          เพิ่มประเภทสินค้า
        </Link>
      </div>
      <h4>รอการชำระเงิน</h4>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="text-center align-middle" style={{ width: '15%' }}>ประเภท</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>จำนวนสินค้า</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่สร้าง</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>วันที่เเก้ไข</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>สร้างโดย</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>เเก้ไขโดย</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>เเก้ไข</th>
            <th className="text-center align-middle" style={{ width: '10%' }}>รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((category) => (
            <tr key={category.package_category_id}>
              <td>{category.package_category_name}</td>
              <td>{category.amountCategoryPackage} ชิ้น</td>
              <td>{formatDate(category.created_at)}</td>
              <td>{formatDate(category.updated_at)}</td>
              <td className="text-center">{category.created_by}</td>
              <td className="text-center">{category.updated_by}</td>
              <td className="text-center">
                <Link to={`view/${category.package_category_id}`} className="btn btn-outline-warning text-black">view</Link>
              </td>
              <td className="text-center">
                <Link to={`edit/${category.package_category_id}`} className="btn btn-outline-warning text-black">edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default CategoeyPackage;
