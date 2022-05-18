import { connectToDatabase } from "./../../backend/dbConnect";
import { useState } from "react";
import router from "next/router";
import { format } from "date-fns";
import Batch from "./../../backend/batchesModel";
import Shipments from "./../../backend/shipmentModel";
import useBatch from "../../hooks/useBatch";
import useSearch from "../../hooks/useSearch";
import { getSession } from "next-auth/react";
import {
  AgentShipmentCard,
  ShipmentSearch,
  ChooseBatch,
  PageNav,
  Layout,
} from "./../../components";

const AgentShipment = ({ batchData, shipments }) => {
  const {
    batches,
    UpdateBatches,
    currentBatch,
    selectedYear,
    selectedYearData,
    selectedMonth,
    selectedMonthData,
    shipment,
    loading,
    fetchShipment,
    setShipment,
  } = useBatch(batchData, shipment);

  const { query, setQuery, isLoading } = useSearch(setShipment, fetchShipment);

  const [collapse, setCollapse] = useState(false);

  const handleUpdate = ({ shipment }) => {
    localStorage.setItem(`${shipment.name.trim()}`, JSON.stringify(shipment));
    router.push(`/shipments/${shipment?.name.trim()}`);
  };

  return (
    <div className="min-h-[100vh] bg-mainColor text-black">
      <Layout>
        <PageNav />
        <div className="mt-[-20px] p-[20px] font-heading ">
          <ChooseBatch
            collapse={collapse}
            setCollapse={setCollapse}
            UpdateBatches={UpdateBatches}
            batches={batches}
            selectedYear={selectedYear}
            selectedYearData={selectedYearData}
            selectedMonth={selectedMonth}
            selectedMonthData={selectedMonthData}
          />
          <div className="mt-[20px] text-sm text-white">
            <div className="mt-[10px] flex space-x-[5px]">
              <p className="mr-[8px] min-w-[35%] text-right font-bold">
                Current Batch:
              </p>
              <p>
                Batch {currentBatch?.batch}, (
                {format(new Date(currentBatch?.startDate), "dd-MM-yyyy")})
              </p>
            </div>
            <div className="mt-[5px] flex  space-x-[5px] text-right">
              <p className="mr-[8px] min-w-[35%] font-bold">Total Shipments:</p>
              <p>{shipment?.length}</p>
            </div>
            <div className="mt-[5px] flex space-x-[5px]">
              <p className="mr-[8px] min-w-[35%] text-right font-bold">
                Total KG:
              </p>
              <p>{shipment?.reduce((a, b) => a + b.weight, 0)}</p>
            </div>
          </div>
          <ShipmentSearch query={query} setQuery={setQuery} />
          <AgentShipmentCard
            isLoading={isLoading}
            loading={loading}
            shipment={shipment}
            handleUpdate={handleUpdate}
          />
        </div>
      </Layout>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  await connectToDatabase();
  // get all batches in the database

  const session = await getSession({ req });

  if (!session || session.user.role !== "agent") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const batches = await Batch.find({}).lean();
    const batchStart =
      batches[batches.length - 1]?.months?.[
        batches[batches.length - 1].months.length - 1
      ]?.batches?.[
        batches[batches.length - 1].months[
          batches[batches.length - 1].months.length - 1
        ].batches.length - 1
      ]?.startDate;
    try {
      const data = await Shipments.find({
        createdAt: { $gte: batchStart, $lte: new Date(Date.now()) },
        user: session.user._id,
      })
        .sort({ createdAt: -1 })
        .lean();
      const shipments = JSON.parse(JSON.stringify(data));
      return {
        props: {
          batchData: JSON.parse(JSON.stringify(batches)),
          shipments,
        },
      };
    } catch (e) {
      console.log(e);
    }
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
}

export default AgentShipment;
AgentShipment.auth = true;
