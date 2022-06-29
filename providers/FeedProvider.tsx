import { createContext, ReactNode, useState, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/get-program";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const anchor = require("@project-serum/anchor");
const { BN, web3 } = anchor;
const utf8 = anchor.utils.bytes.utf8;
const { SystemProgram } = web3;

const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
};

export const FeedContext = createContext<any>(null);

interface ContextProps {
  posts: any;
  loading: boolean;
  postImage: any;
  setPostImage: any;
  getAllPosts: () => Promise<void>;
  savePost: (name: string, url: string, text: any) => Promise<void>;
  getCommentsOnPost: (index: any) => Promise<any>;
  saveComment: (
    name: string,
    url: string,
    text: any,
    index: any,
    count: any
  ) => Promise<void>;
}

interface Props {
  children: ReactNode;
}

export const FeedProvider: React.FC<Props> = ({ children }) => {
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(SOLANA_HOST, {
    disableRetryOnRateLimit: true,
  });

  const program = getProgramInstance(connection, wallet);
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [postImage, setPostImage] = useState();

  const getAllPosts = async () => {
    try {
      const postsData = await program.account.postAccount.all();

      postsData.sort(
        (a: any, b: any) =>
          b.account.postTime.toNumber() - a.account.postTime.toNumber()
      );

      setPosts(postsData);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const savePost = async (
    name: string,
    url: string,
    image: string,
    text: any
  ) => {
    let [stateSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("state")],
      program.programId
    );

    let stateInfo;

    try {
      stateInfo = await program.account.stateAccount.fetch(stateSigner);
    } catch (error) {
      await program.methods
        .createState({})
        .accounts({
          state: stateSigner,
          authority: wallet.publicKey as any,
          ...defaultAccounts,
        })
        .rpc();

      return;
    }

    let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("post"), stateInfo.postCount.toArrayLike(Buffer, "be", 8)],
      program.programId
    );

    try {
      await program.account.postAccount.fetch(postSigner);
    } catch {
      await program.rpc.createPost(text, name, url, image, {
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

  const saveComment = async (
    name: string,
    url: string,
    text: any,
    index: any,
    count: any
  ) => {
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
          authority: wallet.publicKey,
          ...defaultAccounts,
        },
      });

      await program.account.commentAccount.fetch(commentSigner);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        loading,
        getAllPosts,
        savePost,
        getCommentsOnPost,
        saveComment,
        postImage,
        setPostImage,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export function useFeed(): ContextProps {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error("useContactsContext must be used within Contacts Provider");
  }
  return context;
}
