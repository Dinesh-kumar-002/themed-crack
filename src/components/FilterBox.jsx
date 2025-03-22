import React, { useState, useEffect } from "react";
import filterToggle from "../store/filterToggle";
import axios from "axios";
import { IoSearch } from "react-icons/io5";
import { CiBoxList, CiGrid41 } from "react-icons/ci";
// import { Button, TextField, Box, Flex, Select, Tabs } from "@radix-ui/themes";
import Marquee from "react-fast-marquee";


import { Tabs } from "radix-ui";
import { MdClose } from "react-icons/md";
import { CiFilter } from "react-icons/ci";

function FilterBox({
  setValue,
  selectCategory,
  searchValue,
  setView,
  category,
  tabView,
  settingData
}) {
  const { status, toggleStatus } = filterToggle();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await axios.get(
        "https://admin.vmpscrackers.com/api/categorys"
      );
      setCategories(response.data);
    } catch (error) {}
  }

  return (
    <div
      className="mb-0 bg-white"
      style={{
        position: "sticky",
        top: "75px",
        zIndex: "2",
        padding: "10px",
        paddingBottom:"4px"
      }}
    >
      <div className="flex search mb-4" width="100%">
        
        <select
          value={category}
          onChange={(e) => selectCategory(e.target.value)}
          className="border-1 border-slate-300 p-2 me-2  bg-red-50 rounded-sm"
          style={{ maxWidth: "150px", width: "100%" }}
        >
          <option value="all">All</option>
          {categories.map((category, index) => (
            <option value={category.id.toString()} key={index}>
              {category.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search the product…"
          className="w-full p-2 rounded-sm border-1 border-slate-200 outline-0 shadow-0 border-slate-300 bg-red-50"
        />
      </div>
      <div className=" flex justify-between">
        <Tabs.Root defaultValue={tabView} className="flex flex-col">
          <Tabs.List className="flex shrink-0">
            <Tabs.Trigger
              value="list"
              onClick={() => setView("list")}
              className="flex h-[35px] flex-1 cursor-default select-none items-center justify-center bg-slate-200 px-4 text-[15px] leading-none outline-none hover:text-white data-[state=active]:text-white data-[state=active]:shadow-current data-[state=active]:bg-red-900 rounded-l-sm"
            >
              <CiBoxList className="me-2" /> List
            </Tabs.Trigger>
            <Tabs.Trigger
              value="grid"
              onClick={() => setView("grid")}
              className="flex h-[35px] flex-1 cursor-default select-none items-center justify-center bg-slate-200 px-4 text-[15px] leading-none outline-none over:text-white data-[state=active]:text-white data-[state=active]:shadow-current data-[state=active]:bg-red-900 rounded-r-sm"
            >
              <CiGrid41 className="me-2" /> Grid
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <button
          className="bg-red-900 block md:!hidden text-white focus:outline-none font-medium rounded-sm text-md px-5 h-[35px]"
          style={{ width: "max-content" }}
          onClick={toggleStatus}
        >
          {status ? (
            <MdClose />
          ) : (
            <>
              Filter <CiFilter style={{display:"inline"}}/>
            </>
          )}
        </button>
      </div>
        <Marquee className="mt-2">
              {/* <h5 className="text-bold text-green-700"> */}
                <div className="text-bold text-green-800" dangerouslySetInnerHTML={{ __html: settingData.description }}></div>
                {/* </h5> */}
        </Marquee>
    </div>
  );
}

export default FilterBox;
