import Shipment from "./../../../backend/shipmentModel";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  if (req.method === "POST") {
    await connectToDatabase();
    const session = await getSession({ req });
    if (!session || session?.user?.role !== "admin") {
      return res.status(200).json({
        status: "error",
        error: "You must be logged in!",
      });
    }

    const { agentId } = req.body;
    if (!agentId) {
      return res.status(200).json({
        status: "error",
        error: "incomplete query params!",
      });
    }

    try {
      const shipments = await Shipment.find({ user: agentId });
      return res.status(200).json({
        status: "success",
        data: shipments,
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        error: "An error occurred!",
      });
    }
  }
};
export default handler;
