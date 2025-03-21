import { useDeleteLectureMutation, useGetLectureByIdQuery, useUpdateLectureMutation } from "@/api/lectureApi";
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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const LectureTab = () => {
  const navigate = useNavigate()
  const { courseId, lectureId } = useParams();
  const [title, setTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const Media_Api = "http://localhost:8080/api/v1/media";
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${Media_Api}/uploadMedia`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded / total) * 100));
          },
        });
        if (res.data) {
          setUploadVideoInfo({
            videoUrl: res.data?.data.url,
            publicId: res.data?.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data?.message);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
        toast.error("video upload Failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const [updatelecture, { data, error, isloading, isSuccess }] =
    useUpdateLectureMutation();

    const [deleteLecture] = useDeleteLectureMutation()
    const {data:getLectureById} = useGetLectureByIdQuery(lectureId)
    useEffect(() => {
      if(getLectureById?.data){
        setTitle(getLectureById.data?.lectureTitle)
        setIsFree(getLectureById.data?.isPreviewFree)
        setUploadVideoInfo(getLectureById.data?.videoInfo)
      }
    },[getLectureById])
  
  const deleteLectureHandler = async () => {
    try {
      const res = await deleteLecture(lectureId);
      if (res?.data) {
        toast.success(res.data?.message);
        navigate(`/admin/course/${courseId}/lecture`);
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
      toast.error(error?.data.mesasge||"Lecture delete failed");
    } 
  
  }

  const updateLectureHandler = async () => {
    setLoading(true);
    try {
      const res = await updatelecture({
        courseData: {
          lectureTitle: title,
          videoInfo: uploadVideoInfo,
          isPreviewFree: isFree,
        },
        courseId,
        lectureId,
      });
      if (res?.data.data) {
        toast.success(res.data?.message);
        navigate(`/admin/course/${courseId}/lecture`);
      }
    } catch (error) {
      console.error("Error updating lecture:", error);
      toast.error("Lecture update failed");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-center items-center flex-wrap sm:justify-between sm:items-center">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make Changes and Click Save When Done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={deleteLectureHandler}>Remove Lecture</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Eg. Introduction To Javascript"
          />
        </div>
        <div>
          <Label>
            Video <span className="text-red-700">*</span>
          </Label>
          <Input
            className="w-fit"
            type="file"
            accept="video/* "
            onChange={fileChangeHandler}
            placeholder="Introduction To Javascript"
          />
        </div>
        <div className="flex items-center space-x-3 ml-1">
          <Switch
            id="free-video"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="free-video">Is This Video Free?</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}
        <div className="mt-6">
          <Button onClick={updateLectureHandler} disabled={btnDisable}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
