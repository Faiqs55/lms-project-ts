'use client'
import React from 'react'
import AdminSidebar from "../../../../Components/Admin/Sidebar/AdminSidebar";
import Heading from '../../../../utils/Heading';
import DashboardHeader from '../../../../Components/Admin/DashboardHeader';
import EditCourse from "../../../../Components/Admin/course/EditCourse";
import { useParams } from 'next/navigation';

type Props = {}

const Page = () => {
    const id = useParams().id as string;    

  return (
    <div>
        <Heading
         title="Elearning - Admin"
         desc="ELearning is a platform for students to learn and get help from teachers"
         keywords="Prograaming,MERN,Redux,Machine Learning"
        />
        <div className="flex">
            <div className="1500px:w-[16%] w-1/5">
                <AdminSidebar />
            </div>
            <div className="w-[85%]">
               <DashboardHeader />
               <EditCourse id={id} />
            </div>
        </div>
    </div>
  )
}

export default Page