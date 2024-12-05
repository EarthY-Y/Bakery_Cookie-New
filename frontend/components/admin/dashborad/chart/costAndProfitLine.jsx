import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, scales, Ticks, BarElement} from "chart.js";
import LoadingPopup from "../../../untils/popUp/loading";

ChartJS.register(
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const salesLineChart = ({ dataSales }) => {
  const [isLoading, setIsLoading] = useState(false);
  // Mapping เดือนจากตัวเลขเป็นชื่อภาษาไทย
  const monthMapping = {
    "01": "มกราคม",
    "02": "กุมภาพันธ์",
    "03": "มีนาคม",
    "04": "เมษายน",
    "05": "พฤษภาคม",
    "06": "มิถุนายน",
    "07": "กรกฎาคม",
    "08": "สิงหาคม",
    "09": "กันยายน",
    10: "ตุลาคม",
    11: "พฤศจิกายน",
    12: "ธันวาคม",
  };
  // คำนวณช่วง 12 เดือนล่าสุด
  const now = new Date();
  const last12Months = Array.from({ length: 12 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เติมเลข 0 ด้านหน้าถ้าจำนวนหลักไม่ครบ
    return `${year}-${month}`;
  });

  // กรองข้อมูลให้อยู่ในช่วง 12 เดือนล่าสุด
  const filteredData = dataSales.filter((item) =>
    last12Months.includes(item.sale_month)
  );

  // เตรียมข้อมูลเพื่อสร้างกราฟ
  const labels = filteredData.map((item) => {
    const [year, month] = item.sale_month.split("-");
    return `${monthMapping[month]} ${year}`;
  });

  const totalCost = filteredData.map((item) => item.total_cost);
  const totalProfit = filteredData.map((item) => item.profit_month);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "ต้นทุน",
        data: totalCost,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, //เพิ่มความโค้งเล็กน้อย
      },
      {
        label: "กำไร",
        data: totalProfit,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    // responsive: true,
    maintainAspectRatio: false, // ปิดการรักษาอัตราส่วนของกราฟ
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 20,
          },
        },
      },
      title: {
        display: true,
        text: "ต้นทุนเเละกำไรย้อนหลัง 12 เดือน",
        font: {
          size: 20,
        },
      },
      tooltip: {
        bodyFont: {
          size: 20, // ขนาดตัวอักษรของข้อความใน Tooltip
        },
        titleFont: {
          size: 20, // ขนาดตัวอักษรของหัวข้อใน Tooltip
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 15,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 15,
          },
          // stepSize: 100, //ช่วงของเเกน Y
        },
      },
    },
  };

  const optionsMdScreen = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 20,
          },
        },
      },
      title: {
        display: true,
        text: "ต้นทุนเเละกำไรย้อนหลัง 12 เดือน",
        font: {
          size: 20,
        },
      },
      tooltip: {
        bodyFont: {
          size: 20, // ขนาดตัวอักษรของข้อความใน Tooltip
        },
        titleFont: {
          size: 20, // ขนาดตัวอักษรของหัวข้อใน Tooltip
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 15,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 15,
          },
          // stepSize: 100,
        },
      },
    },
  };

  return (
    <>
      <div>
        <LoadingPopup isLoading={isLoading} />
        {isLoading ? (
          <div className="modal-backdrop fade show"></div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="d-none d-md-block">
        <Bar data={data} options={optionsMdScreen} />
      </div>
      <div
        className="d-block d-md-none"
        style={{ height: "400px", width: "100%" }}
      >
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default salesLineChart;
