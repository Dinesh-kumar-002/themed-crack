import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { GrLinkPrevious } from "react-icons/gr";
import "./signup.css";
import signUpToggle from "../store/signUpToggle";
import cartStore from "../store/cartStore";
import userLoginStatus from "../store/userLoginStatus";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import orderStatus from "../store/orderStatus";




const MySwal = withReactContent(Swal);

function SignUp() {
  const { loginUserEmail } = userLoginStatus();

  const { toggleOrderStatus } = orderStatus();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const { cart,clearCart } = cartStore();
  const { signUpStatus, signUpStatusToggle } = signUpToggle();
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [orderPlaced,setOrderPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (loginUserEmail) {
      getUserAddress();
    }
  }, []);


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

const getUserAddress = async () => {
    if (!loginUserEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://admin.vmpscrackers.com/api/getuser",
        { email: loginUserEmail }
      );
      console.log(response); // Log the response for debugging
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

  const onSubmit = async (data) => {
    
      console.log(data);
      
    await axios
      .post("https://admin.vmpscrackers.com/api/place-order", {
        cart,
        "email": loginUserEmail,
        data,
      })
      .then((response) => {
        if(response.data.status=="success"){
          signUpStatusToggle();
          setOrderPlaced(true);
          toggleOrderStatus();

          clearCart();
          Swal.fire({
            title: "Order Placed Successfully",
            text: "Thanks for ordering with us 😊",
            icon: "success",
            background: "#e5ffe5",
            backdrop: `
              #e5ffe5
              left top
              no-repeat
            `
          });
        }
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleCheckboxChange = (e) => {
      setIsChecked(e.target.checked);
    console.log("Checkbox checked:", e.target.checked);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div
      className="p-5 fixed top-16 w-100 right-0 h-full bg-red-50 z-9"
      style={{ display: signUpStatus ? "block" : "none" }}
    >
      <div className="flex justify-between mb-2">
        <button onClick={signUpStatusToggle} type="button" className="font-bold text-[20px]">
          <GrLinkPrevious />
        </button>
        <h1 className="text-[20px] mb-5 font-bold">Shipping Address</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !isEditing &&
        userAddress &&
        Object.values(userAddress).some((value) => value) ? (
        <div id="storeaddress" className="bg-red-50 p-2">
          <div className="relative">
            <div className="p-3 bg-white"  onClick={()=>{isChecked?setIsChecked(false):setIsChecked(true)}}>
              <input id="remember" type="checkbox" {...register("checkedAddress", { required: "* Please select Shipping Address" })} checked={isChecked} onChange={handleCheckboxChange} className="w-6 h-6 border border-gray-300 rounded-sm bg-green-50 focus:ring-3 focus:ring-green-300 float-end" />
              
                <p className="font-bold text-[18px]">To ,</p>
                <br />
                <p className="py-1">{userAddress.name}</p>
                <p className="py-1">
                  <span>{userAddress.phone}</span>&nbsp;,&nbsp;
                  <span>{userAddress.altphone}</span>
                </p>
                <p className="py-1">{userAddress.address}</p>
                <p className="py-1">{userAddress.pincode}</p>
                <p className="py-1">{userAddress.state}</p>
          </div>
          {errors.checkedAddress && !isChecked && (
              <span className="error text-red-600 block mt-2 font-bold">
                {errors.checkedAddress.message}
              </span>
            )}

            
                <div className="flex" style={{justifyContent:(isChecked)?"end":"space-between"}}>
                  {!isChecked?
                    <button
                    className="bg-blue-500 text-white p-2 px-4 mt-4"
                    onClick={() => setIsEditing(true)}
                    >
                    Edit Billing Address
                  </button>:null
                  }
                  
                    <button
                      className="bg-green-500 text-white p-3 px-4  mt-4"
                      type="submit" style={{width:(isChecked)?"100%":""}}
                    >
                      Confirm Order
                    </button>
                  
                </div>
          </div>
        </div>
      ) : (
       
       
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
                <span className="error text-red-600">
                  {errors.phone.message}
                </span>
              )}
              {/* <input placeholder="Alternate Number"  className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2" {...register("altphone")} /> */}
            </div>
            <div className="grid grid-cols-1 gap-1">
              <input
                placeholder="Alternate Number"
                type="number"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                {...register("altphone")}
              />
            </div>
            <div className="grid grid-cols-1 gap-1">
              <textarea
                placeholder="Delivery Address"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                {...register("address", { required: "Address is required" })}
              ></textarea>
              {errors.address && (
                <span className="error text-red-600">
                  {errors.address.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-1">
              <input
                type="number"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                placeholder="Delivery Pincode"
                {...register("pincode", { required: "Pincode is required" })}
              />
               {errors.pincode && (
                <span className="error text-red-600">
                  {errors.pincode.message}
                </span>
              )}
              <input
                type="text"
                className="block border-1 border-gray-300 bg-white  w-full mt-1 p-2"
                placeholder="Delivery State"
                {...register("state", { required: "State is required" })}
              />

             
              {errors.state && (
                <span className="error text-red-600">
                  {errors.state.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-1">
              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-500 text-white px-3 py-2 ml-4"
                  onClick={() => setIsEditing(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-2"
                  type="submit"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>    
      )}
    </div>
      </form>
  );
}

export default SignUp;
