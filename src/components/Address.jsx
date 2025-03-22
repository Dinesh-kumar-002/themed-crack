import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrLinkPrevious } from "react-icons/gr";
import { useForm } from "react-hook-form";
import profileToggle from "../store/profileToggle.js";
import userLoginStatus from "../store/userLoginStatus";
import address from "../store/address.js";
import { FaPencilAlt } from "react-icons/fa";


function Address() {
  const { toggleProfileStatus } = profileToggle();
  const { loginUserEmail } = userLoginStatus();
  const { addressStatus, toggleAddressStatus } = address();
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    getUserAddress();
  }, []);

  const getUserAddress = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://admin.vmpscrackers.com/api/getuser",
        { email: loginUserEmail }
      );
      if (response.data && response.data.data) {
        setUserAddress(response.data.data);
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      setError("Failed to fetch address. Please try again.");
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userAddress) {
      setValue("name", userAddress.name || "");
      setValue("phone", userAddress.phone || "");
      setValue("altphone", userAddress.altphone || "");
      setValue("address", userAddress.address || "");
      setValue("pincode", userAddress.pincode || "");
      setValue("state", userAddress.state || "Tamil Nadu");
    }
  }, [userAddress, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://admin.vmpscrackers.com/api/register",
        { ...data, email: loginUserEmail }
      );
      if (response.status === 200) {
        setUserAddress(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed", error);
      setError("Failed to update address. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-between mb-2">
        <button
        className="text-[20px] font-bold"
          onClick={() => {
            toggleAddressStatus(false);
            toggleProfileStatus(false);
          }}
        >
          <GrLinkPrevious />
        </button>
        <h1 className="text-[20px] mb-5 font-bold">My Address</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !isEditing &&
        userAddress &&
        Object.values(userAddress).some((value) => value) ? (
        <div id="storeaddress" className="bg-red-50 p-4">
         
          <div className="relative">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-red-200">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Name
                  </th>
                  <td className="px-6 py-4">{userAddress?.name}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Phone
                  </th>
                  <td className="px-6 py-4">{userAddress?.phone}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Alternate Phone
                  </th>
                  <td className="px-6 py-4">
                    {(userAddress && !userAddress.altphone=="") ? userAddress.altphone : "---"}
                  </td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Address
                  </th>
                  <td className="px-6 py-4">{userAddress?.address}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Pincode
                  </th>
                  <td className="px-6 py-4">{userAddress?.pincode}</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    State
                  </th>
                  <td className="px-6 py-4">{userAddress?.state}</td>
                </tr>
              </tbody>
            </table>
            <button
              className="absolute -top-10 -right-5 bg-blue-500 text-white p-3 rounded-full mt-4"
              onClick={() => setIsEditing(true)}
            >
              <FaPencilAlt />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="">
            <div className="grid grid-cols-1 gap-1">
              <input
                placeholder="Name"
                className="block border-1 border-gray-300 bg-white  w-full mt-3 p-2"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="error text-red-600">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-1">
              <input
                placeholder="Phone Number *"
                 type="number"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Invalid phone number",
                  },
                })}
              />
              {errors.phone && (
                <span className="error text-red-600">{errors.phone.message}</span>
              )}
              {/* <input placeholder="Alternate Number"  className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2" {...register("altphone")} /> */}
            </div>
            <div className="grid grid-cols-1 gap-1">
            
              <input placeholder="Alternate Number"  type="number" className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2" {...register("altphone")} />
            </div>
            <div className="grid grid-cols-1 gap-1">
              <textarea
                placeholder="Delivery Address"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                {...register("address", { required: "Address is required" })}
              ></textarea>
              {errors.address && (
                <span className="error text-red-600">{errors.address.message}</span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-1">
              <input
                type="number"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                placeholder="Delivery Pincode"
                {...register("pincode", { required: "Pincode is required" })}
              />
              <input
                type="text"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                placeholder="Delivery State"
                {...register("state", { required: "State is required" })}
              />

              {errors.pincode && (
                <span className="error text-red-600">{errors.pincode.message}</span>
              )}
              {errors.state && (
                <span className="error text-red-600">{errors.state.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-1">
              <div className="flex justify-center mt-4">
                <button
                  className="bg-green-600 text-white px-3 py-2"
                  type="submit"
                >
                  Save Address
                </button>
                <button
                  className="bg-gray-500 text-white px-3 py-2 ml-4"
                  onClick={() => setIsEditing(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default Address;
