import Link from "next/link";
import React, { FC } from "react";

interface Props {
  activeItem: number;
  isMobile: boolean;
}

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
];

const NavItems: FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData.map((i, index) => (
          <Link href={i.url} key={index} passHref>
            <span
              className={`${activeItem === index ? "dark:text-[#37a39a] text-[crimson]" : "dark:text-white text-black"} text-[18px] px-6 font-poppins font-normal`}
            >
              {i.name}
            </span>
          </Link>
        ))}
      </div>

      {isMobile && (
        <div className="800px:hidden mt-5 z-[100000000000000]">
            {navItemsData &&
              navItemsData.map((i, index) => (
                <Link href={i.url} passHref key={index}>
                  <span
                    className={`${activeItem === index
                        ? "dark:text-[#37a39a] text-[crimson]"
                        : "dark:text-white text-black"
                      } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                  >
                    {i.name}
                  </span>
                </Link>
              ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
