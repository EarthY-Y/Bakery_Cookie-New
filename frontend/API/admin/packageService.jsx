import axios from "axios";
import React, { createContext, useState } from "react";
const API_URL = import.meta.env.VITE_API_PORT_ADMIN;

export const createPackageService = async (fromData) => {
  console.log(fromData);
  try {
    const authToken = localStorage.getItem("tokenAdmin");
    const res = await axios.post(API_URL + "/package/create", fromData, {
      headers: {
        authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error createPackageService:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
};
export const listPackageService = async () => {
  try {
    console.log(API_URL);
    const authToken = localStorage.getItem("tokenAdmin");
    const response = await axios.get(API_URL + "/package", {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    //console.log(response);
    return response;
  } catch (error) {
    console.error("Error listPackageService:", error);
  }
};

export const packageDetialByIdService = async (id) => {
  try {
    const authToken = localStorage.getItem("tokenAdmin");
    const response = await axios.get(API_URL + "/package/" + id, {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    //console.log(response);
    return response;
  } catch (error) {
    console.error("Error listPackageByIdService:", error);
  }
};

export const editPackageService = async (id, fromData) => {
  console.log(fromData);
  try {
    const authToken = localStorage.getItem("tokenAdmin");
    const res = await axios.patch(API_URL + "/package/edit/" + id, fromData, {
      headers: {
        authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error createPackageService:", error);
    throw error; // ส่ง error ออกไปให้ component จัดการ
  }
};

export const deletePackageByIdService = async (id) => {
  try {
    console.log(id);
    const authToken = localStorage.getItem("tokenAdmin");
    const response = await axios.delete(API_URL + "/package/delete/" + id, {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    //console.log(response);
    return response;
  } catch (error) {
    console.error("Error deletePackageByIdService:", error);
  }
};

export const FormContextMaterialPackage = createContext();

export const FormProviderPackageService = ({ children }) => {
  const [formData, setFormData] = useState({});

  return (
    <FormContextMaterialPackage.Provider value={{ formData, setFormData }}>
      {children}
    </FormContextMaterialPackage.Provider>
  );
};
