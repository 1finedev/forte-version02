import { connectToDatabase } from "./../../../backend/dbConnect";
import Shipment from "./../../../backend/shipmentModel";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  await connectToDatabase();
  if (req.method === "POST") {
    const { batchStart, batchEnd } = req.body;

    if (!batchStart || !batchEnd) {
      return res.status(200).json({
        status: "error",
        error: "Batch start date must be provided!",
      });
    }

    let query;

    const session = await getSession({ req });
    if (!session) {
      return res.status(200).json({
        status: "error",
        msg: "You must be logged in!",
      });
    }

    if (session.user.role === "agent") {
      query = {
        createdAt: {
          $gte: batchStart,
          $lte: batchEnd ? batchEnd : new Date(Date.now()),
        },
        user: session.user._id,
      };
    } else {
      query = {
        createdAt: {
          $gte: batchStart,
          $lte: batchEnd ? batchEnd : new Date(Date.now()),
        },
      };
    }

    try {
      const shipments = await Shipment.find(query)
        .sort({ createdAt: -1 })
        .select(session.role === "sec" ? "-mobile" : "+mobile");

      return res.status(200).json({
        status: "success",
        data: shipments,
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        msg: error.message,
      });
    }
  }
};
export default handler;
