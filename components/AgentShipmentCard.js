import { useAlert } from "react-alert";

const AgentShipmentCard = ({ loading, shipment, handleUpdate, isLoading }) => {
  const alert = useAlert();
  return (
    <div className="mb-[80px] ">
      {loading || isLoading ? (
        <p className="text-center text-white">
          Loading shipments, Please wait...
        </p>
      ) : (
        <>
          {shipment?.length < 1 ? (
            <p className="font-medium text-center text-white">
              😔 No shipment found in this batch!
            </p>
          ) : (
            <>
              {shipment?.map((shipment, index) => {
                console.log(shipment);
                return (
                  <div
                    key={index}
                    className="relative mt-[10px]  cursor-pointer rounded-xl border bg-white p-2 text-xs text-white shadow-2xl"
                    onClick={() => {
                      !shipment.locked
                        ? handleUpdate({
                            shipment,
                          })
                        : alert.show(
                            <div
                              className="text-white dark:text-white"
                              style={{
                                textTransform: "initial",
                                fontFamily: "Roboto",
                              }}
                            >
                              This shipment is locked!
                            </div>,
                            {
                              type: "error",
                            }
                          );
                    }}
                  >
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="py-3 pl-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            DEST.
                          </th>
                          <th
                            scope="col"
                            className="py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            KG
                          </th>
                          <th
                            scope="col"
                            className="py-3 pl-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            PHONE
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="min-w-[100px] max-w-[100px] overflow-ellipsis py-4 pl-2">
                            <p className="text-xs font-medium text-left text-gray-900 font-brand">
                              {shipment.name}
                            </p>
                          </td>
                          <td className="py-4 pl-2 whitespace-nowrap">
                            <p className="text-xs font-medium text-gray-900 font-brand">
                              {shipment.destination.toUpperCase()}
                            </p>
                          </td>
                          <td className="py-4 whitespace-nowrap">
                            <p className="text-xs font-bold text-gray-900 font-brand">
                              {shipment.weight}{" "}
                              {shipment?.extraWeight > 0
                                ? `+${shipment.extraWeight}`
                                : ""}
                            </p>
                          </td>
                          <td className="py-4 pl-4 whitespace-nowrap">
                            <p className="text-xs font-bold text-gray-900 font-brand">
                              {shipment.mobile ? `+${shipment.mobile}` : "N/A"}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {shipment.locked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute w-5 h-5 text-red-500 top-4 right-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AgentShipmentCard;
