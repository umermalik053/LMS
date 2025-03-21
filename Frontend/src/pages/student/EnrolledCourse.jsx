import CourseSkeleton from "@/components/CourseSkeleton";
import React from "react";
import CourseCard from "./CourseCard";
import { useLoadUserQuery } from "@/api/authApi";

const EnrolledCourse = () => {
  const {data,isLoading} = useLoadUserQuery()
  const array = data?.data?.enrolledCourses;
  
  return (
    <div className="max-w-5xl mx-auto my-24 px-4 md:px-1">
      <h1 className="font-bold text-2xl">Enrolled Courses</h1>
      <div className="my-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
           [1,2,3,4,5,6].map((_, i) =>  <CourseSkeleton key={i} />)
          ) : array?.length == 0 ? (
            <p className="text-center text-gray-500">No courses found.</p>
          ) : (
            array?.map((courses, index) => (
              <CourseCard Course={courses} key={index} />
            ))
            // <CourseCard />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourse;
