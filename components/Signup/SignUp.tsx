import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { useRef } from "react";
import { useDetails } from "../../providers/DetailsProvider";

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
  inputContainer: `flex items-center w-[20rem] md:w-[30rem] bg-[#f0f2f5] rounded-full`,
  inputField: `bg-transparent flex-1 m-2 outline-none text-black px-2`,
  submitButton: `bg-[#1d74e4] text-white font-semibold px-4 py-2 hover:px-6 rounded-full cursor-pointer duration-[0.2s] ease-in-out`,
};

interface Props {}

const SignUp: React.FC<Props> = () => {
  const { name, setName, url, setUrl, setRegistered, setFile } = useDetails();
  const wallet = useWallet();
  const inputFile: any = useRef();

  const handleChange = async (e: any) => {
    const img = e.target.files[0];
    const reader: any = new window.FileReader();
    reader.readAsArrayBuffer(img);

    reader.onloadend = () => {
      setFile(Buffer.from(reader.result));
    };
    setUrl(URL.createObjectURL(img));
  };

  const createUser = async (event: any) => {
    event.preventDefault();
    const resp = await window.solana.connect();
    console.log(resp);
    const walletAddress = resp.publicKey.toString();

    console.log(wallet);

    if (!wallet.publicKey) {
      alert("Connect your wallet");
      return;
    }

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

      const data = {
        name: name,
        url: url,
        address: walletAddress,
      };

      localStorage.setItem("signIn", JSON.stringify(data));

      setRegistered(true);
    } catch (error) {
      console.error(error);
    }
  };

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
          <div className={style.inputTitle}>Upload Image</div>
          <div className={style.inputContainer}>
            <input
              ref={inputFile}
              onChange={handleChange}
              required
              className={style.inputField}
              type="file"
            />
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
