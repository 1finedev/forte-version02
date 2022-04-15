import { useEffect, useState } from "react";
import { AgentsList } from "./../components";
import { useDebounce } from "use-lodash-debounce";
import Layout from "./backLayout";
import { format } from "date-fns";
import axios from "axios";
import { useAlert } from "react-alert";
import { useRouter } from "next/router";

const Agents = () => {
  const router = useRouter();
  const alert = useAlert();
  const [active, setActive] = useState(1);
  const [agents, setAgents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState({
    id: "",
    index: "",
  });
  const [status, setStatus] = useState({ value: "", comment: "" });
  const [search, setSearch] = useState({
    query: "",
    path: "name",
    searchType: "agents",
  });
  const debouncedQuery = useDebounce(search.query, 200);

  const handleSearch = async () => {
    setLoading(true);
    if (search.searchType === "agents") {
      const { data } = await axios.post("/api/search", search);
      setAgents(data.data);
    } else {
      const { data } = await axios.post("/api/search", search);
      console.log(data);
      setTransactions(data.data);
    }
    setLoading(false);
  };

  const getAgents = async () => {
    setLoading(true);
    const agents = await axios.get("/api/getAgents");
    setAgents(agents.data.data);
    setLoading(false);
  };
  useEffect(() => {
    if (search.query.length > 1) {
      handleSearch();
    } else {
      getAgents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const getTransactions = async () => {
    setLoading(true);
    const transactions = await axios.get("/api/getTransactions");
    setTransactions(transactions.data.transactions);
    setLoading(false);
  };
  useEffect(() => {
    active === 2 && getTransactions();
  }, [active]);

  const handleClick = async (option) => {
    if (option === "transactions") {
      const transactions = await axios.post("/api/user/updateUser", {
        agentId: selectedIndex,
        option,
      });
      if (transactions.data.status === "success") {
        setTransactions(transactions.data.data);
        setActive(2);
      } else {
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            {transactions.data.error}
          </div>,
          {
            type: "error",
          }
        );
      }
    } else if (option === "shipments") {
      router.push({
        pathname: "/shipment-management",
        query: {
          agent: selectedIndex,
        },
      });
    } else if (option === "suspend") {
      const confirm = "Are you sure you want to suspend this User?";

      if (window.confirm(confirm) === true) {
        const res = await axios.post("/api/user/updateUser", {
          option,
          agentId: selectedIndex,
        });
        if (res.data.status === "success") {
          alert.show(
            <div
              className="text-white dark:text-white"
              style={{ textTransform: "initial", fontFamily: "Roboto" }}
            >
              User suspended successfully!
            </div>,
            {
              type: "success",
            }
          );
          getAgents();
        }
      }
    } else if (option === "delete") {
      const confirm = "Are you sure you want to delete this User?";

      if (window.confirm(confirm) === true) {
        const res = await axios.post("/api/user/updateUser", {
          option,
          agentId: selectedIndex,
        });
        if (res.data.status === "success") {
          alert.show(
            <div
              className="text-white dark:text-white"
              style={{ textTransform: "initial", fontFamily: "Roboto" }}
            >
              User deleted successfully!
            </div>,
            {
              type: "success",
            }
          );
          getAgents();
        } else {
          alert.show(
            <div
              className="text-white dark:text-white"
              style={{ textTransform: "initial", fontFamily: "Roboto" }}
            >
              {transactions.data.error}
            </div>,
            {
              type: "error",
            }
          );
        }
      }
    } else if (option === "activate") {
      const confirm = "Are you sure you want to reactivate this User?";

      if (window.confirm(confirm) === true) {
        const res = await axios.post("/api/user/updateUser", {
          option,
          agentId: selectedIndex,
        });
        if (res.data.status === "success") {
          alert.show(
            <div
              className="text-white dark:text-white"
              style={{ textTransform: "initial", fontFamily: "Roboto" }}
            >
              User reactivated successfully!
            </div>,
            {
              type: "success",
            }
          );
          getAgents();
        }
      }
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

  const updateTransaction = async () => {
    const confirm = `Are you sure you want to ${
      status.value === "Approved" ? "approve" : "reject"
    } this transaction`;

    if (window.confirm(confirm) === true) {
      setLoading(true);
      const res = await axios.post("/api/updateTransaction", {
        transactionId: selectedTransaction.id,
        comment: status.comment,
        value: status.value,
      });
      if (res.data.status === "success") {
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            {`Transaction ${status.value} successfully!`}
          </div>,
          {
            type: "success",
          }
        );

        getTransactions();
        setSelectedTransaction({
          id: "",
          index: "",
        });
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
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="relative mt-[10px] flex border-b pb-[15px]">
        <div
          className="relative w-1/2 text-center cursor-pointer"
          onClick={() => setActive(1)}
        >
          <button className="text-lg font-bold uppercase font-heading">
            E-Unique Agents - ({agents?.length})
          </button>
          {active === 1 && (
            <span className="absolute bottom-[-15px] left-0  h-[1px] w-[100%] rounded-full bg-mainColor"></span>
          )}
        </div>
        <div
          className="relative w-1/2 text-center cursor-pointer"
          onClick={() => setActive(2)}
        >
          <button className="w-1/2 text-lg font-bold uppercase font-heading">
            Transactions
          </button>
          {active === 2 && (
            <span className="absolute bottom-[-15px] left-0  h-[1px] w-[100%] rounded-full bg-mainColor"></span>
          )}
        </div>
        <span className="absolute left-[50%] top-[-2px]  h-[80%] w-[2px] rounded-full bg-mainColor"></span>
      </div>
      <div
        className={`flex items-center ${
          active === 1 ? "justify-between" : "justify-end"
        } px-[20px]`}
      >
        <div className="relative my-[20px] min-w-[35vw] text-center text-mainColor">
          <input
            onInput={(e) => setSearch({ ...search, query: e.target.value })}
            value={search.query}
            type="text"
            className="w-full  rounded-full border bg-white p-[10px] text-center placeholder-gray-900 shadow-sm shadow-mainColor outline-0 ring-0 focus:outline-none"
            name="search"
            disabled={
              search.path === "suspended" ||
              search.path === "active" ||
              search.path === "pending" ||
              search.path === "rejected" ||
              search.path === "approved"
            }
            placeholder={active === 1 ? "Search Agents" : "Search Transactions"}
          />
          <select
            name="Filter"
            onChange={(e) => {
              if (active === 1) {
                if (
                  e.target.value === "suspended" ||
                  e.target.value === "active"
                ) {
                  setSearch({
                    ...search,
                    query:
                      e.target.value === "suspended"
                        ? "Filter: Suspended Agents"
                        : "Filter: Active Agents",
                    path: e.target.value,
                  });
                } else {
                  setSearch({ ...search, path: e.target.value, query: "" });
                }
              } else {
                if (
                  e.target.value === "approved" ||
                  e.target.value === "pending" ||
                  e.target.value === "rejected"
                ) {
                  setSearch({
                    searchType: "transactions",
                    query:
                      e.target.value === "approved"
                        ? "Filter: Approved Transactions"
                        : e.target.value === "pending"
                        ? "Filter: Pending Transactions"
                        : "Filter: Rejected Transactions",
                    path: e.target.value,
                  });
                } else {
                  setSearch({
                    searchType: "transactions",
                    path: e.target.value,
                    query: "",
                  });
                }
              }
            }}
            className="absolute top-0 left-0  rounded-l-full bg-mainColor px-2 py-[13px] text-base text-white focus:outline-none"
          >
            {active === 1 && (
              <>
                <option value="name">Name</option>
                <option value="agentId">Agent</option>
                <option value="suspended">Suspended</option>
                <option value="active">Active</option>
                <option value="amountGt">Available &gt;</option>
                <option value="amountLt">Available &lt;</option>
              </>
            )}
            {active === 2 && (
              <>
                <option value="name">Name</option>
                <option value="agentId">Agent</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="amountGt">Amount &gt;</option>
                <option value="amountLt">Amount &lt;</option>
              </>
            )}
          </select>
        </div>
      </div>
      {loading && (
        <p className="mb-2 text-lg text-center text-mainColor">
          Fetching results, please wait...
        </p>
      )}
      {active === 1 ? (
        <AgentsList
          agents={agents}
          format={format}
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
          handleClick={handleClick}
        />
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                S/N
              </th>
              <th
                scope="col"
                className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Agent Name
              </th>
              <th
                scope="col"
                className="max-w-[150px] py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Agent Code{" "}
              </th>
              <th
                scope="col"
                className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Amount
              </th>
              <th
                scope="col"
                className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase "
              >
                Date
              </th>

              <th
                scope="col"
                className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Bank Name
              </th>

              <th
                scope="col"
                className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Account Number
              </th>
              <th
                scope="col"
                className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Comments
              </th>
              <th
                scope="col"
                className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                scope="col"
                className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                Action
              </th>
            </tr>
          </thead>
          {transactions?.map((transaction, index) => {
            const transformPrice = (price) => {
              return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            return (
              <tbody key={index} className="bg-white divide-y divide-gray-200 ">
                <tr className="relative">
                  <td
                    scope="col"
                    className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    {index + 1}
                  </td>
                  <td className="max-w-[115px] whitespace-nowrap py-4 pl-2">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.user.fullname.toUpperCase().split(" ")[0]}{" "}
                      {transaction.user.fullname.toUpperCase().split(" ")[1]}
                    </div>
                  </td>
                  <td className="max-w-[100px]  py-4 ">
                    {transaction.user.agentId.toUpperCase()}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    ₦{transformPrice(transaction.amount)}
                  </td>
                  <td className="max-w-[80px] py-4">
                    {format(new Date(transaction.createdAt), "dd-MM-yyyy")}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    {transaction.bankName}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    {transaction.accountNumber}
                  </td>
                  <td className="py-4 whitespace-nowrap">
                    {transaction.comment}
                  </td>
                  <td
                    className={`whitespace-nowrap py-4 ${
                      transaction.status === "Approved"
                        ? "text-green-600"
                        : transaction.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {transaction.status}
                  </td>
                  {transaction.status !== "Rejected" && (
                    <td
                      className="py-4 whitespace-nowrap"
                      onClick={() =>
                        setSelectedTransaction({
                          id: transaction._id,
                          index,
                        })
                      }
                    >
                      <svg
                        className="w-6 h-6 cursor-pointer text-mainColor"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </td>
                  )}
                  <td>
                    {selectedTransaction.id === transaction._id && (
                      <div className="absolute top-[20px] right-[80px] z-[10] flex flex-col space-y-2 rounded-md bg-mainColor p-[15px] text-center text-white">
                        <div>
                          <p className="underline underline-offset-1">
                            Change Status
                          </p>
                          <select
                            name="Change Status"
                            onChange={(e) => {
                              setStatus({ ...status, value: e.target.value });
                            }}
                            className="mt-[10px] w-full rounded-md bg-white px-2 py-[8px] text-base text-mainColor focus:outline-none"
                          >
                            <option value="">Choose</option>
                            <option value="Approved">Approve</option>
                            <option value="Rejected">Reject</option>
                          </select>
                          <br />
                          <textarea
                            className="mt-4 h-[80px]  rounded-md border border-mainColor px-[5px] py-[8px] text-sm text-mainColor focus:outline-0"
                            type="number"
                            placeholder="Add a comment"
                            onInput={(e) =>
                              setStatus({ ...status, comment: e.target.value })
                            }
                            defaultValue={transaction.adminComment}
                          ></textarea>
                        </div>
                        <button
                          onClick={updateTransaction}
                          disabled={!!status.value.length < 1}
                          className="mx-auto rounded-md bg-white  py-[5px] px-[20px] text-mainColor disabled:bg-gray-400"
                        >
                          Submit
                        </button>
                        <p
                          className="text-xs text-right cursor-pointer hover:text-gray-300 hover:underline"
                          onClick={() =>
                            setSelectedTransaction({ id: "", index: "" })
                          }
                        >
                          Close
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      )}
    </div>
  );
};

export default Agents;
Agents.getLayout = function getLayout(page) {
  return <Layout page="create-shipment">{page}</Layout>;
};
