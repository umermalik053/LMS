import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import CourseSkeleton from "@/components/CourseSkeleton";
import { useGetPublishedCoursesQuery } from "@/api/courseApi";

const Courses = () => {
  const [isloading,setIsLoading] = useState(true)
  const { data,refetch } = useGetPublishedCoursesQuery();
  useEffect(() => {
    setIsLoading(true)
    refetch()
     .finally(() => setIsLoading(false))
  }, [])
    

  return (
    <div className="bg-gray-50 dark:bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6 ">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {isloading
            ? Array.from({ length: 8 }).map((_, index) => {
                return <CourseSkeleton key={index} />;
              })
            : data?.data?.map((item, index) => (

                <CourseCard Course={item} key={index} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
