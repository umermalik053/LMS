import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const EditLecture = () => {
    const {lectureId , courseId} = useParams()

  return (
    <div className='space-y-4'>
 <div className='flex items-center justify-between'>
        <div className="flex items-center gap-2">
            <Link to={`/admin/course/${courseId}/lecture`}>
            <Button size="icon" variant='outline'><ArrowLeft size={16}/></Button>
            </Link>
            <h1 className='font-bold text-xl'>Update Your Lecture</h1>
        </div>
       
    </div>
     {/* Add form to edit lecture details */}
     <LectureTab/>
    </div>
   
  )
}

export default EditLecture
