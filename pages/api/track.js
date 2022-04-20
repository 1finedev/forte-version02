import Shipment from "./../../backend/shipmentModel";
const handler = async (req, res) => {
  if (req.method === "POST") {
    const { shipCode } = req.body;
    if (!shipCode) {
      return res
        .status(200)
        .json({ status: "error", error: "Tracking code is required!" });
    }

    try {
      const shipment = await Shipment.findOne({ shipCode });

      if (!shipment) {
        return res
          .status(200)
          .json({ status: "error", error: "Shipment not found!" });
      }

      return res.status(200).json({ status: "success", data: shipment });
    } catch (err) {
      return res
        .status(200)
        .json({ status: "error", error: "Something went wrong" });
    }
  } else {
    return res
      .status(200)
      .json({ status: "error", error: "POST request expected from client" });
  }
};
export default handler;
