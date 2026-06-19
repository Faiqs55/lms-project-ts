"use client";
import Header from "@/Components/Header";
import Hero from "@/Components/Root/Hero";
import Heading from "@/utils/Heading";
import React, { FC, useState } from "react";

interface props {}

const Page: FC<props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login")
  return (
    <div className="h-full">
      <Heading
        title="ELearning"
        desc="This is the homepage of website"
        keywords="MERN, Learn, Code"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
      <Hero/>
    </div>
  );
};

export default Page;
