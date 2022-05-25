const ShipmentCardAdmin = ({
  selectedShipments,
  setSelectedShipments,
  loading,
  shipment,
  isLoading,
  session,
  editWidth,
  selectedIndex,
  setEditValues,
  editValues,
  postEditedShipment,
  setSelectedIndex,
  deleteShipment,
}) => {
  const transformPrice = (price) => {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className="bg-[#E9ECEF] p-[10px] px-[10px]">
      <h4 className="py-[30px] text-center text-xl">
        {loading || isLoading ? (
          <p>Loading Shipments, please wait...</p>
        ) : (
          <>
            {shipment?.length < 1 ? (
              <p className="text-center text-mainColor">
                😔 No shipment(s) found!
              </p>
            ) : (
              <>{shipment?.length} SHIPMENT(S) FOUND</>
            )}
          </>
        )}
      </h4>
      <div className="flex flex-col ">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm: lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </th>
                    <th
                      scope="col"
                      className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Tracking
                    </th>
                    <th
                      scope="col"
                      className="max-w-[150px] py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Weight
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Extra
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase "
                    >
                      Dest.
                    </th>

                    <th
                      scope="col"
                      className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Carton
                    </th>

                    <th
                      scope="col"
                      className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Agent
                    </th>
                    {session?.user?.role === "admin" && (
                      <>
                        <th
                          scope="col"
                          className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          freight
                        </th>
                        <th
                          scope="col"
                          className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Custom
                        </th>
                        <th
                          scope="col"
                          className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          total
                        </th>
                      </>
                    )}
                    <th
                      scope="col"
                      className="max-w-[90px] py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Phone
                    </th>
                    <th scope="col" className="relative py-3 ">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                {shipment?.map((ship, index) => {
                  return (
                    <tbody
                      key={index}
                      className="bg-white divide-y divide-gray-200 "
                    >
                      <tr>
                        <td
                          scope="col"
                          className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (!e.target.checked) {
                                setSelectedShipments((prevstate) =>
                                  prevstate.filter(
                                    (ships) => ships?._id !== ship._id
                                  )
                                );
                              } else {
                                setSelectedShipments((prevstate) => [
                                  ...prevstate,
                                  ship,
                                ]);
                              }
                            }}
                            checked={
                              selectedShipments.includes(ship) ? true : false
                            }
                          />
                        </td>
                        <td className="py-4 pl-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ship.shipCode}
                          </div>
                        </td>
                        <td className="max-w-[100px]  py-4 ">
                          <div
                            className={`${
                              selectedIndex === index && "relative "
                            } text-sm font-medium text-gray-900`}
                          >
                            <span className="absolute z-[-1] opacity-0">
                              {editValues.name}
                            </span>
                            {selectedIndex === index ? (
                              <input
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    name: e.target.value,
                                  })
                                }
                                autoFocus
                                type="text"
                                defaultValue={editValues.name}
                                className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                style={{
                                  width: editWidth.name,
                                }}
                              />
                            ) : (
                              ship.name
                            )}
                          </div>
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <div
                            className={`${
                              selectedIndex === index && "relative "
                            } text-sm font-medium text-gray-900`}
                          >
                            <span className="absolute z-[-1] opacity-0">
                              {editValues.weight}
                            </span>
                            {selectedIndex === index ? (
                              <input
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    weight: e.target.value,
                                  })
                                }
                                type="text"
                                defaultValue={editValues.weight}
                                className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                style={{
                                  width: editWidth.weight,
                                }}
                              />
                            ) : (
                              ship.weight
                            )}
                          </div>
                        </td>
                        <td className="py-4 whitespace-nowrap">
                          <div
                            className={`${
                              selectedIndex === index && "relative "
                            } text-sm font-medium text-gray-900`}
                          >
                            <span className="absolute z-[-1] opacity-0">
                              {editValues?.extraWeight}
                            </span>
                            {selectedIndex === index ? (
                              <input
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    extraWeight: e.target.value,
                                  })
                                }
                                type="text"
                                defaultValue={editValues.extraWeight}
                                className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                style={{
                                  width: editWidth.extraWeight,
                                }}
                              />
                            ) : (
                              ship.extraWeight
                            )}
                          </div>
                        </td>
                        <td className="max-w-[80px] py-4">
                          <div
                            className={`${
                              selectedIndex === index && "relative "
                            } text-sm font-medium text-gray-900`}
                          >
                            <span className="absolute z-[-1] opacity-0">
                              {editValues.destination.toUpperCase()}
                            </span>
                            {selectedIndex === index ? (
                              <input
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    destination: e.target.value,
                                  })
                                }
                                type="text"
                                defaultValue={editValues.destination.toUpperCase()}
                                className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                style={{
                                  width: editWidth.destination,
                                }}
                              />
                            ) : (
                              ship.destination.toUpperCase()
                            )}
                          </div>
                        </td>
                        <td className="py-4 whitespace-nowrap">
                          <div
                            className={`${
                              selectedIndex === index && "relative "
                            } text-sm font-medium text-gray-900`}
                          >
                            <span className="absolute z-[-1] opacity-0">
                              {editValues.carton}
                            </span>
                            {selectedIndex === index ? (
                              <input
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    carton: e.target.value,
                                  })
                                }
                                type="text"
                                defaultValue={editValues.carton}
                                className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                style={{
                                  width: editWidth.carton,
                                }}
                              />
                            ) : (
                              ship.carton
                            )}
                          </div>
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <div
                            className={`${
                              selectedIndex === index && "relative "
                            } text-sm font-medium text-gray-900`}
                          >
                            <span className="absolute z-[-1] opacity-0">
                              {editValues.agentId}
                            </span>
                            {selectedIndex === index ? (
                              <input
                                onChange={(e) =>
                                  setEditValues({
                                    ...editValues,
                                    agentId: e.target.value,
                                  })
                                }
                                type="text"
                                defaultValue={editValues.agentId}
                                className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                style={{
                                  width: editWidth.agentId,
                                }}
                              />
                            ) : (
                              ship?.user?.agentId?.toUpperCase()
                            )}
                          </div>
                        </td>
                        {session?.user?.role === "admin" && (
                          <>
                            <td className="py-4 whitespace-nowrap">
                              <div
                                className={`${
                                  selectedIndex === index && "relative "
                                } text-sm font-medium text-gray-900`}
                              >
                                <span className="absolute z-[-1] opacity-0">
                                  {editValues.freight}
                                </span>
                                {selectedIndex === index ? (
                                  <input
                                    onChange={(e) =>
                                      setEditValues({
                                        ...editValues,
                                        freight: e.target.value,
                                      })
                                    }
                                    type="text"
                                    defaultValue={editValues.freight}
                                    className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                    style={{
                                      width: editWidth.freight,
                                    }}
                                  />
                                ) : (
                                  <> ₦{transformPrice(ship.freightTotal)}</>
                                )}
                              </div>
                            </td>
                            <td className="py-4 whitespace-nowrap">
                              <div
                                className={`${
                                  selectedIndex === index && "relative "
                                } text-sm font-medium text-gray-900`}
                              >
                                <span className="absolute z-[-1] opacity-0">
                                  {editValues.customs}
                                </span>
                                {selectedIndex === index ? (
                                  <input
                                    onChange={(e) =>
                                      setEditValues({
                                        ...editValues,
                                        customs: e.target.value,
                                      })
                                    }
                                    type="text"
                                    defaultValue={editValues.customs}
                                    className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                    style={{
                                      width: editWidth.customs,
                                    }}
                                  />
                                ) : (
                                  <> ₦{transformPrice(ship.customsTotal)}</>
                                )}
                              </div>
                            </td>
                            <td className="py-4 whitespace-nowrap">
                              <div
                                className={`${
                                  selectedIndex === index && "relative "
                                } text-sm font-medium text-gray-900`}
                              >
                                <span className="absolute z-[-1] opacity-0">
                                  {editValues.total}
                                </span>
                                {selectedIndex === index ? (
                                  <input
                                    onChange={(e) =>
                                      setEditValues({
                                        ...editValues,
                                        total: e.target.value,
                                      })
                                    }
                                    type="text"
                                    defaultValue={editValues.total}
                                    className="min-w-0 uppercase border-0 text-mainColor focus:outline-0"
                                    style={{
                                      width: editWidth.total,
                                    }}
                                  />
                                ) : (
                                  <>₦{transformPrice(ship.amountDue)}</>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                        <td className="max-w-[90px] py-4">
                          <div className="text-sm text-gray-900">
                            {ship?.mobile}
                          </div>
                        </td>

                        <td className="flex items-center py-4 space-x-2 text-sm font-medium text-right whitespace-nowrap ">
                          <span
                            className="cursor-pointer hover:text-mainColor "
                            onClick={() => {
                              if (session?.user?.role === "mod") return;
                              if (selectedIndex === index) {
                                if (
                                  editValues.agentId ===
                                  ship.user.agentId.toUpperCase()
                                ) {
                                  postEditedShipment({
                                    agentChanged: false,
                                  });
                                } else {
                                  postEditedShipment({
                                    agentChanged: true,
                                  });
                                }
                              } else {
                                setEditValues({
                                  shipmentId: ship._id,
                                  name: ship.name,
                                  destination: ship.destination,
                                  weight: ship.weight,
                                  carton: ship.carton,
                                  agentId: ship.user.agentId.toUpperCase(),
                                  freight: ship.freightTotal,
                                  customs: ship.customsTotal,
                                  total: ship.amountDue,
                                  extraWeight: ship.extraWeight,
                                });
                                setSelectedIndex(index);
                              }
                            }}
                          >
                            {selectedIndex === index ? "Save" : " Edit"}
                          </span>
                          <span>
                            <svg
                              onClick={() =>
                                session?.user?.role === "mod"
                                  ? null
                                  : deleteShipment(ship._id)
                              }
                              className="w-4 h-4 text-red-800 cursor-pointer hover:text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCardAdmin;
