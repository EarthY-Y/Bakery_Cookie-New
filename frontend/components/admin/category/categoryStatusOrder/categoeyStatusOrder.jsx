import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListCategoryOrderStatusService, deleteCategoryStatusService } from '../../../../API/admin/categoryOrderStatusService';
import { formatDate } from '../../../untils/frommatters/datetime';
import LoadingPopup from '../../../untils/popUp/loading';
import ErrorPopup from '../../../untils/popUp/errorPopup';
import ConfirmPopUpModal from '../../../untils/popUp/confirmPopUp';

const CategoeyStatusOrder = () => {
  const [listCategoryOrderStatus, setListCategoryOrderStatus] = useState([]);
  const [currentOrderStatus, setCurrentOrderStatus] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);;
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [idCategoryStatus, setIdCategoryStatus] = useState("")

  const dis_trash = ["กำลังดำเนินการ","รอดำเนินการ"]
  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const res = await getListCategoryOrderStatusService();
        console.log(res.data);
        setListCategoryOrderStatus(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
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
    setCurrentOrderStatus(listCategoryOrderStatus.slice(indexOfFirstItem, indexOfLastItem))
  
    setTotalPages(Math.ceil(listCategoryOrderStatus.length / itemsPerPage))
  },[listCategoryOrderStatus])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const hadleDelete = async(id) => {
    setIdCategoryStatus(id)
    setShowCancelModal(true)

  }

  const handleConfirm = async() => {
    try {
      const response = await deleteCategoryStatusService(idCategoryStatus, 'skip')
      console.log(response);
      setListCategoryOrderStatus(prev => prev.filter(categorStatus => categorStatus.category_status_order_id !== idCategoryStatus))
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>ประเภทสถานะคำสั่งซื้อ</h2>
        <Link to="create" className="btn btn-success d-none d-md-inline-block"><i className="bi bi-plus-circle-fill"></i> เพิ่มประเภทสถานะคำสั่งซื้อ </Link>
        <Link to="create" className="btn btn-success btn-sm d-md-none"><i className="bi bi-plus-circle-fill"></i> เพิ่มประเภทสถานะคำสั่งซื้อ </Link>
      </div>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '10%' }}>ประเภท</th>
              <th style={{ width: '15%' }}>จำนวนบรรจุภัณฑ์</th>
              <th style={{ width: '15%' }}>วันที่สร้าง</th>
              <th style={{ width: '15%' }}>วันที่เเก้ไข</th>
              <th style={{ width: '10%' }}>สร้างโดย</th>
              <th style={{ width: '10%' }}>เเก้ไขโดย</th>
              <th style={{ width: '10%' }}>รายละเอียด</th>
              <th style={{ width: '5%' }}>แก้ไข</th>
              <th style={{ width: '5%' }}>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {currentOrderStatus.map((orderStatus) => (
              <tr key={orderStatus.category_status_order_id}>
                <td>{orderStatus.category_status_order_name}</td>
                <td>{orderStatus.amountStatusOrders} อย่าง</td>
                <td className='text-center'>{formatDate(orderStatus.created_at || 0)}</td>
                <td className='text-center'>{formatDate(orderStatus.updated_at || 0)}</td>
                <td>{orderStatus.created_by}</td>
                <td>{orderStatus.updated_by}</td>
                <td className="text-center">
                  <Link to={`view/${orderStatus.category_status_order_id}`} className="btn btn-info text-light"><i className="bi bi-eye"></i></Link>
                </td>
                <td className="text-center">
                {dis_trash.includes(orderStatus.category_status_order_name) ? (
                  <button className="btn btn-warning" disabled={true}><i className="bi bi-pencil"></i></button>
                ) : (<Link to={`edit/${orderStatus.category_status_order_id}`}className="btn btn-warning"><i className="bi bi-pencil"></i></Link>
                )}
                </td>
                <td className="text-center">
                  <button className="btn btn-danger" disabled={dis_trash.includes(orderStatus.category_status_order_name)} //includes จะคืนค่ามาเป็น boolean ให้ไม่เหมือน map 
                  onClick={() => hadleDelete(orderStatus.category_status_order_id)} ><i className="bi bi-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-3">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {currentOrderStatus.map((orderStatus) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light" key={orderStatus.category_status_order_id}>
                <div className="small text-secondary">
                  <div className="d-flex justify-content-between mt-3">
                    <p className="mb-1">ประเภท: {orderStatus.category_status_order_name}</p>                   
                    <Link to={`edit/${orderStatus.category_status_order_id}`} className="btn btn-warning btn-sm"><i className="bi bi-pencil"></i> แก้ไข </Link>
                  </div>
                  <p className="mb-1">จำนวนบรรจุภัณฑ์: {orderStatus.amountStatusOrders} อย่าง</p>
                  <p className="mb-1">วันที่สร้าง: {formatDate(orderStatus.created_at)}</p>
                  <p className="mb-1">วันที่เเก้ไข: {formatDate(orderStatus.updated_at)}</p>
                  <p className="mb-1">สร้างโดย: {orderStatus.created_by}</p>
                  <p className="mb-1">เเก้ไขโดย: {orderStatus.updated_by}</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-danger" onClick={() => hadleDelete(orderStatus.category_status_order_id)} 
                    disabled={dis_trash.includes(orderStatus.category_status_order_name)} ><i className="bi bi-trash"></i>
                  </button>
                  <Link to={`view/${orderStatus.category_status_order_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
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
      
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}

      <ConfirmPopUpModal
        showModal={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
        handleConfirm={handleConfirm}
        text="ต้องการลบประเภทสถานะคำสั่งซื้อนี้จริงๆใช่ไหม ?"
      />
      {showCancelModal ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default CategoeyStatusOrder;
