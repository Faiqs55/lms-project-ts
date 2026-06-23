"use client";
import FAQ from "@/Components/FAQ/FAQ";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import Courses from "@/Components/Root/Courses";
import Hero from "@/Components/Root/Hero";
import Reviews from "@/Components/Root/Reviews";
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
      <Courses/>
      <Reviews/>
      <FAQ/>
      <Footer/>
    </div>
  );
};

export default Page;
