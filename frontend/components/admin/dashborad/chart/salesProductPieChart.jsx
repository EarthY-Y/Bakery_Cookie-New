import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Title, } from "chart.js";
import LoadingPopup from "../../../untils/popUp/loading";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Title);

const SalesProductPieChart  = ({ dataSales }) => {
  const [isLoading, setIsLoading] = useState(false);

  // เตรียมข้อมูลเพื่อสร้างกราฟ
  // กรองข้อมูลที่มี percentage เป็น null ออก
  const filteredDataSales = dataSales.filter((item) => item.percentage !== null);

  // หากไม่มีข้อมูลให้แสดงข้อความ
  if (filteredDataSales.length === 0) {
    return <p className="text-center">ไม่มีข้อมูลสำหรับแสดงกราฟ</p>;
  }
  const labels = filteredDataSales.map((item) => `${item.product_name} (${item.percentage}%)`);
  const percentage = filteredDataSales.map((item) => item.percentage);

  const data = {
    labels: labels,
    datasets: [{
      label: 'ขายไปทั้งสิ้น',
      data: percentage,
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
      ],
      hoverOffset: 3 //เวลา hover เเล้ว pie จะลอยขึ้น
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      //แสดง % ตอน hover โดยใช้ tooltip formatter
      tooltip: {
        callbacks: { 
          label: (tooltipItem) => {
            let value = tooltipItem.raw; // ค่าที่ส่งมา
            return ` ${value}%`; // แสดงเป็นเปอร์เซ็นต์
          }
        }
      },
      legend: {
        position: "top",
        labels: {
          font: {
            size: 20
          }
        }
      },
      title: {
        display: true,
        text: "ยอดขายย้อนหลัง 30 วัน",
        font: {
          size: 20,
        },
      },
      labels: {
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <>
      <div>
        <LoadingPopup isLoading={isLoading} />
        {isLoading && <div className="modal-backdrop fade show"></div>}
      </div>
      <div className="d-none d-md-block text-center" style={{ width: "50%", height: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Pie data={data} options={options} />
      </div>
      <div className="d-block d-md-none text-center">
        <Pie data={data} options={options} />
      </div>
    </>
  );
};

export default SalesProductPieChart ;
