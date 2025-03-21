import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import filterToggle from "./store/filterToggle";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import "@radix-ui/themes/styles.css";
import Profile from "./components/Profile";
import {
  Theme,
  CheckboxGroup,
} from "@radix-ui/themes";
import { RadioGroup,DropdownMenu  } from "radix-ui";

import Products from "./components/Products";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import "./App.css";
import productStore from "./store/productStore";

function App() {
  const {loader,setLoader} = productStore();
  const { status,updateStatus } = filterToggle();
  // const { themeStatus } = theme();
  const [selectedValues, setSelectedValues] = useState([]);
  const [rangeRadio, setRange] = useState("0");



  const handleCategoryChange = (value) => {
    setSelectedValues(value);
  };



  
    
  
    useEffect(() => {
      const handleResize = () => {
        const isLaptop = window.innerWidth > 768;
        updateStatus(isLaptop); // Update Zustand state based on screen width
      };
  
      handleResize(); // Run on mount to set the initial state
      window.addEventListener("resize", handleResize);
  
      return () => window.removeEventListener("resize", handleResize); // Cleanup
    }, [updateStatus]);

  return (
    <>
      <Theme
        accentColor="blue"
        radius="rounded-none large"
        scaling="100%"
        appearance="light"
      >
        <Navbar />
        
        <Cart/>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sticky top-0">
          <div
            className="filter-box sm:col-span-12 md:col-span-3 lg:col-span-2 bg-yellow-50"
            style={{ display: status ? "block" : "none" }}
          >
            <div maxWidth="600px" className="sticky top-[40px] p-4">
              <h1 className="text-start mb-2">Filter</h1>
              <CheckboxGroup.Root
                name="example"
                onValueChange={handleCategoryChange}
              >
                <CheckboxGroup.Item value="night">Night</CheckboxGroup.Item>
                <CheckboxGroup.Item value="kids">Kids</CheckboxGroup.Item>
                <CheckboxGroup.Item value="day">day</CheckboxGroup.Item>

                <DropdownMenu.Separator />
                <CheckboxGroup.Item value="hot">hot</CheckboxGroup.Item>
                <CheckboxGroup.Item value="new">
                  New Collection
                </CheckboxGroup.Item>
                <CheckboxGroup.Item value="2025">
                  2025 Collections
                </CheckboxGroup.Item>
              </CheckboxGroup.Root>
              <DropdownMenu.Separator />
              <RadioGroup.Root
              className="flex flex-col"
                name="example"
                onValueChange={(value) => setRange(value)}
              >
                <div className="h-[2px] bg-gray-200 w-100 my-3"></div>
                <div className="flex mb-1">
                <RadioGroup.Item className="size-[16px] cursor-default rounded-full bg-white border-1 outline-none" value="">
                  <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-red-800" />
                </RadioGroup.Item>
                <label
                  className=" inline pl-2 text-[14px] text-black"
                  htmlFor="r1"
                >
                  All
                </label>

                </div>
                <div className="flex mb-1">
                <RadioGroup.Item className="size-[16px] cursor-default rounded-full bg-white border-1 outline-none" value="100">
                  <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-red-800" />
                </RadioGroup.Item>
                <label
                  className=" inline pl-2 text-[14px] text-black"
                  htmlFor="r1"
                >
                  below 100
                </label>

                </div>
                <div className="flex mb-1">
                <RadioGroup.Item className="size-[16px] cursor-default rounded-full bg-white border-1 outline-none" value="200">
                  <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-red-800" />
                </RadioGroup.Item>
                <label
                  className=" inline pl-2 text-[14px] text-black"
                  htmlFor="r1"
                >
                  101 - 200
                </label>

                </div>
                <div className="flex mb-1">
                <RadioGroup.Item className="size-[16px] cursor-default rounded-full bg-white border-1 outline-none" value="500">
                  <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-red-800" />
                </RadioGroup.Item>
                <label
                  className=" inline pl-2 text-[14px] text-black"
                  htmlFor="r1"
                >
                  201 - 500
                </label>

                </div>
                <div className="flex mb-1">
                <RadioGroup.Item className="size-[16px] cursor-default rounded-full bg-white border-1 outline-none" value="700">
                  <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-red-800" />
                </RadioGroup.Item>
                <label
                  className=" inline pl-2 text-[14px] text-black"
                  htmlFor="r1"
                >
                  501 - 700
                </label>

                </div>
                <div className="flex mb-1">
                <RadioGroup.Item className="size-[16px] cursor-default rounded-full bg-white border-1 outline-none" value="1000">
                  <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-red-800" />
                </RadioGroup.Item>
                <label
                  className=" inline pl-2 text-[14px] text-black"
                  htmlFor="r1"
                >
                  701 - 1000
                </label>

                </div>
                <div className="flex mb-1">
                <RadioGroup.Item className="size-[16px] cursor-default rounded-full bg-white border-1 outline-none" value="10000">
                  <RadioGroup.Indicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-red-800" />
                </RadioGroup.Item>
                <label
                  className=" inline pl-2 text-[14px] text-black"
                  htmlFor="r1"
                >
                  1000 Above
                </label>

                </div>
              </RadioGroup.Root>
            </div>
          </div>
          <div className="sm:col-span-12 md:col-span-9 lg:col-span-10">
            <Products selectedValues={selectedValues} rangeRadio={rangeRadio} />
          </div>
        <SignUp />
        <Profile/>
        <Login/>
        </div>
        <div style={{position:"fixed",left:"0", top:"0", width:"100vw",height:"100vh",display:loader?"block":"none",zIndex:"999",background:"rgb(18 0 0 / 89%)"}}>
            
            <div className="flex justify-center items-center w-full h-[100vh]">
                {
                loader?
                <>
                    <div role="status flex justify-center items-center mb-3">
                        {/* <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg> */}
                        <span class="sr-only">Loading...</span>
                        <p className="text-center text-white font-[bold] text-[20px]">Please Wait ...</p>
                    </div>
                </>
                :""
                }
            </div>
            
      </div>
        
      </Theme>
    </>
  );
}
export default App;
