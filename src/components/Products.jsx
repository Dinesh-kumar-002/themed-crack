import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Flex,
  Text,
  Card,
  TextField,
  Tabs,
  Box,
  Grid,
  Spinner,
} from "@radix-ui/themes";
import { toast } from 'react-toastify';
import FilterBox from "./FilterBox";
import productStore from "../store/productStore";
import cartStore from "../store/cartStore";
import categoryStore from "../store/categoryStore";
import cartToggle from "../store/cartToggle";
import bg from '../assets/bg.jpg'
import { Carousel, Fancybox } from '@fancyapps/ui/';
import '@fancyapps/ui/dist/carousel/carousel.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@fancyapps/ui/dist/carousel/carousel.thumbs.css';
import { Autoplay } from "@fancyapps/ui/dist/carousel/carousel.autoplay.esm.js";

function Products({ rangeRadio, selectedValues }) {
  const { cartStatus,cartStatusToggle } = cartToggle();
   const [cartItems, setCartItems] = useState([]);
  const {categories, fetchCategories} = categoryStore();
  const { products, fetchProducts,setLoader,loader} = productStore();
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceDiscount, setTotalPriceDiscount] = useState(0);
  const [view, setView] = useState(window.innerWidth > 768 ? "grid" : "list");

  const { addToCart, removeFromCart, cart ,removeSingle } = cartStore(); // Get cart from Zustand store
  const carouselRefs = useRef({});
  const [bannerData, setBannerData] = useState([]);
  
  
  const initFancyboxAndCarousel = () => {
    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
      idle: false,
      compact: false,
      dragToClose: false,
      animated: false,
      hideClass: false,
      Carousel: { 
        infinite: true,
        Autoplay: { timeout: 5000 },
      },
      Autoplay: {
        timeout: 5000,
      },
      Images: {
        zoom: false,
        Panzoom: { maxScale: 1.5 },
      },
      Toolbar: {
        absolute: true,
        display: { left: [], middle: [], right: ["close"] },
      },
      Thumbs: {
        type: "classic",
        Carousel: {
          Autoplay: { timeout: 5000 },
          axis: "x",
          slidesPerPage: 1,
          Navigation: false,
          center: true,
          fill: true,
          dragFree: true,
        },
      },
    });
  
    // Initialize Carousels
    Object.keys(carouselRefs.current).forEach((id) => {
      if (!carouselRefs.current[id]) return;
      const instance = new Carousel(
        carouselRefs.current[id],
        {
          infinite: true,
          Autoplay: { timeout: 5000 },
          Dots: false,
          Thumbs: {
            type: "classic",
            Carousel: {
              slidesPerPage: 1,
              Navigation: false,
              center: true,
              fill: true,
              dragFree: true,
            },
          },
        },
        { Autoplay } // Register Autoplay Plugin
      );
  
      // Start Autoplay manually if needed
      instance.plugins.Autoplay && instance.plugins.Autoplay.start();
    });
  };
  useEffect(() => {
    initFancyboxAndCarousel();
  }, [products, searchValue, category, rangeRadio,selectedValues]);

  useEffect(() => {
    // Merge cart items with product details
    const updatedCart = cart.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      return product ? { ...cartItem, ...product } : null;
    }).filter(Boolean); // Remove null values

    setCartItems(updatedCart);
  }, [cart, products]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalDiscount = cartItems.reduce((acc, item) => acc - ((item.price * item.quantity) - (item.quantity * (item.mrp))) , 0);
    setTotalPrice(total);
    setTotalPriceDiscount(totalDiscount);
  }, [cartItems]);


useEffect(() => {
  const fetchData = async () => {
    // console.log("before:",loader);
    fetchbanner();
    await fetchProducts();
    await fetchCategories();
    setLoader(false);
    
    // console.log("after:",loader);
    
  };
  async function fetchbanner() {
    try {
      const res = await fetch("https://admin.vmpscrackers.com/api/banner");
      const data = await res.json();
      // console.log(data);
      
      setBannerData(data);
    } catch (error) {
      // console.error("Error fetching banner:", error);
    }
  }

  fetchbanner();
  fetchData();
}, []);

  function handleSetCategory(val) {
    setSearchValue("");
    setCategory(val);
  }

  function handleSetSearchValue(val) {
    setCategory("all");
    setSearchValue(val);
  }

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchValue
      ? product.title.toLowerCase().includes(searchValue.toLowerCase())
      : true;
  
    const matchesCheckboxCategory =
      selectedValues.length > 0 ? selectedValues.includes(product.condition) : true;
  
    const matchesDropdownCategory =
      category !== "all" ? String(product.cat_id) === category : true;
  
    const matchesPrice = rangeRadio
      ? (() => {
          const productPrice = parseFloat(product.price);
          if (rangeRadio === "100") return productPrice <= 100;
          if (rangeRadio === "200") return productPrice > 101 && productPrice <= 200;
          if (rangeRadio === "500") return productPrice > 200 && productPrice <= 500;
          if (rangeRadio === "700") return productPrice > 500 && productPrice <= 700;
          if (rangeRadio === "1000") return productPrice > 700 && productPrice <= 1000;
          if (rangeRadio === "10000") return productPrice > 1000;
          return true;
        })()
      : true;
  
    return matchesSearch && matchesDropdownCategory && matchesCheckboxCategory && matchesPrice;
  });
  useEffect(() => {
    // Remove existing style tag (if any)
    const existingStyle = document.getElementById("carousel-style");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create a new <style> tag
    const styleElement = document.createElement("style");
    styleElement.setAttribute("id", "carousel-style");

    // Set dynamic styles
    styleElement.innerHTML = `
      .product-slide .f-carousel__track {
        width: ${view === "list" ? "100px" : null} !important;
      }
    `;

    // Append to <head>
    document.head.appendChild(styleElement);

    // Cleanup: Remove style tag on component unmount or `view` change
    return () => {
      if (document.getElementById("carousel-style")) {
        document.head.removeChild(styleElement);
      }
    };
  }, [view]);
  return (
    <div className="relative min-h-screen">
      <FilterBox
        setValue={handleSetSearchValue}
        selectCategory={handleSetCategory}
        searchValue={searchValue}
        setView={setView}
        category={category}
        tabView={view}
      />
      <div>
      {bannerData.length > 0 && (
        <div ref={(el) => (carouselRefs.current[0] = el)} className="f-carousel">
        {bannerData.map((banner) => (
        <div key={banner.id} className="f-carousel__slide" data-src={`https://admin.vmpscrackers.com${banner.photo}`} >
      <img src={`https://admin.vmpscrackers.com${banner.photo}`} alt="" className="w-full" style={{maxHeight:"350px",objectFit:"cover",objectPosition:"bottom center"}} />
      </div>
    ))}
      </div>
    )}
      {categories
    .filter((category) => 
      filteredProducts.some((product) => product.cat_id === category.id) 
    )
    .map((category) => {
      // Get products belonging to this category
      const categoryProducts = filteredProducts.filter(
        (product) => product.cat_id === category.id
      );
      return (
        <div key={category.id} className="px-3">
          
          <h2 className="my-5 py-2 ps-5  bg-yellow-300"><b>{category.title}</b></h2>
          <Grid
            className={view === "grid" ? "grid-view" : "list-view"}
            columns={view === "grid"
              ? { initial: "2", sm: "3", md: "4", lg: "6", xl: "6" }
              // grid grid-cols-1 gap-4
              : { initial: "1", sm: "1", md: "2", lg: "3" }}
              // grid grid-cols-1 gap-4
            gap="3"
          >
            {categoryProducts.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);
              const quantity = cartItem ? cartItem.quantity : 0;
              const result = product.photo?.split(",") || [];
              return (
                <div key={product.id} className="product-card p-0 bg-yellow-100 shadow-black" style={{boxShadow:"black 5px 5px 12px -10px"}}>
                <div ref={(el) => (carouselRefs.current[product.id] = el)} className="f-carousel relative product-slide">
                        {result.map((item, index) => (
                          <div key={index} className="f-carousel__slide" data-fancybox={`gallery-${product.id}`} data-src={`https://admin.vmpscrackers.com/${item}`}>
                            <img src={`https://admin.vmpscrackers.com/${item}`} alt={product.title}
                      style={{
                        objectFit: "cover",
                        height: view === "grid" ? "150px" : "100px",
                        width: view === "grid" ? "100%" : "100px",
                      }} className="w-full h-[150px] object-cover" />
                          </div>
                        ))}
                      </div>
                
                  <div className={` ${view === "grid" ? "p-3" : "ms-2"}`}>
                    <p className="line-clamp-1 mt-2">
                      {product.title}
                    </p>
                    <div className="flex mt-2">
                      <p className="strike price text-[12px]">
                        MRP ₹ {product.mrp}/-
                      </p>
                      <p className="real price font-extrabold text-[15px]">
                        ₹ {product.price}/-
                      </p>
                      <p className="sub-total text-white">
                        ₹ {quantity * product.price}/-
                      </p>
                    </div>
                    <div className="flex mt-3 control">
                      <button
                        
                        className="cursor-pointer flex justify-center items-center rounded-r-none focus:outline-none text-white bg-red-900 hover:bg-red-800 font-medium rounded-sm text-sm px-3.5 focus:shadow-none shadow-none"
                        color="red"
                        onClick={() => {toast.warn(`${product.title} from cart`,{position: "bottom-center",
                          autoClose: 1000});removeSingle(product.id)}}
                        disabled={quantity === 0}
                      >   -
                      </button>

                      <input
                        className=" shadow-md block w-full p-2 text-gray-900 border border-gray-300 bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
                        value={quantity}
                        // onChange={(e) => {
                        //   addToCart(product.id,product.cat_id);
                        // }}
                        disabled={true}
                        style={{ width: "35px", textAlign: "center" }}
                      />

                      <button
                      className="shadow-md cursor-pointer flex justify-center items-center rounded-l-none focus:outline-none text-white bg-green-900 hover:bg-green-800 font-medium rounded-sm text-sm px-3.5 focus:shadow-none shadow-none"
                       
                        onClick={() => {toast.success(`${product.title} is added in cart`,{position: "bottom-center",
                          autoClose: 1000});addToCart(product.id,product.cat_id)}}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </Grid>
        </div>
      );
    })
    .filter(Boolean)} {/* Remove null values from array */}
</div>

      
      <div className='flex md:hidden fixed bottom-0 z-8 w-full justify-between items-center p-3 bg-gradient-to-r from-red-900 to-red-800' >
              <button className="focus:outline-none bg-green-700 hover:bg-red-800 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 font-semibold text-white" onClick={()=>cartStatusToggle()}> View Cart</button>
              <p className="real price" style={{color:"#fff"}} size="1">you saved ₹{totalPriceDiscount}/-</p>
              <p className="real price" style={{color:"#fff"}} size="2">₹{totalPrice}/-</p>
            </div>
    </div>
    
  );
}

export default Products;
