import React, { useEffect, useState } from "react";
import { GrLinkPrevious } from "react-icons/gr";
import profileToggle from "../store/profileToggle.js";
import myorder from "../store/myorder.js";
import { HiDownload } from "react-icons/hi";
import userLoginStatus from "../store/userLoginStatus.js";
import useOrderStore from "../store/useOrderStore.js";

import axios from "axios";
function Myorders() {
  const [downloadState, setDownloadState] = useState({});
  // const [myorders, setMyorders] = useState([]);
  const { orders, loading } = useOrderStore();

  const { toggleProfileStatus } = profileToggle();
  const { toggleMyorderStatus } = myorder();

  useEffect(() => {
    console.log(loading);
  });

  function handleDownload(id, email) {
    setDownloadState((prev) => ({ ...prev, [id]: true }));

    axios
      .get(`http://myhitech.digitalmantraaz.com/api/order/pdf/${id}/${email}`, {
        responseType: "blob",
      })
      .then(function (response) {
        const file = new Blob([response.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `order_${id}.pdf`;
        link.click();

        URL.revokeObjectURL(fileURL);
        setDownloadState((prev) => ({ ...prev, [id]: false }));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="relative h-full w-full">
      {loading ? (
        <div
          role="status"
          className="absolute top-50 left-50 transform -translate-x-1/2 -translate-y-1/2"
        >
          <svg
            aria-hidden="true"
            class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        ""
      )}

      <div className="flex justify-between mb-2">
        <button
          onClick={() => {
            toggleMyorderStatus(false);
            toggleProfileStatus(false);
          }}
        >
          <GrLinkPrevious />
        </button>
        <h1 className="text-[20px] mb-5">My Order</h1>
      </div>

      {orders.map((order, index) => {
        return (
          <div
            className="order border-gray-30 p-4 mt-[20px] shadow-md"
            key={index}
            style={{
              background:
                order.status == "new"
                  ? "#f7fff9"
                  : order.status == "process"
                  ? "#f7fff9"
                  : order.status == "dispatched"
                  ? "#f7fff9"
                  : order.status == "delivered"
                  ? "#f7fff9"
                  : order.status == "cancelled"
                  ? "#ffeded"
                  : "",
            }}
          >
            <div className="order-id flex justify-between">
              <h2>
                <span className="font-bold">Order ID</span> <br />{" "}
                <span>{order.order_number}</span>
              </h2>
              <h2>
                {" "}
                <span className="font-bold">Ordered Date</span> <br />{" "}
                <span>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short", // "Mar"
                    day: "2-digit", // "13"
                    year: "numeric", // "2025"
                  })}
                </span>
              </h2>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-[4px] mb-4 dark:bg-gray-700">
              <div
                class="bg-green-600 h-[4px] mt-3 rounded-full dark:bg-green-500"
                style={{
                  width:
                    order.status == "new"
                      ? "10%"
                      : order.status == "process"
                      ? "36%"
                      : order.status == "dispatched"
                      ? "75%"
                      : order.status == "delivered"
                      ? "100%"
                      : order.status == "cancel"
                      ? "100%"
                      : "",
                  background: (order.status=="cancel")?"#fd5a5a":"#4dab64",
                }}
              ></div>
            </div>
            {order.status == "cancel" ? (
              ""
            ) : (
              <div className="flex justify-between">
                <span
                  className={`text-[13px] ${
                    order.status === "new" ? "font-bold" : "font-normal"
                  }`}
                  style={{ color: order.status === "new" ? "#6abb6a" : "gray" }}
                >
                  Ordered
                </span>
                <span
                  className={`text-[13px] ${
                    order.status === "process" ? "font-bold" : "font-normal"
                  }`}
                  style={{
                    color: order.status === "process" ? "#6abb6a" : "gray",
                  }}
                >
                  Processing
                </span>
                <span
                  className={`text-[13px] ${
                    order.status === "dispatched" ? "font-bold" : "font-normal"
                  }`}
                  style={{
                    color: order.status === "dispatched" ? "#6abb6a" : "gray",
                  }}
                >
                  Dispatched
                </span>
                <span
                  className={`text-[13px] ${
                    order.status === "delivered" ? "font-bold" : "font-normal"
                  }`}
                  style={{
                    color: order.status === "delivered" ? "#6abb6a" : "gray",
                  }}
                >
                  Delivered
                </span>
              </div>
            )}

            <div className="flex border-b-1 justify-between mt-2">
              <div className="to-address">
                <h2>
                  <span>Address :</span>
                </h2>
                <p>{order.address1}</p>
                <p>{order.country}</p>
                <p>{order.post_code}</p>
              </div>
              <div>
                <span className="block text-end">
                  Sub Total : ₹ {order.sub_total} /-
                </span>
                <span className="block text-end">
                  Packing Charges : ₹ 50 /-
                </span>
                {/* <span className="block">GST (18%): ₹ 1200 /-</span> */}
              </div>
            </div>
            <div className="h3 border-b-1 my-2 flex justify-between">
              <h3>{order.quantity} Items</h3>
              <h3>Total {order.total_amount + 50}</h3>
            </div>
            {order.status == "cancel" ? (
              <button
                className="p-2 bg-red-700 text-center w-full text-white font-bold disabled:opacity-60"
                disabled={true}
              >
                Cancelled
              </button>
            ) : (
              <button
                className="p-2 bg-green-700 text-center w-full text-white font-bold disabled:opacity-80"
                disabled={downloadState[order.order_number]}
                onClick={() => handleDownload(order.order_number, order.email)}
              >
                {downloadState[order.order_number] ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <>
                    <HiDownload className="text-[22px] inline" /> Download
                    invoice
                  </>
                )}{" "}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Myorders;
