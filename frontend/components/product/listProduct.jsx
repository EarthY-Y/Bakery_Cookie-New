import React, { useEffect, useState} from 'react';
import axios from 'axios';

const listProduct = () => {

  const [columns, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  useEffect (() => {
    axios.get('http://localhost:5000/Material')
    .then(res => {
      setColumn(Object.keys(res.data[0]))
      setRecord(res.data)
    })
  })

  return (
    <div className="container mt-5">
      <table className='table'>
        <tbody>
          <tr>
            {columns.map((c,i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>          
        </tbody>
            {
              records.map((d, i) => (
                <tr key={i}>
                  <td>{d.product_name}</td>
                  <td>{d.status_product	}</td>
                  <td>{d.quantity}</td>
                  <td>{d.cost}</td>
                  <td>{d.price}</td>
                </tr>
              ))
            }
      </table>
    </div>
  );
};

export default listProduct;