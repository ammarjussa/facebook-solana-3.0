import { useState } from "react";
import Image from "next/image";
import { MdInsertEmoticon } from "react-icons/md";
import { TiCameraOutline } from "react-icons/ti";
import { RiFileGifLine } from "react-icons/ri";
import { BiSticker } from "react-icons/bi";
import ipfs from "../../ipfs";

interface Props {
  createCommentForPost: any;
  name: string;
  url: string;
  file: any;
}

const CreateComment: React.FC<Props> = ({
  createCommentForPost,
  name,
  url,
  file,
}) => {
  const [input, setInput] = useState("");

  const style = {
    wrapper: `flex items-center`,
    profileImage: `rounded-full`,
    inputContainer: `flex flex-1 h-10 bg-[#f0f2f5] rounded-full px-[1rem]`,
    form: `flex flex-1 items-center`,
    input: `w-full bg-transparent outline-none text-black`,
    inputIcons: `flex items-center gap-[0.4rem]`,
    icon: `cursor-pointer text-[#a6a9ae]`,
  };

  const postComment = async (event: any) => {
    event.preventDefault();
    try {
      const result = await ipfs.add(file);
      console.log(result);
      await createCommentForPost(name, result.path, input);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style.wrapper}>
      <div>
        <Image
          className={style.profileImage}
          src={url}
          height={44}
          width={44}
          alt="profile image"
        />
      </div>
      <div className={style.inputContainer}>
        <form className={style.form} onSubmit={postComment}>
          <input
            type="text"
            placeholder="Write a comment..."
            className={style.input}
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
        <div className={style.inputIcons}>
          <MdInsertEmoticon fontSize={20} className={style.icon} />
          <TiCameraOutline fontSize={20} className={style.icon} />
          <RiFileGifLine fontSize={20} className={style.icon} />
          <BiSticker fontSize={20} className={style.icon} />
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
