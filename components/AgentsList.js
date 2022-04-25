import Image from "next/image";
const AgentsList = ({
  agents,
  format,
  setSelectedIndex,
  selectedIndex,
  handleClick,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
          >
            Photo
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
            Total KG
          </th>
          <th
            scope="col"
            className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase "
          >
            Joined{" "}
          </th>

          <th
            scope="col"
            className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
          >
            Wallet
          </th>

          <th
            scope="col"
            className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
          >
            Available
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
      {agents?.map((agent, index) => {
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
                <div className="relative h-[50px] w-[50px] rounded-full bg-mainColor">
                  {agent.photo ? (
                    <Image
                      className="rounded-full"
                      src={agent.photo}
                      alt={agent.fullname.toUpperCase().split(" ")[0]}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : null}
                </div>
              </td>
              <td className="max-w-[115px] whitespace-nowrap py-4 pl-2">
                <div className="text-sm font-medium text-gray-900">
                  {agent.fullname.toUpperCase().split(" ")[0]}{" "}
                  {agent.fullname.toUpperCase().split(" ")[1]}
                </div>
              </td>
              <td className="max-w-[100px]  py-4 ">
                {agent.agentId.toUpperCase()}
              </td>
              <td className="py-4 whitespace-nowrap">
                {(Math.round(totalKg * 10) / 10).toFixed(1) * 1 || 0}
              </td>
              <td className="max-w-[80px] py-4">
                {format(new Date(agent.createdAt), "dd-MM-yyyy")}
              </td>
              <td className="py-4 whitespace-nowrap">
                ₦{transformPrice(agent.wallet)}
              </td>
              <td className="py-4 whitespace-nowrap">
                {" "}
                ₦{transformPrice(agent.balance)}
              </td>
              <td className="py-4 whitespace-nowrap">
                {agent.suspended ? "Suspended" : "Active"}
              </td>
              <td
                className="py-4 whitespace-nowrap"
                onClick={() => setSelectedIndex(agent._id)}
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
              <td>
                {selectedIndex === agent._id && (
                  <div className="absolute top-[50px] right-[25px] z-[10] flex flex-col space-y-2 rounded-md bg-mainColor p-[15px] text-center text-white">
                    <p
                      className="cursor-pointer hover:text-gray-300 hover:underline"
                      onClick={() => handleClick("transactions")}
                    >
                      Transactions
                    </p>
                    <p
                      className="cursor-pointer hover:text-gray-300 hover:underline"
                      onClick={() => handleClick("shipments")}
                    >
                      Shipments
                    </p>
                    <p
                      className="cursor-pointer hover:text-gray-300 hover:underline"
                      onClick={() => {
                        if (agent.suspended) {
                          handleClick("activate");
                        } else {
                          handleClick("suspend");
                        }
                      }}
                    >
                      {agent.suspended ? "Reactivate" : "Suspend"}
                    </p>
                    <p
                      className="cursor-pointer hover:text-gray-300 hover:underline"
                      onClick={() => handleClick("delete")}
                    >
                      Delete
                    </p>
                    <p
                      className="text-xs text-right cursor-pointer hover:text-gray-300 hover:underline"
                      onClick={() => setSelectedIndex()}
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
  );
};

export default AgentsList;
