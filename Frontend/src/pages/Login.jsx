import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginUserMutation, useRegisterUserMutation } from "@/api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginReducer } from "@/Store/feature/authslice";

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setsignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [
    RegisterUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerLoading,
      isSuccess: registerSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    LoginUser,
    {
      data: LoginData,
      error: LoginError,
      isLoading: LoginLoading,
      isSuccess: LoginSuccess,
    },
  ] = useLoginUserMutation();

  const handleLoginInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setsignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };
  useEffect(() => {
    if (registerData && registerSuccess) {
      toast.success(registerData.message || "Signup Successfully");

    }
    if (LoginData && LoginSuccess) {
      // console.log(LoginData.user)
      dispatch(loginReducer(LoginData))
       navigate("/")
      toast.success(LoginData.message || "login Successfully");

       navigate("/")
       
    }
    if (LoginError || registerError) {
      
      toast.error(LoginError?.message || registerError?.data?.message ||  "Error");
     
    }
  
  }, [
    registerData,
    registerError,
    registerLoading,
    registerSuccess,
    LoginData,
    LoginError,
    LoginLoading,
    LoginSuccess,
  ]);
  const handleSubmit = async (type) => {
    const userData = type === "signup" ? signupInput : loginInput;
    // RTK
    const action = type === "signup" ? RegisterUser : LoginUser;
    await action(userData);
  };
  return (
    <div className="flex items-center w-full justify-center h-[100vh] ">
      <Tabs defaultValue="signUp" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signUp">SignUp</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signUp">
          <Card>
            <CardHeader>
              <CardTitle>SignUp</CardTitle>
              <CardDescription>
                Create a new account and click Signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Your Name"
                  required="true"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => handleLoginInputChange(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  required="true"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => handleLoginInputChange(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="Password">Password</Label>
                <Input
                  id="Password"
                  type="password"
                  placeholder="Enter Your password"
                  required="true"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => handleLoginInputChange(e, "signup")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerLoading}
                onClick={() => handleSubmit("signup")}
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "SignUp"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your account here. After signup you will be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required="true"
                  placeholder="Enter Your Email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => handleLoginInputChange(e, "login")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="Password">Password </Label>
                <Input
                  id="Password"
                  type="password"
                  required="true"
                  placeholder="Enter Your Password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => handleLoginInputChange(e, "login")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={LoginLoading}
                onClick={() => handleSubmit("login")}
              >
                {LoginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
