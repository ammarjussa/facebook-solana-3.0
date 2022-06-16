import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Header from "../components/Header";
import Feed from "../components/Feed";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";
import { useDetails } from "../providers/DetailsProvider";
import SignUp from "../components/SignUp";

const style = {
  wrapper: `bg-[#f8f9fa] min-h-screen duration-[0.5s]`,
  homeWrapper: `flex`,
  center: `flex-1`,
  main: `flex-1 flex justify-center`,
  signupContainer: `flex items-center justify-center w-screen h-[85vh]`,
};

export default function Home() {
  const { name, url, registered } = useDetails();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      await requestUsersData();
    })();
  }, []);

  const wallet = useWallet();

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
}
