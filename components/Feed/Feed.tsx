import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { useFeed } from "../../providers/FeedProvider";

interface Props {
  connected: any;
  name: string;
  url: string;
}

const Feed: React.FC<Props> = ({ connected, name, url }) => {
  const style = {
    wrapper: `flex-1 max-w-2xl mx-4`,
  };

  const {
    posts,
    loading,
    getAllPosts,
    savePost,
    getCommentsOnPost,
    saveComment,
  } = useFeed();

  useEffect(() => {
    const interval = setInterval(async () => {
      await getAllPosts();
    }, 2000);
    getAllPosts();
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  useEffect(() => {
    toast("Posts Refreshed!", {
      icon: "🔁",
      style: {
        borderRadius: "10px",
        background: "#252526",
        color: "#fffcf9",
      },
    });
  }, [posts.length]);

  return (
    <div className={style.wrapper}>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div>
        {loading ? (
          <div>Connect your wallet</div>
        ) : (
          <div>
            <CreatePost
              savePost={savePost}
              getAllPosts={getAllPosts}
              name={name}
              url={url}
            />

            {posts.map((post: any) => (
              <Post
                post={post.account}
                viewDetail={getCommentsOnPost}
                createComment={saveComment}
                key={post.account.index}
                name={name}
                url={url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
