import{ Skeleton}  from "./ui/skeleton";
import React from 'react'

const CourseSkeleton = ()=>{
    return(
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
        <Skeleton className="2-full h-36"/>
        <div className="px-5 py-4 space-y-3 ">
            <Skeleton className="h-6 w-3/4"/>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full"/>
                    <Skeleton className="h-4 w-4"/>

                </div>
                <Skeleton className="h-4 w-16"/>
            </div>
            <Skeleton className="h-4 w-1/4"/>
        </div>
      </div>
    )
}

export default CourseSkeleton;