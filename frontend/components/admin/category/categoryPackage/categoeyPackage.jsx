import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListCategoryService, deleteCategoryPackageService } from '../../../../API/admin/categoryPackageService';
import { formatDate } from '../../../untils/frommatters/datetime';
import ConfirmPopUpModal from '../../../untils/popUp/confirmPopUp';
import LoadingPopup from '../../../untils/popUp/loading';

const CategoeyPackage = () => {
  const [listCategory, setListCategory] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [idCategoryPackage, setIdCategoryPackage] = useState("")

  useEffect(() => {
    const getCategoryList = async () => {
      setIsLoading(true)
      try {
        const res = await getListCategoryService();
        console.log(res.data);
        setListCategory(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }finally{
        setIsLoading(false);
      }
    };
    getCategoryList();
  }, []);

  useEffect(() => {
    // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentOrders(listCategory.slice(indexOfFirstItem, indexOfLastItem))

    setTotalPages(Math.ceil(listCategory.length / itemsPerPage))
  }, [listCategory])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const hadleDelete = async(id) => {
    setIdCategoryPackage(id)
    setShowCancelModal(true)
  }

  const handleConfirm = async() => {
    try {
      const response = await deleteCategoryPackageService(idCategoryPackage, 'skip')
      console.log(response);
      setListCategory(prev => prev.filter(categorPackage => categorPackage.package_category_id !== idCategoryPackage))
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>ประเภทบรรจุภัณฑ์</h2>
        <Link to="create" className="btn btn-success d-none d-md-inline-block"><i className="bi bi-plus-circle-fill"></i> เพิ่มประเภทบรรจุภัณฑ์ </Link>
        <Link to="create" className="btn btn-success btn-sm d-md-none"><i className="bi bi-plus-circle-fill"></i> เพิ่มประเภทบรรจุภัณฑ์ </Link>
      </div>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '15%' }}>ประเภท</th>
              <th style={{ width: '15%' }}>จำนวนบรรจุภัณฑ์</th>
              <th style={{ width: '15%' }}>วันที่สร้าง</th>
              <th style={{ width: '15%' }}>วันที่เเก้ไข</th>
              <th style={{ width: '10%' }}>สร้างโดย</th>
              <th style={{ width: '10%' }}>เเก้ไขโดย</th>
              <th style={{ width: '8%' }}>รายละเอียด</th>
              <th style={{ width: '5%' }}>แก้ไข</th>
              <th style={{ width: '5%' }}>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((category) => (
              <tr key={category.package_category_id}>
                <td>{category.package_category_name}</td>
                <td>{category.amountCategoryPackage} อย่าง</td>
                <td className='text-center'>{formatDate(category.created_at)}</td>
                <td className='text-center'>{formatDate(category.updated_at)}</td>
                <td>{category.created_by}</td>
                <td>{category.updated_by}</td>
                <td className="text-center">
                  <Link to={`view/${category.package_category_id}`} className="btn btn-info text-light"><i className="bi bi-eye"></i></Link>
                </td>
                <td className="text-center">
                  <Link to={`edit/${category.package_category_id}`} className="btn btn-warning"><i className="bi bi-pencil"></i></Link>
                </td>
                <td className="text-center">
                  <button className="btn btn-danger" onClick={() => hadleDelete(category.package_category_id)} ><i className="bi bi-trash"></i></button>
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
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={category.package_category_id}>
                <div className="small text-secondary">
                  <div className="d-flex justify-content-between mt-3">
                    <p className="mb-1">ประเภท: {category.package_category_name}</p>                   
                    <Link to={`edit/${category.package_category_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                  </div>
                  <p className="mb-1">จำนวนบรรจุภัณฑ์: {category.amountCategoryPackage} อย่าง</p>
                  <p className="mb-1">วันที่สร้าง: {formatDate(category.created_at)}</p>
                  <p className="mb-1">วันที่เเก้ไข: {formatDate(category.updated_at)}</p>
                  <p className="mb-1">สร้างโดย: {category.created_by}</p>
                  <p className="mb-1">เเก้ไขโดย: {category.updated_by}</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-danger" onClick={() => hadleDelete(category.package_category_id)} ><i className="bi bi-trash"></i></button>
                  <Link to={`view/${category.package_category_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
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
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}

      <ConfirmPopUpModal
        showModal={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleConfirm={handleConfirm}
        text="ต้องการลบประเภทบรรจุภัณฑ์นี้จริงๆใช่ไหม ?"
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default CategoeyPackage;
