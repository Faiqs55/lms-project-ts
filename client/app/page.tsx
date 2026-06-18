"use client";
import Header from "@/Components/Header";
import Heading from "@/utils/Heading";
import React, { FC, useState } from "react";

interface props {}

const Page: FC<props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0)
  return (
    <div className="h-full">
      <Heading
        title="ELearning"
        desc="This is the homepage of website"
        keywords="MERN, Learn, Code"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
    </div>
  );
};

export default Page;
