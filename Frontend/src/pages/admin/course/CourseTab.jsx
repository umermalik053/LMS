import {
  useDeleteLectureAndCourseMutation,
  useGetCoursesByIdQuery,
  usePublishToggleMutation,
  useUpdateCoursesMutation,
} from "@/api/courseApi";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    courseTitle: "",
    SubTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: 0,
    courseThumbnail: "",
  });
  const [isloading, setIsLoading] = useState(false)
  const [deleteLectureAndCourse] = useDeleteLectureAndCourseMutation()

  const [updateCourses, { isloading:updateLoading, isSuccess, error }] =
    useUpdateCoursesMutation();
  const { data, isloading: getLoading } = useGetCoursesByIdQuery(courseId);
  useEffect(() => {
    if (data?.data) {
      setInput({
        courseTitle: data.data.courseTitle || "",
        SubTitle: data.data.subTitle || "",
        description: data.data.description || "",
        category: data.data.category || "",
        courseLevel: data.data.courseLevel || "",
        coursePrice: data.data.coursePrice || "",
        courseThumbnail: data.data.courseThumbnail || "",
      });
      setPreview(data.data.courseThumbnail || null);
    }

  }, [courseId, data]);
  const fileInputRef = useRef(null);
  const [Preview, setPreview] = useState();
  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const handleSelect = (value) => {
    setInput({ ...input, category: value });
  };
  const handleSelectLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreview(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };
  const [publishToggle] = usePublishToggleMutation()
  const handleSave = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("courseTitle", input.courseTitle);
      formData.append("subTitle", input.SubTitle); // Correct key
      formData.append("description", input.description);
      formData.append("category", input.category);
      formData.append("courseLevel", input.courseLevel);
      formData.append("coursePrice", input.coursePrice);

      if (input.courseThumbnail instanceof File) {
        formData.append("courseThumbnail", input.courseThumbnail);
      } else {
        console.error("Invalid file for courseThumbnail");
      }
      await updateCourses({ courseData: formData, CourseId: courseId });
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to update course."
      );
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(updateCourses?.message || "Course updated successfully!");
      navigate("/admin/Course"); // Uncomment if redirection is needed
      setInput({
        courseTitle: "",
        SubTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: 0,
        courseThumbnail: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
    if (error) {
      toast.error(error?.message || "Failed to update course.");
    }
    setIsLoading(false)
  }, [isSuccess, error]);

  const handlepublish = async (status) => {
   try {
       const response =await publishToggle({courseId:courseId , publish:status})
       handleSave()
       if (response.data){
         toast.success(response.data.message);
       }
       if(response?.error){
         toast.error(response.error.data.message);

       }
    
   } catch (error) {
    console.log(error);
     console.error("Error publishing course:", error);
     toast.error(
       error?.data?.message || error?.message || "Failed to publish course."
     );
    
   }
  }
  const handleDeleteCourse = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await deleteLectureAndCourse( courseId );
        if (response?.data) {
          toast.success(response?.data?.message);
          navigate("/admin/course");
        }
        if(response?.error) {
          toast.error(response?.error?.data?.message);

        }
      
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error(
          error?.data?.message || error?.message || "Failed to delete course."
        );
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-center flex-wrap sm:justify-between">
        <div className="">
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Makes Changes To Your Courses Here.Click Save When You're Done
          </CardDescription>
        </div>
        <div className="space-x-3 space-y-2 m-0">
          <Button  variant="outline" onClick={()=> handlepublish(data.data.isPublished ? 'false' : 'true')}>
            {data?.data?.isPublished ? "Unpublished" : "Published"}
          </Button>
          <Button onClick={handleDeleteCourse}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5 flex-wrap">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              placeholder="Eg. MERN Stack Developer"
              value={input.courseTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Sub Title</Label>
            <Input
              type="text"
              name="SubTitle"
              placeholder="Eg. Become a MERN stack Developer Zero To Hero"
              value={input.SubTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex gap-5 items-center flex-wrap justify-center sm:justify-start">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={handleSelect}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Course Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="CSS">CSS</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Mern Stack">Mern Stack</SelectItem>
                    <SelectItem value="Mean Stack">Mean Stack</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="Angular">Angular</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Vue">Vue</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Backend Development">
                      Backend Development
                    </SelectItem>
                    <SelectItem value="Mobile Application">
                      Mobile Application
                    </SelectItem>
                    <SelectItem value="IOS Development">
                      IOS Development
                    </SelectItem>
                    <SelectItem value="Android Development">
                      Android Development
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 ">
              <Label>Course Level</Label>
              <Select onValueChange={handleSelectLevel}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Course Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Course Price</Label>
              <Input
                type="number"
                name="coursePrice"
                placeholder="Enter Course Price in PKR"
                value={input.coursePrice}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              name="courseThumbnail"
            />
            {Preview && (
              <div className="">
                <img src={Preview} alt="thumbnail" className="w-52 my-8" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 ">
            <Button onClick={() => navigate("/admin/Course")} variant="outline">
              Cancel
            </Button>
            <Button  onClick={handleSave} disabled={isloading}>
              {isloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
