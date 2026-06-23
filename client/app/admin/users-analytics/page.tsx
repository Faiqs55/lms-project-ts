'use client'
import React from 'react'
import AdminSidebar from "../../../Components/Admin/Sidebar/AdminSidebar";
import Heading from '../../../utils/Heading';
import UserAnalytics from "../../../Components/Admin/Analytics/UserAnalytics";
import DashboardHeader from '../../../Components/Admin/DashboardHeader';


type Props = {}

const page = (props: Props) => {
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
               <UserAnalytics />
            </div>
        </div>
    </div>
  )
}

export default page