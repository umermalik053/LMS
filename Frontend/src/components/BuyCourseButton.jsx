import React, { useState } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionsMutation,  } from "@/api/purchaseApi";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession,{data}] = useCreateCheckoutSessionsMutation();
  const [loading, setLoading] = useState(false);
  const handleBuyCourse = async () => {
    setLoading(true);
    try {
      const response = await createCheckoutSession(courseId)
      setLoading(false);
      console.log(response);
      if(response.error){
        toast.error(response.error.data.message)
      }
      if(response.data){
        toast.success(response.data.message)
        window.location.href = response.data.url; // Redirect to checkout page
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
      // handle error here
    }

  };
  

  return (
    <Button disabled={loading} onClick={handleBuyCourse} className="w-full">
      {
        loading? (
        <>
         <Loader className="mr-2 h-4 w-4 animate-spin"/> Loading...
        </> 
        ): "Purchase Course"
      }
    </Button>
  );
};

export default BuyCourseButton;
