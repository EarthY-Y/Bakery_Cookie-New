import React, {useEffect, useState} from 'react';
import StatCard from './statCrad';
import { numberGrouping } from '../../untils/frommatters/numberFormatting';
import LoadingPopup from '../../untils/popUp/loading';
import { amoutOrdersService, salesService, newCustomerService, growthUpSalesService, salesPankPerMonthService, salesPerMonthService } from '../../../API/admin/dashboradService';
import SalesLineChart from './chart/salesChart';
import CostAndProfitLine from './chart/costAndProfitLine';
import SalesProductPieChart from './chart/salesProductPieChart';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [amountOrder, setAmountOrder] = useState([]);
  const [salesDataLine, setSalesDataLine] = useState([]);
  const [salesRankPerMonth, setSalesRankPerMonth] = useState([]);
  const [salesPerMonth, setSalesPerMonth] = useState(0);
  const [newCustomer, setNewCustomer] = useState(0); // เริ่มต้นเป็น 0
  const [growthUpPersent, setGrowthUpPersent] = useState(0); // เริ่มต้นเป็น 0
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        //await new Promise((resolve) => setTimeout(resolve, 3000)); //ถ้าอยากลองดูหน้า loading
        const [
          getAmoutOrders,
          getAllSales,
          getNewCustomer,
          getGrowthUpSales,
          getSalesPerMonth,
          getSalesRankPerMonth,
        ] = await Promise.all([
          amoutOrdersService(),
          salesService(),
          newCustomerService(),
          growthUpSalesService(),
          salesPerMonthService(),
          salesPankPerMonthService(),
        ]);
        // console.log(getAmoutOrders.data, getAllSales.data, getNewCustomer.data);
        console.log('getGrowthUpSales: '+ getGrowthUpSales.data[0].growth_percentage);
        console.log(getAllSales.data);
        console.log(getSalesRankPerMonth.data);
        
              
        // ค้นหาข้อมูลของเดือนปัจจุบันจาก getAllSales
        const currentNewCustomerMonthData = getNewCustomer.data.find(customer => customer.month === currentMonth);
        
        // console.log(currentMonthData, currentNewCustomerMonthData);
  
        setAmountOrder(getAmoutOrders.data[0]?.countOrders || 0); 
        setNewCustomer(currentNewCustomerMonthData ? currentNewCustomerMonthData.total_new_customer : 0);
        setSalesDataLine(getAllSales.data || [])
        setGrowthUpPersent(getGrowthUpSales.data[0].growth_percentage || 0)
        setSalesPerMonth(getSalesPerMonth.data[0]?.total_sales || 0)
        setSalesRankPerMonth(getSalesRankPerMonth.data || 0)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();

  }, []);
  
  return (
    <div className="container-fluid py-4">
      {/* Section: Stats */}
      <div className="row mb-5">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard name="จำนวนคำสั่งซื้อ" icon="bi bi-cart" value={amountOrder > 0 ? `${amountOrder} คำสั่งซื้อ`: `0 คำสั่งซื้อ`} color="primary" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard name="ยอดขายรายเดือน" icon="bi bi-bag" value={salesPerMonth > 0 ? numberGrouping(salesPerMonth) + ` บาท`: 0} color="success" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard name="การเติบโตของยอดขาย" icon="bi bi-graph-up" value={!isNaN(growthUpPersent) ? `${numberGrouping(growthUpPersent)} %`: 0} color="danger" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard name="ผู้ใช้ใหม่" icon="bi bi-person-plus" value={newCustomer > 0 ? numberGrouping(newCustomer): 0}  color="warning" />
        </div>
      </div>

      {/* Section: Charts */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              {/* <h5 className="card-title">ต้นทุนเเละกำไร</h5> */}
              <div className="py-5"><SalesLineChart dataSales={salesDataLine} /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              {/* <h5 className="card-title">ต้นทุนเเละกำไร</h5> */}
              <div className="py-5"><CostAndProfitLine dataSales={salesDataLine} /></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-4" >
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              {/* <h5 className="card-title">จำนวนยอดขาย</h5> */}
              <div className="text-center py-5" style={{ display: "flex",justifyContent: "center",alignItems: "center"}}><SalesProductPieChart dataSales={salesRankPerMonth}/></div>
            </div>
          </div>
        </div>
      </div>
      <LoadingPopup
        isLoading = {isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
    </div>
  );
};

export default Dashboard;
