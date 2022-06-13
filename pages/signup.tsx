import { NextPage } from "next";
import SignUp from "../components/SignUp";
import Header from "../components/Header";

const style = {
  wrapper: `bg-[#f8f9fa] min-h-screen duration-[0.5s]`,
  signupContainer: `flex items-center justify-center w-screen h-[90vh]`,
};

const Signup: NextPage = () => {
  return (
    <div className={style.wrapper}>
      <Header />
      <div className={style.signupContainer}>
        <SignUp />
      </div>
    </div>
  );
};

export default Signup;
