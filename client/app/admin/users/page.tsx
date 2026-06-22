'use client'
import DashboardHero from '../../../Components/Admin/DashboardHero'
import AdminProtected from '../../../hooks/adminProtected'
import Heading from '../../../utils/Heading'
import React from 'react'
import AdminSidebar from "../../../Components/Admin/Sidebar/AdminSidebar";
import AllUsers from "../../../Components/Admin/Users/AllUsers";

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Admin"
          desc="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <AllUsers />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default page