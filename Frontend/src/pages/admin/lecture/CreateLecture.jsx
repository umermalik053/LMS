import { useCreateLectureMutation, useGetAllLecturesByCourseIdQuery } from '@/api/lectureApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const [lectureTitle,setLectureTitle] = useState("")
    const {courseId} = useParams()
    const navigate = useNavigate()
    const [createLecture , {data,isSuccess,error}] = useCreateLectureMutation()
    const {data:getData, isloading:getloading} = useGetAllLecturesByCourseIdQuery(courseId)
    const [isloading, setIsLoading] = useState(false)
    const createLectureHandler = async () => {
       setIsLoading(true)
       if(!lectureTitle){
         toast.error("Lecture Title is required..")
         setIsLoading(false)
         return;
       }
      await createLecture({ courseData: {lectureTitle}, CourseId: courseId });
      setLectureTitle("")
       setIsLoading(false)
     }
     useEffect(()=>{
       if(error){
         toast.error(error?.data?.message || "Failed to create lecture")
       }
       if(isSuccess){
         toast.success(data?.message || "Lecture created successfully")
       }
       setIsLoading(false)
      },[error,isSuccess,data])



  return (
    <div className="mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl ">
          Let's Add Lecture,Add Some Basic Lecture Details for your New Lecture
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Exercitationem, est.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Lecture Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            name="lectureTitle"
            placeholder="Enter your Lecture Title"
          />
        </div>
        <div className="flex items-center gap-5">
          <Button onClick={() => navigate(`/admin/Course/${courseId}`)} variant="outline">
            Back to Course
          </Button>
          <Button disabled={isloading} onClick={createLectureHandler}>
            {isloading ? (
              <>
                <Loader2 className="h-18 w-18 animate-spin" /> please wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-10">
          <div>
            <h2 className="font-bold text-xl mb-4">
              Lectures in this Course
            </h2>
          {
            getloading ? (
              <>
                 <Loader2 className="h-18 w-18 animate-spin" />" Loading lectures..."
           
              </>
            ) : getData?.data?.length === 0 ? (
              <>
              <div className="">
                <h3>no Course Found</h3>
              </div>
              </>
            ) : getData?.data?.map((lecture , index)=>{
              // console.log(lecture._id)
              return <Lecture index={index} key={lecture._id} lecture={lecture} courseId={courseId}/>
 
            })
          }
          </div>

      </div>
    </div>
  )
}

export default CreateLecture
