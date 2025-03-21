import CourseSkeleton from "@/components/CourseSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useLoadUserQuery, useUpdateProfileMutation } from "@/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const [UserName, setUserName] = useState("");
  const [photo, setphoto] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isloading , refetch } = useLoadUserQuery();

  const [
    UpdateProfile,
    {
      data: updateUserData,
      
      isSuccess,
      isloading: updateUserIsloading,
      isError,
      error
    },
  ] = useUpdateProfileMutation();
 


  useEffect(() => {
    if (isSuccess) {
      toast.success(updateUserData?.message || "Profile updated successfully");
      refetch(); // Refetch user data after a successful update
      setIsDialogOpen(false);
    }
    if (isError) {
      toast.error(error?.message || "Error updating profile");
    }
  }, [isSuccess, isError, refetch]);
  if (isloading) {
    return (
      <h1 className="mx-auto font-extrabold text-3xl">please Wait.....</h1>
    );
  }
  if (!data?.data) {
    return <h1 className="mx-auto font-extrabold text-3xl">No user data available</h1>;
  }
  const { email, enrolledCourses , name, photoURL, role } = data?.data || {};
  console.log(enrolledCourses)
  const handleOnChange = (e) => {
    const file = e.target.files?.[0];
    console.log(photo);
    if (file) {
      setphoto(file); // Update state with the file object
      console.log("Selected file:", file);
    } else console.log("No file selected");
  };

  const handleUserUpdate = () => {
    const formData = new FormData();
    formData.append("name", UserName);
    formData.append("photoUrl", photo);
    UpdateProfile(formData);
  };


  return (
    <div className="max-w-5xl mx-auto px-4 my-24 ">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center ">
          <Avatar className=" h-24 w-24 md:h-32 md:w-32 mb-4 cursor-pointer ">
            <AvatarImage src={photoURL} alt="Profile Image" />
            <AvatarFallback>{name?.charAt(0) || "CN"}</AvatarFallback>
          </Avatar>
        </div>
        <div className="">
          <div className="mb-2 ">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {name}
              </span>
            </h1>
          </div>
          <div className="mb-2 ">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {email}
              </span>
            </h1>
          </div>
          <div className="mb-2 ">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2" onClick={() => setIsDialogOpen(true)}>
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Your Name"
                    className="col-span-3"
                    value={UserName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 ">
                  <Label htmlFor="name" className="text-right ">
                    Profile Photo
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="col-span-3 cursor-pointer"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsloading}
                  type="submit"
                  onClick={handleUserUpdate}
                >
                  {updateUserIsloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      please wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="">
        <h1 className="font-medium text-lg ">Courses you're Enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {enrolledCourses.length == 0 ? (
            <h1>You Haven't enrolled yet</h1>
          ) : isloading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : (
            enrolledCourses.map((course) => (
              <CourseCard Course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
