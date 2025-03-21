import { useCreateCourseMutation } from "@/api/courseApi";
import { Button } from "@/components/ui/button";
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategry] = useState("");
  const [loading, setLoading] = useState(false)
  // const isloading = true
  const [createCourse, { data, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const selectedCategory = (value) => {
    setCourseCategry(value);
  };

  const createCourseHandler = async () => {
    if (!courseTitle || !courseCategory) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await createCourse({ courseTitle, category: courseCategory });
      toast.success(res?.data?.message || "Course created successfully!");
      setLoading(false);
    } catch (err) {
      toast.error(err.data?.message || "Failed to create course.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "course successfully created");
      navigate("/admin/course");
    }
  }, [isSuccess]);
  return (
    <div className="mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl ">
          Let's Add Course,Add Some Basic Course Details for your New Course
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Exercitationem, est.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Course Title</Label>
          <Input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            type="text"
            name="Course_title"
            placeholder="Enter your Course Title"
          />
        </div>
        <div>
          <Label>Course Category</Label>
          <Select onValueChange={selectedCategory}>
            <SelectTrigger className="w-[200px]">
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
                <SelectItem value="IOS Development">IOS Development</SelectItem>
                <SelectItem value="Android Development">
                  Android Development
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-5">
          <Button onClick={() => navigate("/admin/Course")} variant="outline">
            Back
          </Button>
          <Button disabled={loading} onClick={createCourseHandler}>
            {loading ? (
              <>
                <Loader2 className="h-18 w-18 animate-spin" /> please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
