import React from "react";
import { Navigate} from "react-router-dom";
import Cookies from "universal-cookie";


const PrivateRoute=({children})=>{
  const cookies = new Cookies();
  let token = cookies.get("TOKEN");
  return(
    <>
      {!token ?<Navigate to="/auth"/>:children}
    </>
  )
}

export default PrivateRoute;
