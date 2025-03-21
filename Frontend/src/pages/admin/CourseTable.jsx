import { useGetAllCoursesQuery } from '@/api/courseApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CourseTable = () => {
  const navigate = useNavigate()
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]
  const {data,isLoading} = useGetAllCoursesQuery()

  if(isLoading) return <div>Loading...</div>

  
  
  return (
    <div className=''>
     <Button onClick={()=>navigate('create')}>Add Course</Button>
     <Table className="mt-12">
      <TableCaption>A list of your recent Courses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.map((courses) => (
          <TableRow key={courses._id}>
            <TableCell className="font-medium">{courses?.coursePrice? `Pkr ${courses?.coursePrice}` : "NA"}</TableCell>
            <TableCell><Badge>{courses.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
            <TableCell>{courses.courseTitle}</TableCell>
            <TableCell className="text-right">
              <Button size='sm' variant="ghost" onClick={()=>navigate(`${courses._id}`)}>Edit<Edit/></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>

      </TableFooter>
    </Table>
    </div>
  )
}

export default CourseTable
