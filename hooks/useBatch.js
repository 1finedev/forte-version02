import axios from "axios";
import { useState, useEffect } from "react";
import { useAlert } from "react-alert";

const useBatch = (batchData, router) => {
  const alert = useAlert();
  const [batches, setBatches] = useState(batchData);
  const [loading, setLoading] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(
    batches[batches.length - 1]?.months?.[
      batches[batches.length - 1].months.length - 1
    ]?.batches?.[
      batches[batches.length - 1].months[
        batches[batches.length - 1].months.length - 1
      ].batches.length - 1
    ]
  );
  const [batchEnd, setBatchEnd] = useState(new Date(Date.now()));
  const [selectedYearData, setSelectedYearData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(false);
  const [selectedYearIndex, setSelectedYearIndex] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(false);
  const [shipment, setShipment] = useState();

  useEffect(() => {}, []);

  // shipment fetcher
  const fetchShipment = async () => {
    setLoading(true);
    const res = await axios.post("/api/shipments/getShipments", {
      batchStart: currentBatch.startDate,
      batchEnd,
    });
    setShipment(res.data.data);
    setLoading(false);
  };
  const fetchAgentShipments = async (agentId) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/shipments/getShipmentsAgent", {
        agentId,
      });
      if (res.data.status === "success") {
        setShipment(res.data.data);
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert.error("Something went wrong");
    }
  };

  // fetchShipments
  useEffect(() => {
    if (router?.query?.agent) {
      fetchAgentShipments(router.query.agent);
    } else {
      fetchShipment();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, batches, currentBatch]);

  // get Batches
  const getBatch = async () => {
    const res = await axios.get("/api/batches/getBatches");

    setBatches(res?.data?.data);
    setCurrentBatch(
      res?.data?.data[res?.data?.data.length - 1]?.months?.[
        res?.data?.data[res?.data?.data.length - 1].months.length - 1
      ]?.batches?.[
        res?.data?.data[res?.data?.data.length - 1].months[
          res?.data?.data[res?.data?.data.length - 1].months.length - 1
        ].batches.length - 1
      ]
    );
  };

  // create a batch
  const createBatch = async () => {
    const res = await axios.get("/api/batches/createBatch");
    setSelectedYear(null);
    setSelectedMonth(false);
    setSelectedYearData([]);
    setSelectedMonthIndex(null);
    setSelectedMonth(false);
    setSelectedMonthData([]);
    getBatch();
    fetchShipment();
    return res.data.status;
  };

  // delete batch
  const deleteBatch = async () => {
    const confirm =
      "Are you sure you want to delete this batch?, This action is irreversible\nPress OK to continue";
    if (window.confirm(confirm) === true) {
      const res = await axios.post("/api/batches/deleteBatch", {
        year: batches?.[selectedYearIndex]?.year,
        batchId: currentBatch._id,
        monthId:
          batches?.[selectedYearIndex]?.months?.[selectedMonthIndex]?._id,
        batchLength:
          batches?.[selectedYearIndex]?.months?.[selectedMonthIndex]?.batches
            .length,
      });
      setSelectedYear(null);
      setSelectedMonth(false);
      setSelectedYearData([]);
      setSelectedMonthIndex(null);
      setSelectedMonth(false);
      setSelectedMonthData([]);
      getBatch();
      fetchShipment();

      if (res.data.status === "success") {
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            Batch deleted successfully!
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
    } else {
      return;
    }
  };

  // update batches
  const UpdateBatches = ({ start, year, month }) => {
    const index = batches?.[selectedYearIndex]?.months?.[
      selectedMonthIndex
    ]?.batches?.findIndex((b) => b.startDate === start);
    if (start) {
      let batchEnd;

      if (
        // if current batch is last batch in month
        !batches?.[selectedYearIndex]?.months?.[selectedMonthIndex]?.batches?.[
          index + 1
        ]?.startDate
      ) {
        if (
          // if another month exists after previous batch which was the last in its month
          batches?.[selectedYearIndex]?.months?.[selectedMonthIndex + 1]
            ?.batches?.[0]?.startDate
        ) {
          batchEnd =
            batches?.[selectedYearIndex]?.months?.[selectedMonthIndex + 1]
              ?.batches?.[0]?.startDate;
        } else {
          if (
            // if another year exists after previous batch which was the last in its year
            batches?.[selectedYearIndex + 1]?.months?.[0]?.batches?.[0]
              .startDate
          ) {
            batchEnd =
              batches?.[selectedYearIndex + 1]?.months?.[0]?.batches?.[0]
                .startDate;
          } else {
            batchEnd = new Date(Date.now());
          }
        }
      } else {
        // if another batch exists in the same month as current batch
        batchEnd =
          batches?.[selectedYearIndex]?.months?.[selectedMonthIndex]?.batches?.[
            index + 1
          ]?.startDate;
      }

      setCurrentBatch(
        batches?.[selectedYearIndex]?.months?.[selectedMonthIndex]?.batches?.[
          index
        ]
      );
      setBatchEnd(batchEnd);
    } else if (year) {
      const index = batches.findIndex((b) => b.year == year);
      setSelectedYear(year);
      setSelectedMonth(false);
      setSelectedYearData(batches?.[index]?.months);
      setSelectedYearIndex(index);
    } else if (month) {
      const index = batches?.[selectedYearIndex]?.months.findIndex(
        (m) => m.name == month
      );
      setSelectedMonthIndex(index);
      setSelectedMonth(false);
      setSelectedMonthData(
        batches?.[selectedYearIndex]?.months?.[index]?.batches
      );
      setTimeout(() => {
        setSelectedMonth(true);
      }, 10);
    }
  };

  return {
    getBatch,
    createBatch,
    batches,
    batchEnd,
    UpdateBatches,
    deleteBatch,
    currentBatch,
    selectedYear,
    selectedYearData,
    selectedMonth,
    selectedMonthData,
    shipment,
    loading,
    fetchShipment,
    setShipment,
  };
};

export default useBatch;
