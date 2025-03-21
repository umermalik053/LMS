import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateCourseProgressMutation,
} from "@/api/courseProgressApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, CirclePlay, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Courseprogress = () => {
  const [loading,setLoading] = useState(false)
  const [firstLecture, setFirstLecture] = useState(null);
  const { courseId } = useParams();
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateCourseProgress] = useUpdateCourseProgressMutation();
  const [completeCourse, { data: markComplete }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInComplete }] =
    useInCompleteCourseMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  } else if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>An error occurred while fetching the course progress</p>
      </div>
    );
  }
  const { courseDetail, data: ProgressData, completed } = data;
  const { courseTitle } = courseDetail;

  const initialiseLecture =
    firstLecture || (courseDetail.lecture && courseDetail.lecture[0]);

  const isLectureCompleted = (lectureId) => {
    return ProgressData?.some(
      (prog) => prog.lectureId === lectureId && prog.viewed
    );
  };
  const handleLectureProgress = async (lectureId) => {
    try {
      const response = await updateCourseProgress({ courseId, lectureId });
      refetch();
    } catch (error) {
      console.error("Error updating course progress", error);
    }
  };
  const handleSelectLecture = (lecture) => {
    setFirstLecture(lecture);
    handleLectureProgress(lecture._id);
  };
  
  const handleCompleteCourse = async () => {
    setLoading(true);
    try {
      const response = await completeCourse(courseId);

      refetch();
      setLoading(false);
      if (response?.data) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Error completing course", error);
      toast.error(error?.data?.message);
      setLoading(false)
    }
  };
  const handleIncompleteCourse = async () => {
    setLoading(true);
    try {
      const response = await inCompleteCourse(courseId);
      if (response?.data) {
        toast.success(response?.data?.message);
       
      }
      refetch();
      setLoading(false);
    } catch (error) {
      console.error("Error incomplete course", error);
      toast.error(error?.data?.message);
      setLoading(false)
    }
  };

  return (
    <div className="mt-20 max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">{courseTitle}</h1>
        <Button
          disabled={loading}
          variant={completed ? "outline " : "default"}
          onClick={completed ? handleIncompleteCourse : handleCompleteCourse}
        >
         { loading ? "please wait..." :
          completed? <div className="flex items-center gap-2">
            <CheckCircle/> <span>Completed</span>
          </div> : "Mark As Completed"
         }
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              width="100%"
              height="100%"
              className="rounded-md md:rounded-lg"
              controls
              onPlay={() =>
                handleLectureProgress(
                  firstLecture?._id || initialiseLecture?._id
                )
              }
              src={
                firstLecture?.videoLink ||
                initialiseLecture?.videoLink ||
                "https://example.com/video.mp4"
              }
            />
          </div>
          <div className="mt-2 ">
            <h3 className="font-medium text-lg">{`Lecture ${
              courseDetail?.lecture.findIndex(
                (lec) =>
                  lec._id === (firstLecture?._id || initialiseLecture?._id)
              ) + 1
            } : ${
              firstLecture?.lectureTitle || initialiseLecture?.lectureTitle
            }`}</h3>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-2/5 border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetail?.lecture?.map((lecture) => {
              return (
                <Card
                  onClick={() => handleSelectLecture(lecture)}
                  key={lecture._id}
                  className={`mb-3 hover:cursor-pointer transition transform ${
                    lecture?._id == firstLecture?._id
                      ? "bg-gray-200"
                      : "dark:bg-gray-700"
                  }`}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {isLectureCompleted(lecture._id) ? (
                        <CheckCircle2
                          size={24}
                          className="text-green-500 mr-2"
                        />
                      ) : (
                        <CirclePlay size={24} className="text-gray-500 mr-2" />
                      )}
                      <div>
                        <CardTitle className="text-lg font-medium">
                          {lecture?.lectureTitle}
                        </CardTitle>
                      </div>
                    </div>
                    {isLectureCompleted(lecture._id) && (
                      <Badge
                        variant={"outline"}
                        className="bg-green-200 text-green-600"
                      >
                        Completed
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courseprogress;
