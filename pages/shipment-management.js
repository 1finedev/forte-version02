import { useState, Fragment, useEffect, useRef } from "react";
import { useSession, getSession } from "next-auth/react";
import { useAlert } from "react-alert";
import { saveAs } from "file-saver";
import axios from "axios";
import Batch from "./../backend/batchesModel";
import Layout from "./backLayout";
import { ShipmentCardAdmin, AdminStats } from "./../components";
import useBatch from "./../hooks/useBatch";
import useSearch from "./../hooks/useSearch";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { measureText } from "update-input-width";
import mockData from "./../mockData.json";

const Shipments = ({ batchData }) => {
  const { data: session } = useSession();
  // load router to check if shipments to display is from agent page
  const router = useRouter();
  const alert = useAlert();
  const {
    createBatch,
    batches,
    batchEnd,
    UpdateBatches,
    deleteBatch,
    currentBatch,
    fetchShipment,
    shipment,
    setShipment,
    selectedYear,
    selectedYearData,
    selectedMonth,
    selectedMonthData,
    loading,
  } = useBatch(batchData, router);

  const { isLoading, query, setQuery, setSearchType, setPath } = useSearch(
    setShipment,
    fetchShipment,
    router,
    currentBatch.startDate,
    batchEnd
  );

  const [editValues, setEditValues] = useState({
    shipmentId: "",
    name: "",
    destination: "",
    weight: "",
    carton: "",
    agentId: "",
    freight: "",
    customs: "",
    total: "",
    extraWeight: "",
  });

  const [editWidth, setEditWidth] = useState({
    name: 0,
    destination: 0,
    weight: 0,
    carton: 0,
    agentId: 0,
    freight: 0,
    customs: 0,
    total: 0,
    extraWeight: 0,
  });

  const [loadingFees, setLoadingFees] = useState({
    download: false,
    calculate: false,
  });
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [toggleBatch, setToggleBatch] = useState(false);
  const [toEdit, setToEdit] = useState(true);
  const [values, setValues] = useState({
    name: "",
    destination: "",
    weight: "",
    carton: "",
    agentId: "",
    freight: "",
    customs: "",
    total: "",
    extraWeight: 0,
  });
  const [calcValues, setCalcValues] = useState({
    freight: "",
    dollar: "",
    customs: "",
  });

  const [batchStats, setBatchStats] = useState({});

  // post a shipment
  const postOneShipment = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/shipments/createShipment", values);

    if (res.data.status === "success") {
      setShipment((prev) => [res.data.data, ...prev]);
      setValues({
        name: "",
        destination: "",
        weight: "",
        carton: "",
        agentId: "",
      });
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Shipment added successfully!
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

  useEffect(() => {
    // mockData.forEach((shipment, index) => {
    //   setTimeout(async () => {
    //     const res = await axios.post("/api/shipments/createShipment", {
    //       name: shipment.name,
    //       destination: shipment.destination,
    //       weight: shipment.weight,
    //       carton: shipment.carton,
    //       agentId: shipment.agentId,
    //     });
    //     if (res.data.status === "success") {
    //       console.log(`shipment ${index} with name ${shipment.name} added`);
    //     } else {
    //       console.log(res.data.error);
    //     }
    //   }, 3000);
    // });
  }, []);

  // download Manifest
  const downloadManifest = async () => {
    setLoadingFees({ ...loading, download: true });
    const data = await axios.post(
      "/api/shipments/downloadManifest",
      {
        batchStart: currentBatch.startDate,
        batchEnd,
      },
      {
        responseType: "blob",
      }
    );
    const pdfBlob = new Blob([data.data], { type: "application/xlsx" });
    setLoadingFees({ ...loading, download: false });

    return saveAs(
      pdfBlob,
      `${format(
        new Date(batchStats?.currentBatch?.startDate),
        "MMMM-yyyy"
      )}-Batch ${batchStats?.currentBatch?.batch}.xlsx`
    );
  };

  // calculate batch fees
  const calcBatchFees = async (e) => {
    e.preventDefault();
    setLoadingFees({ ...loading, calculate: true });
    const res = await axios.post("/api/shipments/calculateFees", {
      batchStart: currentBatch.startDate,
      batchEnd,
      ...calcValues,
    });

    if (res.data.status === "success") {
      setLoadingFees({ ...loading, calculate: false });
      fetchShipment();
      downloadManifest();
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          SUCCESS!!!, Downloading Manifest please wait...
        </div>,
        {
          type: "success",
        }
      );
    } else {
      setLoadingFees({ ...loading, calculate: false });
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

  //calculate Rebate

  const handleRebates = async () => {
    const res = await axios.post("/api/shipments/agentRebate", {
      batchStart: currentBatch.startDate,
      batchEnd,
    });

    if (res.data.status === "success") {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          SUCCESS!!!
        </div>,
        {
          type: "success",
        }
      );
    }
  };

  const handleMessages = async () => {
    if (shipment[0]?.dollarRate === null) {
      alert.show(
        <div
          className="text-white dark:text-white"
          style={{ textTransform: "initial", fontFamily: "Roboto" }}
        >
          Please calculate the fees before sending messages
        </div>,
        {
          type: "error",
        }
      );
    } else {
      const confirm =
        selectedShipments.length < 1
          ? "Are you sure you want send pickup messages all customers?\nPress OK to continue"
          : "Are you sure you want send pickup messages to selected customers?\nPress OK to continue";
      if (window.confirm(confirm) === true) {
        let timeout = 0;
        selectedShipments.length < 1
          ? shipment.forEach((shipment, index) => {
              setTimeout(async () => {
                alert.show(
                  <div
                    className="text-white dark:text-white"
                    style={{ textTransform: "initial", fontFamily: "Roboto" }}
                  >
                    Message sending in progress! Do not close this page!!!
                  </div>,
                  {
                    type: "success",
                  }
                );
                const res = await axios.post(
                  "/api/shipments/sendSingleMessage",
                  {
                    ...shipment,
                    currentBatch,
                  }
                );
                if (res.data.status === "success") {
                  alert.show(
                    <div
                      className="text-white dark:text-white"
                      style={{ textTransform: "initial", fontFamily: "Roboto" }}
                    >
                      {index + 1} of {shipment.length} messages sent
                      successfully!
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
              }, timeout);
              timeout += 5000;
            })
          : selectedShipments.forEach((shipment, index) => {
              setTimeout(async () => {
                alert.show(
                  <div
                    className="text-white dark:text-white"
                    style={{ textTransform: "initial", fontFamily: "Roboto" }}
                  >
                    Message sending in progress! Do not close this page!!!
                  </div>,
                  {
                    type: "success",
                  }
                );
                const res = await axios.post(
                  "/api/shipments/sendSingleMessage",
                  {
                    ...shipment,
                    currentBatch,
                  }
                );
                if (res.data.status === "success") {
                  alert.show(
                    <div
                      className="text-white dark:text-white"
                      style={{ textTransform: "initial", fontFamily: "Roboto" }}
                    >
                      {index + 1} of {shipment.length} messages sent
                      successfully!
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
              }, timeout);
              timeout += 5000;
            });
      } else {
        return;
      }
    }
  };

  useEffect(() => {
    const totalShipments = shipment?.length;
    const totalCartons = [...new Set(shipment?.map((item) => item.carton))]
      .length;
    const totalKG = shipment
      ?.map((item) => item.weight)
      .reduce((prev, next) => prev + next, 0);

    setBatchStats({
      currentBatch,
      totalShipments,
      totalCartons,
      totalKG,
    });
  }, [shipment, currentBatch]);

  const postEditedShipment = async ({ agentChanged }) => {
    try {
      const { agentId, ...values } = editValues;
      const res = await axios.post(
        `/api/shipments/${editValues.shipmentId}`,
        agentChanged === true
          ? { shipment: editValues }
          : { shipment: { ...values } }
      );
      if (res.data.status === "success") {
        // filter shipment and remove edited shipment
        const filteredShipments = shipment.filter(
          (item) => item._id !== editValues.shipmentId
        );

        // add edited shipment to the filtered shipments
        filteredShipments.splice(selectedIndex, 0, res.data.data);
        // set shipment back to state
        setShipment(filteredShipments);
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            Shipment edited successfully!
          </div>,
          {
            type: "success",
          }
        );
        setEditValues({
          name: "",
          destination: "",
          weight: "",
          extraWeight: "",
          carton: "",
          agentId: "",
          freight: "",
          customs: "",
          total: "",
        });
        setSelectedIndex(null);
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
    } catch (error) {
      console.log(error);
      alert.error("Something went wrong");
    }
  };

  const deleteShipment = async (shipmentId) => {
    const confirm =
      "Are you sure you want to delete this shipment?, This action is irreversible\nPress OK to continue";
    if (window.confirm(confirm) === true) {
      await axios
        .delete(`/api/shipments/${shipmentId}`)
        .then((res) => {
          if (res.data.status === "success") {
            // remove shipment from state
            setShipment((prev) =>
              prev.filter((item) => item._id !== shipmentId)
            );
            alert.show(
              <div
                className="text-white dark:text-white"
                style={{ textTransform: "initial", fontFamily: "Roboto" }}
              >
                Shipment deleted successfully!
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
        })
        .catch((err) => {
          console.log(err);
          alert.error("Something went wrong");
        });
    }
  };

  useEffect(() => {
    setEditWidth({
      name: measureText(
        editValues.name,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      destination: measureText(
        editValues.destination,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      weight: measureText(
        editValues.weight,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      carton: measureText(
        editValues.carton,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      agentId: measureText(
        editValues.agentId,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      freight: measureText(
        editValues.freight,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      customs: measureText(
        editValues.customs,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      total: measureText(
        editValues.total,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
      extraWeight: measureText(
        editValues.extraWeight,
        "500 14px / 20px Quattrocento, sans-serif"
      ),
    });
  }, [editValues, selectedIndex]);

  return (
    <div className="w-full font-brand">
      <AdminStats data={batchStats} />
      <div className="mt-[20px] flex justify-between">
        <button
          disabled={session?.user?.role === "mod" ? true : false}
          className="mt-[25px] cursor-pointer  rounded-lg bg-mainColor 
           p-[10px] text-white
            disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={() => {
            createBatch();
          }}
        >
          Create New Batch
        </button>
        <div className="relative mt-[25px] w-max flex-1 border-b border-mainColor text-center text-brandText">
          <input
            onInput={(e) => {
              setQuery(e.target.value);
              setSearchType("shipment");
            }}
            value={query}
            type="text"
            className="mt-[20px] w-full  flex-1 border-b border-mainColor text-center text-brandText focus:outline-0"
            placeholder="Search a shipment"
          />
          <select
            name="Filter"
            onChange={(e) => {
              setPath(e.target.value);
            }}
            className="text top-[0  absolute left-0 ml-[2px] rounded-tl-md rounded-tr-md bg-mainColor px-2 py-[12px] text-base text-white caret-current focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="carton">Carton</option>
            <option value="weight">Weight</option>
            <option value="location">location</option>
            <option value="agentId">Agent</option>
          </select>
          <p className="absolute top-[-18px] ml-[15px] text-sm text-brandText">
            Search by
          </p>
        </div>
        <div className="relative flex">
          <form className="flex">
            <div className="relative z-[1000] ">
              <input
                value={calcValues.freight}
                type="text"
                className="peer mt-[25px] h-[44px] w-[70px] border  border-dashed border-mainColor bg-transparent p-[5px]  text-center  text-mainColor placeholder-mainColor transition-all duration-700 ease-in-out focus:w-[70px] focus:outline-0"
                placeholder=""
                required
                onChange={(e) =>
                  setCalcValues({ ...calcValues, freight: e.target.value })
                }
              />
              <label className="absolute top-[52%] left-[25%] z-[-1] text-center text-xs text-mainColor transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-white peer-focus-within:z-[1000]  peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-white peer-focus-within:text-mainColor">
                Freight
              </label>
            </div>{" "}
            <div className="relative z-[1000] ">
              <input
                value={calcValues.dollar}
                type="text"
                className="peer mt-[25px] h-[44px] w-[70px] border  border-dashed border-mainColor bg-transparent p-[5px]  text-center  text-mainColor placeholder-mainColor transition-all duration-700 ease-in-out focus:w-[70px] focus:outline-0"
                placeholder=""
                required
                onChange={(e) =>
                  setCalcValues({ ...calcValues, dollar: e.target.value })
                }
              />
              <label className="absolute top-[52%] left-[20px] z-[-1] text-center text-xs text-mainColor transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-white peer-focus-within:z-[1000]  peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-white peer-focus-within:text-mainColor">
                Dollar
              </label>
            </div>{" "}
            <div className="relative z-[1000] ">
              <input
                value={calcValues.customs}
                type="text"
                className="peer mt-[25px] h-[44px] w-[70px] rounded-r-none border border-dashed border-mainColor bg-transparent p-[5px]  text-center  text-mainColor placeholder-mainColor transition-all duration-700 ease-in-out focus:w-[70px] focus:outline-0"
                placeholder=""
                required
                onChange={(e) =>
                  setCalcValues({ ...calcValues, customs: e.target.value })
                }
              />
              <label className="absolute top-[52%] left-[15px] z-[-1] text-center text-xs text-mainColor transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-white peer-focus-within:z-[1000]  peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-white peer-focus-within:text-mainColor">
                Customs
              </label>
            </div>{" "}
            <button
              className={`mt-[25px] cursor-pointer bg-mainColor p-[10px] text-white  disabled:cursor-not-allowed disabled:bg-gray-300 ${
                loadingFees.calculate ? " animate-pulse" : ""
              }`}
              onClick={(e) => calcBatchFees(e)}
              disabled={
                loadingFees.calculate || session?.user?.role === "sec"
                  ? true
                  : false
              }
            >
              {loadingFees.calculate ? "Calculating..." : "Calculate Fees"}
            </button>
          </form>
          <h6 className="absolute right-[70%] bottom-[45px] animate-pulse text-xs text-brandText">
            Enter calculation values{" "}
          </h6>
          <div className="relative">
            <div
              onClick={() => setToggleBatch(!toggleBatch)}
              className="mt-[25px] cursor-pointer border border-mainColor p-[10px] text-mainColor focus:outline-0"
            >
              Choose Batch &#x2193;
            </div>
            {toggleBatch && (
              <div
                data-aos="flip-down"
                className="absolute inset-0 mt-[72px] h-[110px] w-[135px] border border-mainColor bg-white"
              >
                {selectedYear ? (
                  <>
                    {selectedYear && selectedMonth ? (
                      <div className="mt-[10px] flex flex-col items-center justify-center text-mainColor">
                        <p>Choose Batch </p>
                        <div>
                          <select
                            name="batch"
                            onChange={(e) => {
                              UpdateBatches({
                                start: e.target.value,
                              });
                            }}
                            className="mt-[10px] rounded-lg bg-black px-[8px] py-[5px]  text-base text-white  caret-current focus:outline-none"
                          >
                            <option>Choose</option>
                            {selectedMonthData?.map((batch, index) => {
                              return (
                                <Fragment key={index}>
                                  <option Selected hidden disabled></option>
                                  <option value={batch?.startDate}>
                                    Batch: {batch?.batch}
                                  </option>
                                </Fragment>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-[10px] flex flex-col items-center justify-center text-mainColor">
                        <p>Choose Month </p>
                        <div>
                          <select
                            name="month"
                            onChange={(e) =>
                              UpdateBatches({
                                month: e.target.value,
                              })
                            }
                            className="mt-[10px] rounded-lg bg-black px-[8px] py-[5px] text-base text-white  caret-current focus:outline-none"
                          >
                            <option>Choose</option>
                            {selectedYearData?.map((month, index) => {
                              return (
                                <option key={index} value={month?.name}>
                                  {month?.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-[10px] flex flex-col items-center justify-center text-mainColor">
                    <p>Choose year</p>
                    <divide>
                      <select
                        name="year"
                        onChange={(e) =>
                          UpdateBatches({
                            year: e.target.value,
                          })
                        }
                        className="mt-[10px] rounded-lg bg-black px-[8px] py-[5px] text-base  text-white caret-current focus:outline-none"
                      >
                        <option>Choose</option>
                        {batches?.map((year, index) => {
                          return (
                            <option key={index} value={year?.year}>
                              {year?.year}
                            </option>
                          );
                        })}
                      </select>
                    </divide>
                  </div>
                )}
                <div className="flex justify-between">
                  {selectedYear && selectedMonth && (
                    <svg
                      className="mt-[10px] ml-[5px] h-6 w-6 cursor-pointer text-red-600"
                      onClick={deleteBatch}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <p
                    onClick={() => setToggleBatch(false)}
                    className="mt-[18px] cursor-pointer pr-[5px] text-right text-[10px] text-gray-900 underline"
                  >
                    Close
                  </p>
                </div>
              </div>
            )}
          </div>
          <h6 className="absolute right-[30%] bottom-[45px] animate-pulse text-xs text-brandText">
            Change Batch
          </h6>
          <button
            className={`mt-[25px] cursor-pointer bg-mainColor p-[10px] text-white disabled:cursor-not-allowed disabled:bg-gray-300 ${
              loadingFees.download ? " animate-pulse" : ""
            }`}
            onClick={downloadManifest}
            disabled={
              loadingFees.download || session?.user?.role === "sec"
                ? true
                : false
            }
          >
            {loadingFees.download ? "Downloading..." : "Download Manifest"}
          </button>
        </div>
      </div>
      {/* create Shipment */}
      <div className="mt-[2px] flex items-center space-x-[20px] rounded-lg bg-mainColor p-[15px]">
        <h5 className="text-center text-white">Add a shipment: </h5>
        <form className="flex justify-center space-x-[25px]">
          <div className="relative z-[1000]">
            <input
              value={values.name}
              type="text"
              className="peer mt-[5px] h-[40px] w-[150px] rounded-lg border-y border-dashed border-white bg-transparent p-[5px]  text-white/70 placeholder-brandText transition-all  duration-700 ease-in-out focus:w-[200px] focus:outline-0"
              placeholder=""
              required
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
            <label className="absolute top-[30%] left-[5px] z-[-1] text-sm  text-white transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-mainColor  peer-focus-within:z-[1000] peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-mainColor">
              Customer name
            </label>
          </div>
          <div className="relative  z-[1000] ">
            <input
              value={values.destination}
              type="text"
              className="peer mt-[5px]  h-[40px] w-[150px] rounded-lg border-y border-dashed border-white bg-transparent p-[5px]  text-white/70 placeholder-brandText transition-all  duration-700 ease-in-out focus:w-[200px] focus:outline-0"
              placeholder=""
              required
              onChange={(e) =>
                setValues({ ...values, destination: e.target.value })
              }
            />
            <label className="absolute top-[30%] left-[5px] z-[-1] text-sm text-white transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-mainColor  peer-focus-within:z-[1000] peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-mainColor">
              Destination{" "}
            </label>
          </div>{" "}
          <div className="relative  z-[1000] ">
            <input
              value={values.weight}
              type="number"
              className="peer mt-[5px]  h-[40px] w-[90px] rounded-lg border-y border-dashed border-white bg-transparent p-[5px]  text-white/70 placeholder-brandText transition-all  duration-700 ease-in-out focus:w-[120px] focus:outline-0"
              placeholder=""
              required
              onChange={(e) => setValues({ ...values, weight: e.target.value })}
            />
            <label className="absolute top-[30%] left-[5px] z-[-1] text-sm text-white transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-mainColor  peer-focus-within:z-[1000] peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-mainColor">
              Weight{" "}
            </label>
          </div>
          <div className="relative  z-[1000] ">
            <input
              value={values.carton}
              type="number"
              className="peer mt-[5px]  h-[40px] w-[90px] rounded-lg border-y border-dashed border-white bg-transparent p-[5px]  text-white/70 placeholder-brandText transition-all  duration-700 ease-in-out focus:w-[120px] focus:outline-0"
              placeholder=""
              required
              onChange={(e) => setValues({ ...values, carton: e.target.value })}
            />
            <label className="absolute top-[30%] left-[5px] z-[-1] text-sm text-white transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-mainColor  peer-focus-within:z-[1000] peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-mainColor">
              Carton{" "}
            </label>
          </div>
          <div className="relative  z-[1000] ">
            <input
              value={values.agentId}
              type="text"
              className="peer mt-[5px]  h-[40px] w-[100px] rounded-lg border-y border-dashed border-white bg-transparent p-[5px]  text-white/70 placeholder-brandText transition-all  duration-700 ease-in-out focus:w-[150px] focus:outline-0"
              placeholder=""
              required
              onChange={(e) =>
                setValues({ ...values, agentId: e.target.value })
              }
            />
            <label className="absolute top-[30%] left-[5px] z-[-1] text-sm text-white transition-all duration-700 ease-in-out peer-valid:z-[1000] peer-valid:-translate-y-[18px] peer-valid:scale-75 peer-valid:bg-mainColor  peer-focus-within:z-[1000] peer-focus-within:-translate-y-[19px] peer-focus-within:scale-75 peer-focus-within:transform peer-focus-within:bg-mainColor">
              Agent Code{" "}
            </label>
          </div>
          <button
            disabled={session?.user?.role === "mod"}
            type="submit"
            className="cursor-pointer rounded-lg bg-white  p-[5px] px-[45px] text-mainColor shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={postOneShipment}
          >
            Create
          </button>
        </form>
        <button
          onClick={handleMessages}
          disabled={
            shipment?.length === 0 || session?.user?.role === "sec"
              ? true
              : false
          }
          className="cursor-pointer rounded-lg bg-white  p-[5px] px-[45px] py-[10px] text-mainColor shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Send Messages
        </button>
        <button
          onClick={handleRebates}
          disabled={
            shipment?.length === 0 || session?.user?.role === "sec"
              ? true
              : false
          }
          className="cursor-pointer rounded-lg bg-white  p-[5px] px-[45px] py-[10px] text-mainColor shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Calculate Rebate
        </button>
      </div>

      {/* all shipments */}
      <ShipmentCardAdmin
        loading={loading}
        isLoading={isLoading}
        shipment={shipment}
        session={session}
        selectedIndex={selectedIndex}
        setEditValues={setEditValues}
        editValues={editValues}
        postEditedShipment={postEditedShipment}
        setSelectedIndex={setSelectedIndex}
        deleteShipment={deleteShipment}
        editWidth={editWidth}
        toEdit={toEdit}
        setToEdit={setToEdit}
        selectedShipments={selectedShipments}
        setSelectedShipments={setSelectedShipments}
      />
    </div>
  );
};

Shipments.getLayout = function getLayout(page) {
  return <Layout page="create-shipment">{page}</Layout>;
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (session?.user?.role === "agent") {
    return {
      redirect: {
        permanent: false,
        destination: "/profile",
      },
    };
  }
  // get all batches in the database
  try {
    const batches = await Batch.find({}).lean();

    return {
      props: { batchData: JSON.parse(JSON.stringify(batches)) },
    };
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

export default Shipments;
Shipments.auth = true;
