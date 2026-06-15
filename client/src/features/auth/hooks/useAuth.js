import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser, registerUser } from "../state/auth/authAction";
export const useAuth = () => {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requestHandleLoginSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/home");
    } catch (error) {
      console.log("error in login", error);
    }
  };
  
  const requestHandleRegisterSubmit=async(data)=>{
    try {
      await dispatch(registerUser(data)).unwrap();
      // registration on success — navigate to login
      navigate("/login");
    } catch (error) {
        console.log('error in register',error)
    }
  }

  return {
    requestHandleLoginSubmit,
    requestHandleRegisterSubmit,
    register,
    handleSubmit,
    errors,
    dispatch,
    navigate,
  };
};
