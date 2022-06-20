import Image from "next/image";
import { sidebarData } from "../../static/static";

interface Props {
  name: string;
  url: string;
}

const Sidebar: React.FC<Props> = ({ name, url }) => {
  const style = {
    wrapper: `py-[25px] px-[10px] w-[24rem] hidden md:block`,
    sidebarRow: `flex w-full pb-[30px] hover:bg-[#eaeaea] rounded-lg p-[5px] gap-[10px] cursor-pointer`,
    profileImage: `rounded-full object-cover`,
    sidebarItem: `font-semibold flex items-center  flex-col justify-center text-sm `,
  };
  return (
    <div className={style.wrapper}>
      <div className={style.sidebarRow}>
        <Image
          className={style.profileImage}
          src={
            url ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png"
          }
          height={30}
          width={30}
          alt="profile image"
        />
        <div className={style.sidebarItem}>{name}</div>
      </div>
      {sidebarData.map((sidebarDataItem, index) => (
        <div className={style.sidebarRow} key={index}>
          <Image
            src={sidebarDataItem.icon}
            height={30}
            width={30}
            alt="sidebar icon"
          />
          <div className={style.sidebarItem}>{sidebarDataItem.title}</div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
