import React, { useEffect, useState} from 'react';
import axios from 'axios';

const Login = () => {

  const [column, setColumn] = useState([]);
  const [record, setRecord] = useState([]);
  useEffect (() => {
    axios.get('http://localhost:5000/Product')
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
            {column.map((c,i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>          
        </tbody>
            {
              data.map((d, i) => (
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

export default Login;