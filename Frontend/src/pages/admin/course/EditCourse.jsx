import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'

const EditCourse = () => {
  return (
    <div className='flex-1 '>
        <div className="flex items-center justify-between mb-5 ">
            <h1 className='font-bold text-xl'>Add Details Information Regarding Course</h1>
            <Link to="lecture">
            <Button className="hover:text-blue-500 hover:underline transition-all ease-in-out duration-1000" variant="Link">Go To Lecture Page</Button>
            </Link>
        </div>
        <CourseTab />
      
    </div>
  )
}

export default EditCourse
