import { getSession } from "next-auth/react";
import Layout from "./backLayout";
import { useState, useEffect } from "react";
import axios from "axios";

const Console = () => {
  const transformPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const [statistics, setStatistics] = useState([]);

  const getStatistics = async () => {
    const res = await axios.get("/api/dashStatistics");
    setStatistics(res.data.data);
  };

  useEffect(() => {
    getStatistics();
  }, []);
  return (
    <div>
      <div className="mt-[5px]  rounded-lg  bg-white p-[5px] pr-[10px]">
        <div className="mb-[20px] flex justify-between">
          <div className="w-full rounded-lg bg-gray-300 p-4 shadow-md">
            <div className="flex justify-between p-[5px]">
              <div className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg">
                <p className="mt-[10px] mb-[5px] font-brand text-2xl">
                  {transformPrice(statistics[4]?.[0]?.totalShipments || 0)}
                </p>
                <p className="text-xs text-gray-900">Total Shipments</p>
                <p className="text-xs text-gray-900">(Current)</p>
              </div>
              <div className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg">
                <p className="mt-[10px] mb-[5px] font-brand text-2xl">
                  {transformPrice(statistics[4]?.[0]?.tKg || 0)}
                </p>
                <p className="text-xs text-gray-900">Total Kilograms</p>
                <p className="text-xs text-gray-900">(Current)</p>
              </div>
              {statistics[1]?.map((stats, index) => (
                <div
                  key={index}
                  className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg"
                >
                  <p className="mt-[10px] mb-[5px] font-brand text-2xl">
                    {transformPrice(stats.count || 0)}
                  </p>
                  <p className="text-xs text-gray-900">Total {stats._id}</p>
                  <p className="text-xs text-gray-900">(Current)</p>
                </div>
              ))}
              <div className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg">
                <p className="mb-[5px] mt-[10px] font-brand text-2xl">
                  {transformPrice(statistics[3]?.[0]?.totalShipments || 0)}
                </p>
                <p className="text-xs text-gray-900">Total Shipments</p>
                <p className="text-xs text-gray-900">(All time)</p>
              </div>
              <div className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg">
                <p className="mt-[10px] mb-[5px] font-brand text-2xl">
                  {transformPrice(statistics[3]?.[0]?.tKg || 0)}
                </p>
                <p className="text-xs text-gray-900">Total Kilograms</p>
                <p className="text-xs text-gray-900">(All time)</p>
              </div>
              <div className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg">
                <p className="mt-[10px] mb-[5px] font-brand text-2xl">
                  {transformPrice(statistics[2]?.[0]?.tKg || 0)}
                </p>
                <p className="text-xs text-gray-900">
                  (
                  {transformPrice(statistics[2]?.[0]?.agentId?.toUpperCase()) ||
                    0}
                  )
                </p>
                <p className="text-xs text-gray-900">Top Agent</p>
              </div>
              <div className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg">
                <p className="mt-[10px] mb-[5px] font-brand text-2xl">
                  {transformPrice(statistics[0]?.[2]?.count || 0)}
                </p>
                <p className="text-xs text-gray-900">Total Agents</p>
              </div>

              <div className="flex min-w-[120px] flex-col items-center  rounded-2xl bg-white p-2 text-mainColor shadow-lg">
                <p className="mt-[10px] mb-[5px] font-brand text-2xl">
                  {transformPrice(
                    statistics[0]?.[0]?.count +
                      statistics[0]?.[1]?.count +
                      statistics[0]?.[3]?.count || 0
                  )}
                </p>
                <p className="text-xs text-gray-900">Total Staff</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex  space-x-12 p-[5px]">
        <div className="flex flex-1 justify-around text-white">
          <p className="cursor-pointer rounded-xl bg-mainColor py-[10px] px-[30px] hover:shadow-lg">
            Create a shipment
          </p>
          <p className="cursor-pointer rounded-xl bg-mainColor py-[10px] px-[30px] hover:shadow-lg">
            Track a shipment
          </p>
          <p className="cursor-pointer rounded-xl bg-mainColor py-[10px] px-[30px] hover:shadow-lg">
            Go to agents
          </p>
          <p className="cursor-pointer rounded-xl bg-mainColor py-[10px] px-[30px] hover:shadow-lg">
            View requests
          </p>
          <p className="cursor-pointer rounded-xl bg-mainColor py-[10px] px-[30px] hover:shadow-lg">
            Go to finances
          </p>
        </div>
      </div>
    </div>
  );
};

export default Console;
Console.auth = true;

Console.getLayout = function getLayout(page) {
  return <Layout page="dashboard">{page}</Layout>;
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (session?.user?.role !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/profile",
      },
    };
  }
  return {
    props: {},
  };
}
