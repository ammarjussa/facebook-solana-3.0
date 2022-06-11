import toast, { Toaster } from "react-hot-toast";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/get-program";
import CreatePost from "./CreatePost";
import Post from "./Post";

const anchor = require("@project-serum/anchor");
const { BN, web3 } = anchor;
const utf8 = anchor.utils.bytes.utf8;
const { SystemProgram } = web3;

const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
};

interface Props {
  connected: any;
  name: string;
  url: string;
}

const Feed: React.FC<Props> = ({ connected, name, url }) => {
  const style = {
    wrapper: `flex-1 max-w-2xl mx-4`,
  };

  const wallet = useWallet();
  const connection = new anchor.web3.Connection(SOLANA_HOST);
  const program = getProgramInstance(connection, wallet);
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getAllPosts = useCallback(async () => {
    try {
      const postsData = await program.account.postAccount.all();

      postsData.sort(
        (a, b) => b.account.postTime.toNumber() - a.account.postTime.toNumber()
      );

      setPosts(postsData);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [program.account.postAccount]);

  const getCommentsOnPost = async (index: any) => {
    try {
      let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [utf8.encode("post"), index.toArrayLike(Buffer, "be", 8)],
        program.programId
      );

      const post = await program.account.postAccount.fetch(postSigner);

      let commentSigners = [];

      for (let i = 0; i < post.commentCount.toNumber(); i++) {
        let [commentSigner] = await anchor.web3.PublicKey.findProgramAddress(
          [
            utf8.encode("comment"),
            new BN(index).toArrayLike(Buffer, "be", 8),
            new BN(i).toArrayLike(Buffer, "be", 8),
          ],
          program.programId
        );

        commentSigners.push(commentSigner);
      }

      const comments = await program.account.commentAccount.fetchMultiple(
        commentSigners
      );

      comments.sort(
        (a: any, b: any) => a.postTime.toNumber() - b.postTime.toNumber()
      );

      return comments;
    } catch (error) {
      console.error(error);
    }
  };

  const savePost = async (text: any) => {
    let [stateSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("state")],
      program.programId
    );

    let stateInfo;

    try {
      stateInfo = await program.account.stateAccount.fetch(stateSigner);
    } catch (error) {
      await program.rpc.createState({
        accounts: {
          state: stateSigner,
          authority: wallet.publicKey as any,
          ...defaultAccounts,
        },
      });

      return;
    }

    let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("post"), stateInfo.postCount.toArrayLike(Buffer, "be", 8)],
      program.programId
    );

    try {
      await program.account.postAccount.fetch(postSigner);
    } catch {
      await program.rpc.createPost(text, name, url, {
        accounts: {
          state: stateSigner,
          post: postSigner,
          authority: wallet.publicKey as any,
          ...defaultAccounts,
        },
      });

      setPosts(await program.account.postAccount.all());
    }
  };

  const saveComment = async (text: any, index: any, count: any) => {
    let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("post"), index.toArrayLike(Buffer, "be", 8)],
      program.programId
    );

    try {
      let [commentSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [
          utf8.encode("comment"),
          index.toArrayLike(Buffer, "be", 8),
          count.toArrayLike(Buffer, "be", 8),
        ],
        program.programId
      );

      await program.rpc.createComment(text, name, url, {
        accounts: {
          post: postSigner,
          comment: commentSigner,
          authority: wallet.publicKey as any,
          ...defaultAccounts,
        },
      });

      await program.account.commentAccount.fetch(commentSigner);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await getAllPosts();
    }, 2000);
    getAllPosts();
    return () => clearInterval(interval);
  }, [connected, getAllPosts]);

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
          <div>Loading...</div>
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
