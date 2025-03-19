import React,{useEffect} from "react";
import { Avatar ,Tooltip } from "radix-ui";
import Cookies from "universal-cookie";
import userLoginStatus from "../store/userLoginStatus";
import './avatar.css'
import { IoPerson } from "react-icons/io5";


const AvatarDemo = () => {
	const {loginStatus,loginUserEmail}=userLoginStatus();
	
return(

	<div>
		
		<Avatar.Root className="inline-flex size-[35px] select-none items-center justify-center overflow-hidden rounded-full align-middle me-4 bg-white shadow-sm cursor-pointer">
			<Avatar.Fallback className="leading-1 flex size-full text-slate-700 items-center justify-center text-[16px] font-medium">
			{ loginStatus?loginUserEmail.slice(0,2):<IoPerson />}	
			</Avatar.Fallback>
		</Avatar.Root>
	
	</div>

);
}
	

export default AvatarDemo;
