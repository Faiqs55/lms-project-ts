 'use client'
import CourseContent from "../../../Components/Course/CourseContent";
import Loader from "../../../Components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
    params:any;
}

const Page = () => {
    const id = useParams().id || "";
  const { isLoading, error, data,refetch } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data) {
      const isPurchased = data.user.courses.find(
        (item: any) => item.courseId === id
      );
      if (!isPurchased && data.user.role !== "admin") {
        redirect("/");
      }
    }
    if (error) {
      redirect("/");
    }
  }, [data,error]);

  return (
   <>
   {
    isLoading ? (
        <Loader />
    ) : (
        <div>
          <CourseContent id={id as string} user={data.user} />
        </div>
    )
   }
   </>
  )
}

export default Page