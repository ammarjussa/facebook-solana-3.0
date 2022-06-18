import { useEffect } from "react";
import Image from "next/image";
import Contact from "../Feed/Contact";

interface Props {
  users: any;
  getUsers: any;
}

const RightSidebar: React.FC<Props> = ({ getUsers, users }) => {
  const style = {
    wrapper: `w-[24rem] text-lg`,
    title: `text-[#afb3b8] font-semibold`,
    adsContainer: ``,
    ad: `flex items-center my-3 mr-[1rem] p-2 rounded-lg`,
    adImageContainer: `h-full w-[50%] flex items-center mr-[0.5rem]`,
    adImage: `rounded-full`,
    adLink: `text-[#b0b3b8] text-sm hover:text-blue-800`,
    divider: `w-[95%] border-b border-[0.5px] border-[#3e4042] my-2`,
    contact: `flex items-center my-2`,
    contactImage: `rounded-full object-cover`,
    contactName: `ml-4 text-[1rem]`,
  };

  useEffect(() => {
    (async () => {
      await getUsers();
    })();
  }, [getUsers]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Sponsored</div>
      <div className={style.adsContainer}>
        <div className={style.ad}>
          <div className={style.adImageContainer}>
            <Image
              src={"/ammar.jpg"}
              height={100}
              width={100}
              className={style.adImage}
              alt="cp logo"
              priority={true}
            />
            ˚
          </div>
          <div>
            <div>Checkout this portfolio site for more amazing projects</div>
            <a
              href="https://ammarjussa.com/"
              className={style.adLink}
              target="_blank"
              rel="noreferrer"
            >
              ammarjussa.com
            </a>
          </div>
        </div>
        <div className={style.ad}>
          <div className={style.adImageContainer}>
            <Image
              src={
                "https://www.cityam.com/wp-content/uploads/2021/08/Solana-1.jpg"
              }
              height={100}
              width={100}
              className={style.adImage}
              alt="solana logo"
              priority={true}
            />
          </div>
          <div>
            <div>Powerful for developers. Fast for everyone.</div>
            <a
              href="https://solana.com"
              className={style.adLink}
              target="_blank"
              rel="noreferrer"
            >
              solana.com
            </a>
          </div>
        </div>
        <div className={style.divider} />
        <div className={style.title}>Contacts</div>
        <div>
          {users.map((user: any) => {
            return <Contact key={user.walletAddress} user={user} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
