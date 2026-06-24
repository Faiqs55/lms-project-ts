'use client'
import React from "react";
import CourseDetailsPage from "../../../Components/Course/CourseDetailsPage";
import { useParams } from "next/navigation";


const Page = () => {
    const params = useParams();    
    return (
        <div>
            <CourseDetailsPage id={params?.id as string || ""} />
        </div>
    )
}

export default Page;
 