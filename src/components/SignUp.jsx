import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { GrLinkPrevious } from "react-icons/gr";
import "./signup.css";
import signUpToggle from "../store/signUpToggle";
import cartStore from "../store/cartStore";
import userLoginStatus from "../store/userLoginStatus";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import orderStatus from "../store/orderStatus";
import { Dialog } from "radix-ui";
import { IoCloseSharp } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";

const MySwal = withReactContent(Swal);

function SignUp() {
  const { loginUserEmail } = userLoginStatus();

  const { toggleOrderStatus } = orderStatus();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const { cart, clearCart } = cartStore();
  const { signUpStatus, signUpStatusToggle } = signUpToggle();
  const [userAddress, setUserAddress] = useState(null);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingSettings, setShippingSettings] = useState();

  useEffect(() => {
    handleShippingSettings();
  }, []);

  const handleShippingSettings = async () => {
    try {
      const response = await axios.get(
        "https://admin.vmpscrackers.com/api/shipping"
      );
      setShippingSettings(response.data.ship);
      console.log(shippingSettings);
    } catch (error) {}
  };

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
    setPlaceOrderLoading(true);

    console.log(data);

    await axios
      .post("https://admin.vmpscrackers.com/api/place-order", {
        cart,
        email: loginUserEmail,
        data,
        checkedAddress: isChecked,
      })
      .then((response) => {
        if (response.data.status == "success") {
          signUpStatusToggle();
          setOrderPlaced(true);
          toggleOrderStatus();
          clearCart();
          setPlaceOrderLoading(false);
          Swal.fire({
            title: "Order Placed Successfully",
            text: "Thanks for ordering with us 😊",
            icon: "success",
            background: "#e5ffe5",
            backdrop: `
              #e5ffe5
              left top
              no-repeat
            `,
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
          <button
            onClick={signUpStatusToggle}
            type="button"
            className="font-bold text-[20px]"
          >
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
              <div
                className="p-3 bg-white"
                onClick={() => {
                  isChecked ? setIsChecked(false) : setIsChecked(true);
                }}
              >
                <input
                  id="remember"
                  type="checkbox"
                  {...register("checkedAddress", {
                    required: "* Please select Shipping Address",
                  })}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="w-6 h-6 border border-gray-300 rounded-sm bg-green-50 focus:ring-3 focus:ring-green-300 float-end"
                />

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
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="block text-end font-bold text-black outline-none select-none flex mt-3">
                    <FaInfoCircle className="inline-block mr-2" />
                    <span className="inline">{shippingSettings.type}</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-[#00000082] data-[state=open]:animate-overlayShow" />
                  <Dialog.Content className="fixed bg-gray-600 left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    {/* <Dialog.Title className="m-0 text-[17px] font-medium text-white">
                {shippingSettings.type}
                </Dialog.Title> */}
                    <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-white">
                      <ul>
                        <li>
                          <p>
                            {shippingSettings.type} ₹ {shippingSettings.price}{" "}
                            /-
                          </p>
                        </li>
                        <li>
                          <p className="text-red-300">
                            This price is applicable for every orders.
                          </p>
                        </li>
                      </ul>
                    </Dialog.Description>

                    <div className="mt-[25px] flex justify-end"></div>
                    <Dialog.Close asChild>
                      <button
                        className="absolute right-0 top-0 inline-flex text-[25px] p-2 appearance-none items-center justify-center border-0 text-white  hover:bg-violet4 focus:outline-none"
                        aria-label="Close"
                      >
                        <IoCloseSharp />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <div
                className="flex"
                style={{ justifyContent: isChecked ? "end" : "space-between" }}
              >
                {!isChecked ? (
                  <button
                    className="bg-blue-500 text-white p-2 px-4 mt-4"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Billing Address
                  </button>
                ) : null}

                <button
                  className="bg-green-600 text-white p-3 px-4  mt-4"
                  type="submit"
                  style={{ width: isChecked ? "100%" : "" }}
                  disabled={placeOrderLoading}
                >
                  {placeOrderLoading ? (
                    <>
                       <svg aria-hidden="true" class="me-2 inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      loading...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </button>

                {/* <button
                      className="bg-green-500 text-white p-3 px-4  mt-4"
                      type="submit" style={{width:(isChecked)?"100%":""}}
                    >
                      Confirm Order
                    </button> */}
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
            <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="block text-end font-bold text-black outline-none select-none flex mt-3">
                    <FaInfoCircle className="inline-block mr-2" />
                    <span className="inline">{shippingSettings.type}</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-[#00000082] data-[state=open]:animate-overlayShow" />
                  <Dialog.Content className="fixed bg-gray-600 left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                    {/* <Dialog.Title className="m-0 text-[17px] font-medium text-white">
                {shippingSettings.type}
                </Dialog.Title> */}
                    <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-white">
                      <ul>
                        <li>
                          <p>
                            {shippingSettings.type} ₹ {shippingSettings.price}{" "}
                            /-
                          </p>
                        </li>
                        <li>
                          <p className="text-red-300">
                            This price is applicable for every orders.
                          </p>
                        </li>
                      </ul>
                    </Dialog.Description>

                    <div className="mt-[25px] flex justify-end"></div>
                    <Dialog.Close asChild>
                      <button
                        className="absolute right-0 top-0 inline-flex text-[25px] p-2 appearance-none items-center justify-center border-0 text-white  hover:bg-violet4 focus:outline-none"
                        aria-label="Close"
                      >
                        <IoCloseSharp />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            <div className="grid">
              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-500 text-white px-5 py-1"
                  onClick={() => setIsEditing(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="flex bg-green-600 text-white px-5 py-2"
                  type="submit"
                  disabled={placeOrderLoading}
                >
                  {placeOrderLoading ? (
                    <>
                      <div role="status inline">
                        <svg aria-hidden="true" class="inline mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                      loading...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
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
