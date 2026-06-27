"use client";
import React, { Suspense } from 'react'
import CoursePage from './CoursePage'
import Loader from '../../Components/Loader/Loader'

const page = () => {
  return (
    <Suspense fallback={<Loader/>}>
      <CoursePage/>
    </Suspense>
  )
}

export default page