import Comment from "./Comment";
import CreateComment from "./CreateComment";

interface Props {
  comments: any;
  createCommentForPost: any;
  name: string;
  url: string;
  file: any;
}

const CommentSection: React.FC<Props> = ({
  comments,
  createCommentForPost,
  name,
  url,
  file,
}) => {
  const style = {
    wrapper: `w-full rounded-b-lg p-[5px] flex justify-center-center flex-col border-t border-gray-300 border-[#3a3b3e] pt-4`,
  };

  return (
    <div className={style.wrapper}>
      {comments?.map((comment: any, index: any) => (
        <Comment comment={comment} key={index} />
      ))}
      <CreateComment
        createCommentForPost={createCommentForPost}
        name={name}
        url={url}
        file={file}
      />
    </div>
  );
};

export default CommentSection;
