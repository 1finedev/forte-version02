import User from "../../../backend/userModel";
import Shipment from "../../../backend/shipmentModel";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  await connectToDatabase();
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session || session?.user?.role !== "admin") {
      return res.status(200).json({
        status: "error",
        error: "You are not logged in!",
      });
    }

    const { batchStart, batchEnd } = req.body;

    if (!batchStart || !batchEnd) {
      return res.status(200).json({
        status: "error",
        error: "Incomplete parameters!",
      });
    }

    const shipments = await Shipment.find({
      createdAt: { $gte: batchStart, $lte: batchEnd },
    });

    const data = req.body?.values?.length > 0 ? req.body?.values : shipments;
    console.log(data.length);
    if (!data || data.length === 0) {
      return res.status(200).json({
        status: "error",
        error: "No shipments found in this period!",
      });
    }

    data.forEach(async (shipment) => {
      if (index < 20) {
        // update balance
        let rebate;
        const dollarSide = process.env.DOLLAR_AGENT * 1;
        const nairaSide = process.env.NAIRA_AGENT * 1;
        const dollarAgent = shipment.weight * dollarSide;
        const nairaAgent = shipment.weight * nairaSide;
        const convertDollar = dollarAgent * shipment.dollarRate;
        const total = nairaAgent + convertDollar;
        rebate = (Math.round(total * 10) / 10).toFixed(0) * 1;

        if (shipment.calculated === false) {
          await User.findByIdAndUpdate(shipment.user, {
            $inc: {
              totalKg: shipment.weight,
              wallet: rebate,
              balance: rebate,
            },
          });
          await Shipment.findByIdAndUpdate(shipment._id, {
            calculated: true,
            rebate,
          });
        } else {
          await axios.post(
            "http://fortebridgelogistics.com/api/shipments/agentRebate",
            {
              values: arr.splice(20, data.length),
            }
          );
        }
      }
    });

    return res.status(200).json({
      status: "success",
      msg: "Rebates updated successfully!",
    });
  }
};

export default handler;
