import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Header from "../components/Header/Header";
import Feed from "../components/Feed/Feed";
import RightSidebar from "../components/Sidebar/RightSidebar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useDetails } from "../providers/DetailsProvider";
import SignUp from "../components//Signup/SignUp";
import { NextPage } from "next";

const style = {
  wrapper: `bg-[#f8f9fa] min-h-screen duration-[0.5s]`,
  homeWrapper: `flex`,
  center: `flex-1`,
  main: `flex-1 flex justify-center`,
  signupContainer: `flex items-center justify-center w-screen h-[85vh]`,
};

const Home: NextPage = () => {
  const { name, url, registered, setName, setUrl, setRegistered } =
    useDetails();
  const [users, setUsers] = useState([]);
  const wallet = useWallet();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("signIn") as string);
    if (data) {
      setRegistered(true);
      setName(data.name);
      setUrl(data.url);
    }
  });

  useEffect(() => {
    (async () => {
      await requestUsersData();
    })();
  }, []);

  const requestUsersData = async () => {
    try {
      const response = await fetch(`/api/fetchUsers`);
      const data = await response.json();

      setUsers(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.wrapper}>
      {registered ? (
        <>
          <Header name={name} url={url} />

          <div className={style.homeWrapper}>
            <Sidebar name={name} url={url} />
            <div className={style.main}>
              <Feed connected={wallet.connected} name={name} url={url} />
            </div>
            <RightSidebar getUsers={requestUsersData} users={users} />
          </div>
        </>
      ) : (
        <>
          <Header />
          <div className={style.signupContainer}>
            <SignUp />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
