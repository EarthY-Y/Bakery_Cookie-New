import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAddressCustomer, deleteAddressById } from '../../../../API/customer/addressCustomerService';
import { formatDate } from '../../../untils/frommatters/datetime';
import LoadingPopup from '../../../untils/popUp/loading';
const listAddressCustomer = () => {
  const [listAddress, setListAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getCategoryList = async () => {
      try {
        setIsLoading(true);
        const res = await getAllAddressCustomer();
        console.log(res.data);
        setIsLoading(false);
        setListAddress(res.data);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching data:", err);
      }finally{
        setIsLoading(false);
      }
    };
    getCategoryList();
  }, []);

  const handleDeleteAddress = async(addressId) => {
    setIsLoading(true);
    deleteAddressById(addressId)
    .then(() => {
      setListAddress(prevListAddress => prevListAddress.filter(listAddress => listAddress.addressId !== addressId))
    })
    .catch(err => console.log(err))
    .finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>ที่อยู่ของฉัน</h2>
            <button className="btn btn-outline-warning text-black">
                <Link to="/create/address" className='text-black'>+ เพิ่มที่อยู่</Link>
            </button>
        </div>
        {listAddress.map((address, index) => (
            <div
            key={index}
            className="address-card p-3 mb-3 border rounded d-flex justify-content-between align-items-start"
            style={{ backgroundColor: '#f8f9fa' }}
            >
            <div>
                <h5>{address.name}</h5>
                <p className="mb-1">{address.houseNo}</p>
                <p className="mb-1">{address.tambon_nameTH}, {address.amphure_nameTH}, {address.province_nameTH}, {address.zip_code}</p>
                <p className="mb-0">{address.zipCode}</p>
            </div>
            <div className="d-flex flex-row">
                <div className='p-2 bd-highlight '>
                    <button className="btn btn-primary mb-2">
                      <Link to={`edit/${address.addressId}`} className='text-white'>แก้ไข</Link>
                    </button>
                </div>
                <div className='p-2 bd-highlight '>
                  <button className="btn btn-danger mb-2" onClick={()=> handleDeleteAddress(address.addressId)}>ลบ</button>
                </div>
                {/* <button className="btn p-0">ตั้งเป็นค่าตั้งต้น</button> */}
            </div>
            </div>
        ))}
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>

  );
};

export default listAddressCustomer;
