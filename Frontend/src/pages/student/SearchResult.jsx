import { Badge } from '@/components/ui/badge';
import React from 'react'
import { Link } from 'react-router-dom'

const SearchResult = ({course}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
          <Link
            to={`/course-detail/${course?._id}`}
            className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
          >
            <img
              src={course?.courseThumbnail || "https://res.cloudinary.com/dpykfgymv/image/upload/v1740351567/cbsq2gg6tiqkegy5apwd.jpg"}
              alt="course-thumbnail"
              className="h-32 w-full md:w-56 object-cover rounded"
            />
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-lg md:text-xl">{course?.courseTitle || "Course Title"}</h1>
              <p className="text-sm text-gray-600">{course?.subTitle || "Course SubTitle"}</p>
              <p className="text-sm text-gray-700">
                Intructor: <span className="font-bold">{course?.creator?.name || "CN"}</span>{" "}
              </p>
              <Badge className="w-fit mt-2 md:mt-0">{course?.courseLevel || "Medium"}</Badge>
            </div>
          </Link>
          <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
            <h1 className="font-bold text-lg md:text-xl">PKR {course?.coursePrice}</h1>
          </div>
        </div>
      );
}

export default SearchResult
