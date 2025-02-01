import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listOrderByStatusNameService } from '../../../API/admin/ordersService';
import LoadingPopup from '../../untils/popUp/loading';
import { formatDate } from '../../untils/frommatters/datetime';
import Search from '../../untils/fucntion/search';
import ErrorPopup from '../../untils/popUp/errorPopup';

const ListOrders = () => {
  const [orderStatusById, setOrdersStatusById] = useState([]);
  const [orderStatusByIdSearch, setOrdersStatusByIdSearch] = useState([]);
  const [currentPageStatusById, setCurrentPageStatusById] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);;
  const [error, setError] = useState(null);
  const {id} = useParams();
  const history = ["ยกเลิก", "จัดส่งสำเร็จ"]
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        console.log(id);
        
        const [
          listOrderByStatusName,
        ] = await Promise.all([
          listOrderByStatusNameService(id),
        ])
  
        setOrdersStatusById(listOrderByStatusName.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const indexOfLastItemStatusById = currentPageStatusById * itemsPerPage;
  const indexOfFirstItemStatusById = indexOfLastItemStatusById - itemsPerPage;
  const currentOrdersStatusById = orderStatusByIdSearch.slice(indexOfFirstItemStatusById, indexOfLastItemStatusById);

  const totalPagesStatusById = Math.ceil(orderStatusByIdSearch.length / itemsPerPage);

  const handlePageChangeStatusById = (pageNumber) => {
    setCurrentPageStatusById(pageNumber);
  };

  const handleSearchStatusById = (results) => {
    console.log(results);
    setOrdersStatusByIdSearch(results)
    // setOrdersStatusByIdSearch((prev) => prev.filter((item => item.orders_id === results.orders_id)));
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{id}</h2>
      </div>
      <h4></h4>
      <div className='row'>
        <div className="col-md-6 col-12">
          <Search 
            data={orderStatusById}
            handleSearch={handleSearchStatusById}
            name="รหัสคำสั่งซื้อ"
            itemKeys={["orders_id"]}
          />
        </div>
        <div className="col-md-6 col-12">
          <Search 
            data={orderStatusById}
            handleSearch={handleSearchStatusById}
            name="ชื่อลูกค้า"
            itemKeys={["fullname"]}
          />
        </div>
      </div>
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover table-bordered rounded-3 overflow-hidden">
          <thead className="table-success">
            <tr className="text-center align-middle">
              <th style={{ width: '15%' }}>รหัสคำสั่งซื้อ</th>
              <th style={{ width: '15%' }}>ชื่อผู้สั่ง</th>
              <th style={{ width: '10%' }}>ปริมาณ</th>
              <th style={{ width: '10%' }}>ราคารวม</th>
              <th style={{ width: '15%' }}>วันที่สั่งซื้อ</th>
              <th style={{ width: '15%' }}>วันที่ชำระเงิน</th>
              <th style={{ width: '12%' }}>สถานะ</th>
              <th style={{ width: '15%' }}>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {currentOrdersStatusById.map((order) => (
              <tr key={order.orders_id}>
                <td className='text-center'>{order.orders_id}</td>
                <td>{order.fullname}</td>
                <td className='text-center'>{order.quantity} ชิ้น</td>
                <td className='text-center'>{order.price} บาท</td>
                <td className='text-center'>{formatDate(order.created_at)}</td>
                <td className="text-center">{formatDate(order.updated_at) || `รอชำระเงิน`}</td>
                <td className="text-center">{order.status_name}</td>
                <td className="text-center">
                {history.includes(order.status_name) ? (
                  <Link to={`/ordershistory/view/detail/order/${order.orders_id}`} className="btn btn-info text-light">
                    <i className="bi bi-eye"></i>
                  </Link>
                ) : (
                  <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-info text-light">
                    <i className="bi bi-eye"></i>
                  </Link>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-block d-md-none pb-3">
        <div className="row gy-4">
          <div className="px-3 card-body">
            {currentOrdersStatusById.map((order) => (
              <div className="col-12 border rounded p-3 shadow-sm bg-light mb-2" key={order.orders_id}>
                <div className="small ">
                  <p className="mb-1">รหัสคำสั่งซื้อ: {order.orders_id}</p>
                  <p className="mb-1">ชื่อผู้สั่ง: {order.fullname}</p>
                  <p className="mb-1">ปริมาณ: {order.quantity} ชิ้น</p>
                  <p className="mb-1">ราคารวม: {order.price} บาท</p>
                  <p className="mb-1">วันที่สั่งซื้อ: {formatDate(order.created_at)}</p>
                  <p className="mb-1">วันที่ชำระเงิน: {formatDate(order.updated_at) || `รอชำระเงิน`}</p>
                  <p className="mb-1">สถานะ: {order.status_name}</p>
                </div>
                <div className="d-flex flex-row-reverse bd-highlight mt-3">
                {history.includes(order.status_name) ? (
                  <Link to={`/ordershistory/view/detail/order/${order.orders_id}`} className="btn btn-info text-light">
                    <i className="bi bi-eye"></i>
                  </Link>
                ) : (
                  <Link to={`view/detail/order/${order.orders_id}`} className="btn btn-info text-light">
                    <i className="bi bi-eye"></i>
                  </Link>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav>
        <ul className="pagination justify-content-end"> 
          <li className={`page-item ${currentPageStatusById === 1 ? 'disabled' : ''}`}> {/* หน้าเเรก */}
            <button className="page-link" onClick={() => handlePageChangeStatusById(1)}>First</button> 
          </li>
          <li className={`page-item ${currentPageStatusById === 1 ? 'disabled' : ''}`}> {/*หน้าก่อนหน้านี้*/}
            <button className="page-link" onClick={() => handlePageChangeStatusById(currentPageStatusById - 1)}>Previous</button>
          </li>
          {[...Array(totalPagesStatusById)].map((_, index) => ( //หน้าปัจุบันเเละหน้าทั้งหมดที่มี
            <li key={index + 1} className={`page-item ${index + 1 === currentPageStatusById ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChangeStatusById(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPageStatusById === totalPagesStatusById ? 'disabled' : ''}`}> {/*หน้าต่อไป*/}
            <button className="page-link" onClick={() => handlePageChangeStatusById(currentPageStatusById + 1)}>Next</button>
          </li>
          <li className={`page-item ${currentPageStatusById === totalPagesStatusById ? 'disabled' : ''}`}> {/*หน้าสุดท้าย */}
            <button className="page-link" onClick={() => handlePageChangeStatusById(totalPagesStatusById)}>Last</button>
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
    </div>
  );
};

export default ListOrders;
