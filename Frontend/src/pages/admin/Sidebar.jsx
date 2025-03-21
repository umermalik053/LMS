import { ChartNoAxesColumn, SquareLibrary } from 'lucide-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Sidebar = () => {

  return (
    <div className="flex">
  <div className='hidden lg:block  w-[250px] sm:w-[300px] space-y-8 border-gray-300 dark:border-gray-700  bg-[#f0f0f0] dark:bg-[#1A1A1A] p-5 sticky  top-0 h-screen '>
      <div className="mt-20 space-y-4">
        <Link className='flex items-center gap-2' to={"/admin/dashboard"}><ChartNoAxesColumn size={22}/>
        <h1>Dashboard</h1>
        </Link>
        <Link className='flex items-center gap-2' to={"/admin/Course"} ><SquareLibrary size={22}/>
        <h1>Courses</h1>
        </Link>
      </div>
      
    </div>
    <div className='flex-1 mt-24 md:mt-0 px-4  md:p-24 p-2 ' >
        <Outlet/>
      </div>
    </div>
  
  )
}

export default Sidebar




