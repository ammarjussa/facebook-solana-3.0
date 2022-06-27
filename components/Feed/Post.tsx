import { useState, useEffect } from "react";
import Image from "next/image";
import { BiLike } from "react-icons/bi";
import { FaRegCommentAlt } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import CommentSection from "../Comment/CommentSection";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

interface Props {
  post: any;
  viewDetail: any;
  createComment: any;
  name: string;
  url: string;
  file: any;
  getAllPosts: () => Promise<void>;
}

const Post: React.FC<Props> = ({
  post,
  viewDetail,
  createComment,
  name,
  url,
  file,
  getAllPosts,
}) => {
  const style = {
    wrapper: `w-[100%] mt-[1rem] rounded-[0.6rem] bg-[#ffffff] text-white p-[0.4rem] pb-0`,
    postPublisher: `flex position-relative items-center`,
    avatar: `rounded-full`,
    publisherDetails: `flex flex-col ml-[0.5rem]`,
    name: `text-sm text-black`,
    timestamp: `text-sm text-[#777]`,
    text: `py-[1rem] px-[1.2rem] text-black`,
    reactionsContainer: `border-t border-[#3a3b3e] text-[18px] flex justify-evenly text-[#b0b3b8] cursor-pointer py-1`,
    reactionItem: `flex flex-1 items-center justify-center rounded-[0.4rem] hover:bg-[#eaeaea] py-2`,
    reactionsText: `ml-[1rem]`,
    refreshIcon: `text-blue-500`,
  };

  const [comments, setComments] = useState([]);

  const clockToDateString = (timestamp: any) =>
    timeAgo.format(new Date(timestamp.toNumber() * 1000), "twitter-now");

  const postDetail = async () => {
    const result = await viewDetail(post.index, post);

    setComments(await result);
  };

  const createCommentForPost = async (name: string, url: string, text: any) => {
    createComment(name, url, text, post.index, post.commentCount);
  };

  useEffect(() => {
    postDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.postPublisher}>
        <Image
          src={
            post.posterUrl.includes("dicebear")
              ? post.posterUrl
              : `https://ipfs.infura.io/ipfs/${post.posterUrl}`
          }
          className={style.avatar}
          height={44}
          width={44}
          alt="publisher profile image"
        />
        <div className={style.publisherDetails}>
          <div className={style.name}>{post.posterName}</div>
          <div className={style.timestamp}>
            {clockToDateString(post.postTime)}
          </div>
        </div>
      </div>

      <div>
        <div className={style.text}>{post.text}</div>
      </div>

      <div className={style.reactionsContainer}>
        <div className={style.reactionItem}>
          <BiLike />
          <div className={style.reactionsText}>Like</div>
        </div>
        <div className={style.reactionItem}>
          <FaRegCommentAlt />
          <div className={style.reactionsText}>Comment</div>
        </div>
        <div className={style.reactionItem}>
          <FiRefreshCw className={style.refreshIcon} />
          <div className={style.reactionsText} onClick={() => getAllPosts()}>
            Refresh Comments
          </div>
        </div>
      </div>

      <CommentSection
        comments={comments}
        createCommentForPost={createCommentForPost}
        name={name}
        url={url}
        file={file}
      />
    </div>
  );
};

export default Post;
