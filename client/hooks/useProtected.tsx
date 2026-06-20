import { redirect } from "next/navigation";
import UserAuth from "./userAuth";
import React from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "../Components/Loader/Loader";

interface ProtectedProps{
    children: React.ReactNode;
}

export default function Protected({children}: ProtectedProps){
   const {data, isLoading} = useLoadUserQuery(undefined, {});

   if(isLoading){
    return <Loader/>
   }

   const isAuthenticated = !!data?.user;

    return isAuthenticated ? children : redirect("/");
}