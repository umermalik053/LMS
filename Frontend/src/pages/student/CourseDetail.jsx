import { useGetCourseDetailWithStatusQuery } from "@/api/purchaseApi";
import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
    const {courseId} = useParams()
    const {data,isLoading , isError} = useGetCourseDetailWithStatusQuery(courseId);
    const navigate = useNavigate()
    
    if(isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 size={64} className="animate-spin" />
        </div>
      )
    } else if (isError){
      return (
        <div className="flex justify-center items-center h-screen">
          <p>An error occurred while fetching the course details.</p>
        </div>
      )
    }

    const {course, purchase} = data;
    const handleContinueCourse = () =>{
      if (!courseId) {
        console.error("Course ID is missing.");
        return;
      }
    
      navigate(purchase ? `/course-progress/${courseId}` : `/course-detail/${courseId}`);

    }
 
   
 
    
  return (
    <div className="mt-20 space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2 ">
          <h1 className="font-bold text-2xl md:text-3xl">{course?.courseTitle || "Course Title is not given"}</h1>
          <p className="text-base md:text-lg">{course?.subTitle || null}</p>
          <p>
            Created By {}{" "}
            <span className="text-[#4b56f0] underline italic">
              {course?.creator?.name || course?.creator?.email}  
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.updatedAt.split("T")[0] || course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Student Enrolled: {course?.enrolledStudent.length || 0}</p>

        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5 ">
          <h1 className="font-bold text-xl md:text-2xl ">Description</h1>
          <p className="text-sm" dangerouslySetInnerHTML={{__html: course?.description}} />
            
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{course?.lecture.length} Lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
              {course?.lecture.map((item, index) => {
                return (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span>
                      {item?.isPreviewFree ? <PlayCircle size={14} /> : <Lock size={14} />}
                    </span>
                    <p>{item?.lectureTitle}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3 py-2">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                width={'100%'}
                height={'100%'}
                url={course.lecture[0].videoLink}
                controls={true}
                />
              </div>
              <h1>{course.lecture[0].lectureTitle}</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">PKR {course.coursePrice}</h1>
            </CardContent>
            <CardFooter className='flex justify-center p-4'>
                {
                    purchase ? (
                    <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
                  ) : (
                    <BuyCourseButton courseId={courseId}/>
                  )
                }
              
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
