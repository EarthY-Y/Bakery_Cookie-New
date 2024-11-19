import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllAddressCustomer } from '../../../../API/customer/addressCustomerService';
import { formatDate } from '../../../untils/frommatters/datetime';

const listAddressCustomer = () => {
  const [listAddress, setListAddress] = useState([]);

  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const res = await getAllAddressCustomer();
        console.log(res.data);
        setListAddress(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getCategoryList();
  }, []);

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
                <p className="mb-1">{address.houesNo}</p>
                <p className="mb-1">{address.tambon_nameTH}, {address.amphure_nameTH}, {address.province_nameTH}, {address.zip_code}</p>
                <p className="mb-0">{address.zipCode}</p>
            </div>
            <div className="d-flex flex-row">
                <div className='p-2 bd-highlight '>
                    <button className="btn btn-primary mb-2">แก้ไข</button>
                </div>
                <div className='p-2 bd-highlight '>
                    <button className="btn btn-danger mb-2">ลบ</button>
                </div>
                {/* <button className="btn p-0">ตั้งเป็นค่าตั้งต้น</button> */}
            </div>
            </div>
        ))}
    </div>

  );
};

export default listAddressCustomer;
