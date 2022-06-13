import Image from "next/image";
import { useRouter } from "next/router";
import { useDetails } from "../context/useDetails";

declare global {
  interface Window {
    solana: any;
  }
}

const style = {
  wrapper: `flex flex-col p-10 justify-center items-center h-full w-full bg-[#ffffff] w-min h-min rounded-2xl`,
  title: `text-[#afb3b8] font-semibold text-lg`,
  form: `flex flex-col items-center`,
  fieldContainer: `my-8 `,
  inputTitle: `text-[#afb3b8] font-semibold mb-2 ml-3`,
  inputContainer: `flex items-center w-[30rem] bg-[#f0f2f5] rounded-full`,
  inputField: `bg-transparent flex-1 m-2 outline-none text-black px-2`,
  randomUrl: `h-full bg-[#1d74e4] hover:bg-[#1d74e4] text-white px-2 py-1 mx-1 hover:px-3 rounded-full cursor-pointer duration-[0.2s] ease-in-out`,
  submitButton: `bg-[#1d74e4] text-white font-semibold px-4 py-2 hover:px-6 rounded-full cursor-pointer duration-[0.2s] ease-in-out`,
};

interface Props {}

const SignUp: React.FC<Props> = () => {
  const { name, setName, url, setUrl, setRegistered } = useDetails();
  const router = useRouter();

  const createUser = async (event: any) => {
    event.preventDefault();
    const resp = await window.solana.connect();
    const walletAddress = resp.publicKey.toString();

    try {
      await fetch(`/api/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWalletAddress: walletAddress,
          name: name,
          profileImage:
            event.target.url?.value ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png",
        }),
      });

      setRegistered(true);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const generateRandomProfileImageUrl = () =>
    setUrl(
      `https://avatars.dicebear.com/api/pixel-art-neutral/${Math.floor(
        Math.random() * 100
      )}.svg`
    );

  return (
    <div className={style.wrapper}>
      <div>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png"
          height={40}
          width={40}
          alt="facebook logo"
        />
      </div>
      <div className={style.title}>Please sign up to use Facebook</div>
      <form onSubmit={createUser} className={style.form}>
        <div className={style.fieldContainer}>
          <div className={style.inputTitle}>Name</div>
          <div className={style.inputContainer}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className={style.inputField}
            />
          </div>
        </div>
        <div className={style.fieldContainer}>
          <div className={style.inputTitle}>Profile Image URL</div>
          <div className={style.inputContainer}>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
              className={style.inputField}
            />
            <div
              className={style.randomUrl}
              onClick={() => generateRandomProfileImageUrl()}
            >
              Random
            </div>
          </div>
        </div>
        <button className={style.submitButton} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
