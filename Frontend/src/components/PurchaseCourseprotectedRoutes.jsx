import { useGetCourseDetailWithStatusQuery } from '@/api/purchaseApi'
import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

export const PurchaseCourseprotectedRoutes = ({children}) => {
  const {courseId} = useParams()
  const {data,isLoading} = useGetCourseDetailWithStatusQuery(courseId)
  
  if(isLoading) {
    return( 
    <div  className='h-full w-full flex justify-center items-center'>
        <Loader2 size={64} className="animate-spin" />
  
    </div>)
  }
  return data?.purchase? children : <Navigate to={`/course-detail/${courseId}`} />

}


