import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({Course}) => {
  const navigate = useNavigate()
  return (
    <div>
      <Card onClick={()=>navigate(`/course-detail/${Course._id}`)} className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer  ">
        <div className="relative">
          <img
            src={Course?.courseThumbnail || "https://img-c.udemycdn.com/course/750x422/5687912_e3cf_14.jpg"}
            alt="Course Image"
            className="w-full h-36 object-cover rounded-t-lg "
          />
        </div>
        <CardContent className="px-6 py-4 space-y-3">
          <h3 className="hover:underline font-bold text-lg truncate cursor-pointer">
           {Course?.courseTitle}
          </h3>
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 ">
            <Avatar className="cursor-pointer h-8 w-8 ">
              <AvatarImage
                src={Course?.creator?.photoURL}
                alt="instructor Image"
              />
              <AvatarFallback>{Course?.creator?.name?.charAt(0) || "CN"}</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">{Course?.creator?.name || "CN"}</h1>
          </div>
          <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full hover:bg-blue-600 '}>
           {Course?.courseLevel || "Easy"         }
          </Badge>
          </div>
          <div className="text-lg font-bold">
            <span>PKR {Course?.coursePrice || "NA"} </span>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCard;
