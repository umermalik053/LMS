import {
  BookAIcon,
  BookCheckIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  User2,
} from "lucide-react";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "./darkMode/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useLoadUserQuery, useLogoutUserMutation } from "@/api/authApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { logoutReducer } from "@/Store/feature/authslice";

const Navbar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);

  const [LogoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const { refetch } = useLoadUserQuery();
  const handleLogout = async () => {
    dispatch(logoutReducer());
    await LogoutUser();
  };

  useEffect(() => {
    if (user) {
      refetch();
    }
  },[]);
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "user logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#1A1A1A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 ">
      {/* desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between gap-10 h-full px-4 ">
        <div className="flex items-center justify-center gap-2">
          <BookCheckIcon size={"30"} />
          <h1 onClick={()=>navigate("/")} className="hidden md:block font-extrabold text-2xl cursor-pointer">Knowlix</h1>
        </div>
        {/* user icon and dark icon  */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.photoURL} alt="@shadcn" />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "CN"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenu>
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer"
                  >
                    <User2 />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/enrolledCourses")}
                    className="cursor-pointer"
                  >
                    <BookAIcon />
                    <span>Enrolled Course</span>
                  </DropdownMenuItem>
                </DropdownMenu>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>

                {user?.role == "instructor" && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={()=>navigate("/admin/dashboard")} className="cursor-pointer flex items-center justify-center py-2 bg-gray-800 hover:bg-gray-900 text-white">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/login")} variant="outline">
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Sign Up</Button>
            </div>
          )}
          {/* dark mode toggle */}
          <DarkMode />
        </div>
      </div>
      {/* mobile */}
      <div onClick={()=>navigate("/")} className="flex md:hidden items-center justify-between px-4 h-full cursor-pointer ">
        <h1 className="font-extrabold text-2xl flex items-center h-full">
          <BookCheckIcon />
          Knowlix
        </h1>

        <MobileDevice role={user?.role} handleLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileDevice = ({role}) => {
  const navigate = useNavigate();
  const [LogoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const handleLogout = async () => {
    await LogoutUser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "user logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full  hover:bg-gray-300 dark:hover:text-[black]"
            variant="outline"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader  className="flex flex-row justify-between items-center mt-6">
            <SheetTitle onClick={()=>navigate("/")}  className="flex items-center cursor-pointer">
              <BookCheckIcon size={"20"} />
              Knowlix
            </SheetTitle>
            <DarkMode />
          </SheetHeader>
          <Separator className="mr-2 mt-6" />
          <div className="flex flex-col space-y-2">
            <span
              onClick={() => navigate("/profile")}
              className="flex gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-200"
            >
              <User2 />
              Profile
            </span>

            <span
              onClick={() => navigate("/enrolledCourses")}
              className="flex gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-200"
            >
              <BookAIcon />
              Enrolled Course
            </span>

            <span
              onClick={handleLogout}
              className="flex gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-200"
            >
              <LogOut />
              Log out
            </span>
          </div>
          {role === "instructor" && (
            <SheetFooter className="mt-6 ">
              <SheetClose asChild>
                <Button onClick={()=>navigate("/admin/dashboard")} className="w-full" type="submit">
                  <LayoutDashboard /> Dashboard
                </Button>
              </SheetClose>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
