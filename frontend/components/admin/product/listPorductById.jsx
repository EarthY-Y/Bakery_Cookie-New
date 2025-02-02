import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { listProductByIdService, listMaterialProductByIdService } from '../../../API/admin/productService';
import { formatDate } from '../../untils/frommatters/datetime';
import TooltipUntils from '../../untils/popUp/tooltip';
import LoadingPopup from '../../untils/popUp/loading';
import ErrorPopup from '../../untils/popUp/errorPopup';
import {numberGrouping} from '../../untils/frommatters/numberFormatting';
const API_URL_PICTURE = import.meta.env.VITE_API_Port_PICTURE_PRODUCT

const listMaterialById = () => {
  const { id } = useParams();
  const [productById, setProductById] = useState([])
  const [matrialProductMyId, setMatrialProductyId] = useState([])
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getlistMaterialById = async () => {
      setIsLoading(true)
      try {
        const [
          getListProductByIdService,
          getListMaterialProductByIdService,
        ] = await Promise.all([
          listProductByIdService(id),
          listMaterialProductByIdService(id),
        ])
        console.log("getListProductByIdService ", getListProductByIdService.data);
        console.log("getListMaterialProductByIdService ", getListMaterialProductByIdService.data);
        if (!getListProductByIdService.data) {
          throw new Error("ไม่มีข้อมูล")
        }
        setProductById(getListProductByIdService.data)
        setMatrialProductyId(getListMaterialProductByIdService.data)
      }
      catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    getlistMaterialById()
  }, [])

  const calculateTotalCost = () => {
    return matrialProductMyId.reduce((totalCost, item) => {
      const quantity = parseFloat(item.quantity || 0); // จำนวนของวัตถุดิบ
      const costPerQuantity = parseFloat(item.cost_per_quantity || 0); // ต้นทุนต่อหน่วย

      if (!isNaN(quantity) && !isNaN(costPerQuantity)) {
        return totalCost + quantity * costPerQuantity;
      }
      return totalCost;
    }, 0);
  };

  //หาต้นทุนต่อชิ้น
  useEffect(() => {
    const totalCostOrigin = calculateTotalCost();
    const hiddenCosts = totalCostOrigin + (totalCostOrigin * 10 / 100) //ต้นทุนแฝง ค่าเเก๊ส ค่าไฟฟ้า ค่าถ่าน
    setTotalCost(hiddenCosts.toFixed(2))
  }, [matrialProductMyId]);

  useEffect(() => {
    if (matrialProductMyId.length > 0) {
      let totalWeight = 0
      for (const item of matrialProductMyId) {
        totalWeight += parseFloat(item.quantity);
      }
      const weightPiece = totalWeight / productById[0]?.quantity_per_time
      setTotalWeight(weightPiece.toFixed(2))
    }
  }, [matrialProductMyId]);

  useEffect(() => {
    if (productById.length > 0 && matrialProductMyId.length > 0) {
      const costPerQuantity =  productById[0]?.selling_price_per_quantity * parseFloat(productById[0]?.quantity_per_time);
      setTotalPrice(costPerQuantity);
    }
  }, [productById, matrialProductMyId]);

  return (
    <div className="container mt-5 p-3">

      {/* ข้อมูลทั่วไปของสินค้า */}
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <h3>ข้อมูลทั่วไปของสินค้า</h3>
        <div className="text-center mb-4">
          <img src={API_URL_PICTURE + productById[0]?.productpic_name} height={250} width={400} alt="Material" className="rounded img-fluid" />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">ชื่อวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{productById[0]?.product_name}</p>
        </div>
      </div>

      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <h3>ส่วนประกอบของสินค้า</h3>
        {matrialProductMyId.map((product, index) => (
          <div key={index} className="border p-3 rounded mb-4" style={{ background: '#EBEAEA' }}>
            <div className="mb-3 row">
              <label className="form-label fw-bold col-6 me-5 d-none d-md-block">วัตถุดิบที่ {index + 1}</label>
              <label className="form-label fw-bold col-2 me-5 d-none d-md-block">ปริมาณ</label>
              <label className="form-label fw-bold col-2 me-5 d-none d-md-block">ราคา/ปริมาณ</label>
            </div>

            <div className="mb-3 row">
              <span className="fw-bold text-dark d-block d-md-none mb-2">วัตถุดิบที่ {index + 1}</span>
              <p className="border p-2 rounded bg-white col-md-6 col-12 me-5">{product.material_name}</p>
              <span className="fw-bold text-dark d-block d-md-none mb-2">ปริมาณ</span>
              <p className="border p-2 rounded bg-white col-md-2 col-12 me-5">{product.quantity} กรัม</p>
              <span className="fw-bold text-dark d-block d-md-none mb-2">ราคา/ปริมาณ</span>
              <p className="border p-2 rounded bg-white col-md-2 col-12 me-5">{product.cost_per_quantity} บาท/กรัม</p>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label fw-bold">ปริมาณที่ทำ/ครั้ง</label>
          <p className="border p-2 rounded bg-white">{productById[0]?.quantity_per_time} ชิ้น</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">น้ำหนักต่อชิ้น</label>
          <p className="border p-2 rounded bg-white">{totalWeight} ชิ้น</p>
        </div>

      </div>

      {/* ต้นทุน */}
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <h3>ต้นทุน</h3>
        <div className="mb-3">
          <label className="form-label fw-bold">ต้นทุนวัตถุดิบ</label>
          <p className="border p-2 rounded bg-white">{calculateTotalCost().toFixed(2)} บาท</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">ต้นทุนวัตถุรวม
            <TooltipUntils
              text="รวมต้นทุนเเฝงอีก 10 % เช่น ค่าน้ำ ค่าไฟ ค่าเเก๊ส เเละค่าบรรจุภัฑณ์"
            />
          </label>
          <p className="border p-2 rounded bg-white">{totalCost} บาท</p>
        </div>
      </div>

      {/* ราคา */}
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <h3>ราคา</h3>
        <div className="">
          <label className="form-label fw-bold">ราคาขาย/ชิ้น</label>
          <p className="border p-2 rounded bg-white">{productById[0]?.selling_price_per_quantity} บาทต่อชิ้น</p>
        </div>

        <div className="">
          <label className="form-label fw-bold">ราคาขายรวม/การทำ 1 ครั้ง</label>
          <p className="border p-2 rounded bg-white">{numberGrouping(totalPrice) || 0} บาท/ครั้ง</p>
        </div>
      </div>

      {/* การทำรายการ */}
      <div className="mb-4 card col-md-12 px-40 rounded shadow border bg-light card-body">
        <h3>การทำรายการ</h3>
        <div className="mb-3 row">
          <div className="col-md-6 col-12 mt-3">
            <label className="form-label fw-bold">สร้างโดย</label>
            <p className="border p-2 rounded bg-white">{productById[0]?.created_by}</p>
          </div>
          <div className="col-md-6 col-12 mt-3">
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white">{formatDate(productById[0]?.created_at)}</p>
          </div>
        </div>
        <div className="mb-3 row">
          <div className="col-md-6 col-12 mt-3">
            <label className="form-label fw-bold">แก้ไขโดย</label>
            <p className="border p-2 rounded bg-white">{productById[0]?.updated_by || "ไม่มีผู้เเก้ไข"}</p>
          </div>
          <div className="col-md-6 col-12 mt-3">
            <label className="form-label fw-bold">เวลา</label>
            <p className="border p-2 rounded bg-white">{formatDate(productById[0]?.updated_at)}</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-3 mb-5">
        <Link to={`/product/edit/${id}`} className="text-center mt-3 px-4 btn btn-warning"><i className="bi bi-pencil"></i> แก้ไข </Link>
      </div>
      <LoadingPopup
        isLoading={isLoading}
      />
      {isLoading ? <div className="modal-backdrop fade show"></div> : <div className=""></div>}
      {error && (
        <ErrorPopup message={error} text="เชื่อมต่อล้มเหลว" onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default listMaterialById;