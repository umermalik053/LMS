import { useGetPurchaseCourseQuery } from "@/api/purchaseApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { data, isLoading, isSuccess, isError } = useGetPurchaseCourseQuery();
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-600">
          An error occurred while fetching purchase course data.
        </p>
      </div>
    );
  const { purchasedCourses } = data || [];
  console.log(purchasedCourses)

  const courseData = purchasedCourses?.map((course)=>{
        if(course.courseId){
      return {
        name: course?.courseId?.courseTitle,
        price: course?.courseId?.coursePrice    
      }
    }
  })

  const totalRevenue = purchasedCourses?.reduce((acc,element)=> {
 
      return acc + element?.courseId?.coursePrice || 0;
   
  },0)
  const totalSales = purchasedCourses?.map((element)=>{
    let count = 0
    if(element?.courseId){
      ++count;
    }
    return count;
  })
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">Pkr {totalRevenue}</p>
        </CardContent>
      </Card>
      {/* Course Prices Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30} // Rotated labels for better visibility
                textAnchor="end"
                interval={0} // Display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value, name) => [`PKR ${value}`, name]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2" // Changed color to a different shade of blue
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
