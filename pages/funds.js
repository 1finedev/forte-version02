import { connectToDatabase } from "../backend/dbConnect";
import { Layout, PageNav } from "./../components";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { getSession } from "next-auth/react";
import Funds from "./../backend/fundsModel";
import { format } from "date-fns";
import { useAlert } from "react-alert";

const AgentFunds = ({ funds }) => {
  const alert = useAlert();
  const { data: session, status } = useSession();
  const transformPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [transactions, setTransactions] = useState(funds);
  const [active, setActive] = useState(1);
  const [request, setRequest] = useState({
    amount: "0",
  });

  useEffect(() => {
    setRequest({
      ...request,
      bankName: session?.user?.bankName,
      accountNumber: session?.user?.accountNumber,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const postRequest = async () => {
    const res = await axios.post("/api/withdrawal/withdraw", request);
    if (res.data.status === "success") {
      setTransactions([res.data.data, ...transactions]);
      session.user.balance = session.user.balance - request.amount * 1;
      setRequest({ ...request, amount: 0 });
      setActive(1);
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Withdrawal request successful!
        </div>,
        {
          type: "success",
        }
      );
    } else {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          {res.data.error}
        </div>,
        {
          type: "error",
        }
      );
    }
  };

  return (
    <Layout>
      <div className="relative flex min-h-[100vh] w-screen flex-col">
        <div className="h-[40vh] w-full bg-mainColor">
          <PageNav />

          <div className="flex items-center justify-center">
            <div className="relative mr-[-20px] mt-[30px]">
              <div className="absolute left-[4px] top-[4px] h-[140px] w-[140px] animate-blue-sOrbit rounded-full bg-[#75f3dc] mix-blend-screen blur-md"></div>
              <div className="absolute left-[1px] top-[1px] h-[140px] w-[140px] animate-red-uOrbit rounded-full bg-[#f00] mix-blend-screen blur-md"></div>
              <div className="absolute top-[8px] left-[10px] h-[132px] w-[132px] animate-green-uOrbit rounded-full bg-[#0f0] mix-blend-screen blur-md"></div>
              <div className="absolute flex h-[145px] w-[145px] items-center justify-center rounded-full border border-white bg-mainColor">
                <div>
                  <p className="text-xl font-bold text-center text-white font-brand">
                    ₦{transformPrice(session?.user?.balance)}
                  </p>
                  <p className="text-xs text-white">Available Balance</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-[5vh] ml-[28px] font-heading text-lg text-white">
            {session.user.fullname.split(" ")[0]}&apos;s Balance
          </p>
          <button
            onClick={() => setActive(2)}
            className="text-brandBlue ml-[30px] mt-[10px] rounded-lg bg-white px-[15px] py-[10px] shadow-md"
          >
            Make request
          </button>
        </div>
        <div className="mt-[-30px] w-full flex-1 rounded-tr-[35px] rounded-tl-[35px] bg-white">
          <div className="relative mt-[10px] flex border-b pb-[15px]">
            <div
              className="relative w-1/2 text-center cursor-pointer"
              onClick={() => setActive(1)}
            >
              <button className="text-lg font-medium ">Transactions</button>
              {active === 1 && (
                <span className="absolute bottom-[-18px] left-0  h-[6px] w-[100%] rounded-full bg-mainColor"></span>
              )}
            </div>
            <div
              className="relative w-1/2 text-center cursor-pointer"
              onClick={() => setActive(2)}
            >
              <button className="w-1/2 text-lg font-medium">Request</button>
              {active === 2 && (
                <span className="absolute bottom-[-18px] left-0  h-[6px] w-[100%] rounded-full bg-mainColor"></span>
              )}
            </div>

            <span className="absolute left-[50%] top-[-2px]  h-[80%] w-[2px] rounded-full bg-red-500"></span>
          </div>
          {active === 2 && (
            <div>
              <p className=" mt-[20px] text-center text-lg">Enter amount</p>
              <div className="flex justify-center">
                <input
                  className={`${
                    request.amount < session?.user?.balance &&
                    request.amount > 0
                      ? " shadow-green-500"
                      : " shadow-mainColor"
                  }  mb-2 w-[160px] rounded-lg border  bg-transparent px-[15px] py-[10px] text-2xl shadow-md  focus:outline-0`}
                  type="number"
                  placeholder=""
                  pattern="[0-9]*"
                  inputMode="numeric"
                  onInput={(e) =>
                    setRequest({ ...request, amount: e.target.value })
                  }
                />
              </div>
              <div className="mt-[30px]">
                <div className="w-full p-4 pt-0">
                  <div className="mt-[10px] flex space-x-3">
                    <p className="mr-12 font-sm">Withdrawal:</p>
                    <p className="">₦{transformPrice(request.amount)}</p>
                  </div>
                  <div className="flex mt-1 space-x-3">
                    <p className="font-sm mr-[52px]">Bank name:</p>
                    <p className="">
                      {session?.user?.bankName || "Not found!"}
                    </p>
                  </div>
                  <div className="flex mt-1 space-x-3">
                    <p className="mr-2 font-sm">Account number:</p>
                    <p className="">
                      {session?.user?.accountNumber || "Not found!"}
                    </p>
                  </div>
                  <div className="flex mt-1">
                    <p className="mr-7">Add a comment</p>
                    <textarea
                      className="mt-1 h-[80px] w-[60%] rounded-lg border border-mainColor px-[5px] py-[8px] focus:outline-0"
                      placeholder=""
                      onInput={(e) =>
                        setRequest({ ...request, comment: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <p className="mt-4 text-center text-blue-700 cursor-pointer">
                    <Link href="/agentProfile">
                      Click here to update account details
                    </Link>
                  </p>
                  <div className="flex justify-center">
                    <button
                      disabled={
                        request.amount > session?.user?.balance ||
                        request.amount <= 0 ||
                        !request.bankName ||
                        !request.accountNumber
                      }
                      className="mt-[25px] mb-[20px] cursor-pointer rounded-lg bg-mainColor px-[50px] py-[15px] text-white disabled:cursor-pointer disabled:bg-gray-300"
                      onClick={postRequest}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {active === 1 && (
            <div>
              <p className="mt-[20px] px-[10px] text-gray-500">
                Last transactions ({transactions.length} found)
              </p>
              {transactions?.map((transaction, index) => (
                <div key={index} className="mb-[10px] flex w-full p-[15px]">
                  <div
                    className={`mr-[10px] rounded-lg ${
                      transaction.type === "credit"
                        ? "bg-[#d2f2b9]"
                        : "bg-[#FCEAF1]"
                    } p-[15px]`}
                  >
                    {transaction.type === "credit" && (
                      <svg
                        className="h-6 w-6 rotate-45 text-[#51912C]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    {transaction.type === "debit" && (
                      <svg
                        className="h-6 w-6 rotate-45 text-[#EB3E7F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <div>
                      <p>{transaction.name}</p>
                      <p
                        className={`${
                          transaction.status === "Pending"
                            ? "text-[#e8d453]"
                            : transaction.status === "Approved"
                            ? "text-[#51912C]"
                            : "text-[#EB3E7F]"
                        } text-left text-sm`}
                      >
                        {transaction.status}
                      </p>
                    </div>
                    <div>
                      <div
                        className={`${
                          transaction.type === "credit"
                            ? "text-[#51912C]"
                            : "text-[#EB3E7F]"
                        } flex items-center `}
                      >
                        <p className="text-2xl font-bold">
                          {transaction.type === "debit" ? "-" : "+"}
                        </p>
                        <p className="text-left">
                          ₦{transformPrice(transaction?.amount)}
                        </p>
                      </div>
                      <p className="text-xs text-left text-gray-500">
                        {format(new Date(transaction.createdAt), "dd-MM-yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AgentFunds;
AgentFunds.auth = true;

export async function getServerSideProps(context) {
  await connectToDatabase();
  const session = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  try {
    const funds = await Funds.find({ user: session.user._id })
      .sort("-createdAt")
      .lean();
    return {
      props: { funds: JSON.parse(JSON.stringify(funds)) },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        permanent: false,
        destination: "/500",
      },
    };
  }
}
