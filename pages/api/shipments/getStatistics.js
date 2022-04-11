import Shipment from "./../../../backend/shipmentModel";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  if (req.method === "GET") {
    await connectToDatabase();
    const session = await getSession(req);
    if (!session) {
      return res.status(200).json({
        status: "error",
        msg: "You must be logged in!",
      });
    }

    try {
      const statistics = await Shipment.aggregate([
        {
          $match: { user: session.user._id },
        },
        {
          $group: {
            _id: null,
            totalKg: {
              $sum: "$weight",
            },
            totalShipments: {
              $sum: 1,
            },
          },
        },
      ]);
      return res.status(200).json({
        status: "success",
        data: statistics,
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        msg: "Something went wrong!",
      });
    }
  } else {
    return res.status(200).json({
      status: "error",
      msg: "Invalid request method!",
    });
  }
};
export default handler;
