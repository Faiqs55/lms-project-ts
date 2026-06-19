import Link from "next/link";
import React, { FC, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "@/utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "@/utils/CustomModel";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import avatar from "../public/avatar.jpg"

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
}
const Header: FC<props> = ({ open, setOpen, activeItem, route, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSideBar(false);
      }
    }
  }

  return (
    <div className="w-full relative z-50">
      <div
        className={`${active ? "dark:bg-opacity-50 dark:bg-linear-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[100000000000] dark:border-[#ffffff1c] shadow-xl transition duration-500" : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"}`}
      >
        <div className="w-[95%] 800px:w-[92%] mx-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-poppins font-medium text-black dark:text-white`}
              >
                ELearning
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* Toggle Hamburger  */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSideBar(true)}
                />
              </div>
              {userData ? (
                <Link href={"/profile"}>
                  <Image
                    src={userData?.user.avatar ? userData.user.avatar.url : avatar}
                    alt=""
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer hidden 800px:block"
                    style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        {/* mobile sidebar */}
        {
          openSideBar && (
            <div
              className="fixed w-full h-screen top-0 left-0 Z-[99999] dark:bg-[unset] bg-[#00000024] "
              onClick={handleClose}
              id="screen">
              <div className="w-[70%] fixed z-[999999999999999999] h-screen bg-white dark:bg-slate-900 dark: bg-opacity-90 top-0 right-0">
                <NavItems activeItem={activeItem} isMobile={true} />
                {userData ? (
                  <Link href={"/profile"}>
                    <Image
                      src={userData?.user.avatar ? userData.user.avatar.url : avatar}
                      alt=""
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] rounded-full cursor-pointer ml-6"
                      style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                    />
                  </Link>
                ) : (
                  <HiOutlineUserCircle
                    size={25}
                    className="hidden 800px:block cursor-pointer dark:text-white text-black"
                    onClick={() => setOpen(true)}
                  />
                )}              
                </div>
            </div>
          )}
      </div>

      {route === "Sign-up" && (
        <>
          <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={SignUp} /></>
      )}
      {route === "Login" && (
        <>
          <CustomModel open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Login} />
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}

    </div>
  );
};

export default Header;
