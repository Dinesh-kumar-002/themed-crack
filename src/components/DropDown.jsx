import * as React from "react";
import { DropdownMenu } from "radix-ui";
import AvatarDemo from "./AvatarDemo";
import profileToggle from "../store/profileToggle";
import myorder from "../store/myorder";
import userLoginStatus from "../store/userLoginStatus";
import loginOffcanvas from "../store/loginOffcanvas";
import cartToggle from "../store/cartToggle";
import address from "../store/address";


const DropDown = () => {
  const { cartStatusToggle, cartStatus } = cartToggle();
  const { loginOffcanvasStatusToggle, loginOffcanvasStatus } = loginOffcanvas();
  const { orderStatus, toggleMyorderStatus } = myorder();
  const { addressStatus, toggleAddressStatus } = address();
  const { profileStatus, toggleProfileStatus } = profileToggle();
  const { loginStatus, logout } = userLoginStatus();

  const handleAddressClick = () => {
    if (loginStatus) {

      if (!addressStatus) {
        cartStatus && cartStatusToggle();
        console.log(profileStatus);

        toggleMyorderStatus(false);
        // Batch state updates together
        toggleAddressStatus(true);
        if (!profileStatus) toggleProfileStatus(true);
        // toggleProfile(false);
      }
    } else {
      cartStatus && cartStatusToggle();

      if (!loginOffcanvasStatus) {
        loginOffcanvasStatusToggle();
      }
    }
  };

  const handleOrderClick = () => {
    if (loginStatus) {
      if (!orderStatus) {
          cartStatus && cartStatusToggle();
          toggleMyorderStatus(true);
          !profileStatus && toggleProfileStatus(true);
          toggleAddressStatus(false);
          // toggleProfile(false);
      }
    } else {
      cartStatus && cartStatusToggle();
      loginOffcanvasStatusToggle();
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex size-[35px] items-center justify-center outline-none"
          aria-label="Customise options"
        >
          <AvatarDemo />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[100px] bg-green-50 p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="group relative flex h-[35px] select-none items-center  pl-[25px] pr-[25px] text-[15px] leading-none text-violet11 outline-none  cursor-pointer"
            onClick={handleAddressClick}
          >
            My Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="group relative flex h-[35px] select-none items-center  pl-[25px] pr-[25px] text-[15px] leading-none text-violet11 outline-none  cursor-pointer"
            onClick={handleOrderClick}
          >
            My Orders
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="m-[5px] h-px bg-gray-500" />

          {loginStatus ? (
            <DropdownMenu.Item
              className="group relative flex h-[35px] select-none items-center justify-center text-white font-bold px-[20px] text-[15px] leading-none  outline-none  bg-red-900 cursor-pointer"
              onClick={() => {
                if (loginStatus) {
                  logout();
                  toggleProfileStatus(false);
                }
              }}
            >
              Logout
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item
              className="group relative flex h-[35px] select-none items-center justify-center text-white font-bold px-[20px] text-[15px] leading-none text-violet11 outline-none  bg-green-900 text-bold cursor-pointer"
              onClick={() => {
                !loginOffcanvasStatus ? loginOffcanvasStatusToggle() : null;
                cartStatus ? cartStatusToggle() : null;
              }}
            >
              Login
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropDown;
