import React from "react";
import "./app.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/student/Courses";
import EnrolledCourse from "./pages/student/EnrolledCourse";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import Courseprogress from "./pages/student/Courseprogress";
import SearchPage from "./pages/student/SearchPage";
import {
  AuthenticatedUser,
  InstructorRoutes,
  ProtectedRoutes,
} from "./components/ProtectedRoutes";
import { PurchaseCourseprotectedRoutes } from "./components/PurchaseCourseprotectedRoutes";
import { ThemeProvider } from "./components/ThemeProvider";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            {" "}
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "enrolledCourses",
        element: (
          <ProtectedRoutes>
            <EnrolledCourse />
          </ProtectedRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoutes>
            {" "}
            <SearchPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoutes>
            <PurchaseCourseprotectedRoutes>
              <Courseprogress />
            </PurchaseCourseprotectedRoutes>
          </ProtectedRoutes>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoutes>
            <CourseDetail />
          </ProtectedRoutes>
        ),
      },

      //  admin routes
      {
        path: "admin",
        element: (
          <InstructorRoutes>
            <Sidebar />
          </InstructorRoutes>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "course", element: <CourseTable /> },
          { path: "course/create", element: <AddCourse /> },
          { path: "course/:courseId", element: <EditCourse /> },
          { path: "course/:courseId/lecture", element: <CreateLecture /> },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
    fallback: <h1>Page not found</h1>,
  },
]);
const App = () => {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
};

export default App;
