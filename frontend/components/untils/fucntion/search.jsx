import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

const Search = ({ data, handleSearch, name, itemKeys }) => {
    const [searchTerm, setSearchTerm] = useState('');
    //useMemo เพื่อเก็บ instance ของ Fuse ช่วยลดการสร้างตัวแปรใหม่ทุกครั้งที่ component render หรือ data เปลี่ยนแปลง
    const fuse = useMemo(() => new Fuse(data, {
        keys: [itemKeys], //ได้เเค่ Array เพราะข้อมูลที่ส่งมาเป็นเเบบ key and Value เลยต้องเข้าถึงข้อมูลด้วย key
        threshold: 0.2,
    }), [data]); //เเต่จะถูก reder เมื่อ data ถูกเปลี่ยนเเปลงจริงๆ
    
    useEffect(() => {
        if (searchTerm) {
          const results = fuse.search(searchTerm).map((result) => result.item); //ที่ใช้ item เพราะว่าเป็นโครงสร้างข้อมูลที่ได้จากการค้นหาด้วย Fuse.js
          handleSearch(results)
        } else {
          handleSearch(data)
        }
      }, [searchTerm, data]);

    return (
        <div className="mb-3">
            {name ? <p className='mb-1'>{name}</p>: ""}
            <input className="form-control me-2 mt-0" type="search" placeholder={name} aria-label="Search" onChange={(e) => setSearchTerm(e.target.value)}/>
            {/* <button onClick={handleSearch} className="btn btn-danger btn-outline-light" type="submit"><i className="bi bi-search"></i></button> */}
        </div>
    );
};

export default Search;
