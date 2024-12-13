import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { manageCustomerListService } from '../../../API/admin/manageCustomerService';
import { formatDate } from '../../untils/frommatters/datetime';
import ConfirmPopUpModal from '../../untils/popUp/confirmPopUp';
import LoadingPopup from '../../untils/popUp/loading';

const managerCustomer = () => {
  const [listCustomer, setListCustomer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          getListCustomer
        ] = await Promise.all ([
          manageCustomerListService()
        ])

        setListCustomer(getListCustomer.data)
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching data:", err);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomer = listCustomer.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(listCustomer.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>จัดการผู้ใช้</h2>
      </div>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '20%' }}>ชื่อจริง</th>
              <th style={{ width: '20%' }}>นามสกุล</th>
              <th style={{ width: '20%' }}>ชื่อบัญชีผู้ใช้</th>
              <th style={{ width: '15%' }}>วันที่สร้าง</th>
              <th style={{ width: '10%' }}>สถานะ</th>
              <th style={{ width: '5%' }}>ดู</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomer.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.f_name}</td>
                <td>{customer.l_name}</td>
                <td>{customer.username}</td>
                <td>{formatDate(customer.created_at)}</td>
                {customer.is_active == 1 ? (<td className="text-center text-success">เปิดใช้งาน</td>):(<td className="text-center text-danger">ปิดการใช้งาน</td>)}
                <td className="text-center">
                  <Link to={`view/${customer.customer_id}`} className="btn btn-info text-light"><i className="bi bi-eye"></i></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-3">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {currentCustomer.map((customer) => (
              <div className="col-12 border rounded p-3 mt-2 shadow-sm bg-light" key={customer.customer_id}>
                <div className="small">
                  <p className="mb-1">ชื่อจริง: {customer.f_name} ชิ้น</p>
                  <p className="mb-1">นามสกุล: {customer.l_name}</p>
                  <p className="mb-1">ชื่อบัญีผู้ใช้: {customer.username}</p>
                  <p className="mb-1">สร้างเมื่อ: {formatDate(customer.created_at)}</p>
                  {customer.is_active == 1 ? (<p className="mb-1 text-success">เปิดใช้งาน</p>):(<p className="mb-1 text-danger">ปิดใช้งาน</p>)}
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <Link to={`view/${customer.customer_id}`} className="btn btn-info btn-sm text-light"><i className="bi bi-eye"></i> ดู </Link>
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
    </div>
  );
};

export default managerCustomer;
