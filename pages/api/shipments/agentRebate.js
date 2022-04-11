import User from "../../../backend/userModel";
import Shipment from "../../../backend/shipmentModel";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
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

    const data = await Shipment.find({
      createdAt: { $gte: batchStart, $lte: batchEnd },
    });

    if (!data || data.length === 0) {
      return res.status(200).json({
        status: "error",
        error: "No shipments found in this period!",
      });
    }

    Promise.all(
      data.forEach(async (shipment) => {
        // // update balance

        let rebate;
        const dollarSide = process.env.DOLLAR_AGENT * 1;
        const nairaSide = process.env.NAIRA_AGENT * 1;
        const dollarAgent = weight * dollarSide;
        const nairaAgent = weight * nairaSide;
        const convertDollar = dollarAgent * shipment.dollarRate;
        const total = nairaAgent + convertDollar;

        if (shipment.extraWeight > 0) {
          const freightInDollars = shipment.freightRate * extraWeight;
          const freightCalc = freightInDollars * shipment.dollarRate;
          const freightTotal =
            (Math.round(freightCalc * 10) / 10).toFixed(1) * 1;
          const customsTot = shipment.customsRate * weight;
          const customsTotal =
            (Math.round(customsTot * 10) / 10).toFixed(1) * 1;
          const amountDue = Math.round(freightTotal + customsTotal);
          const addedTotal = total + amountDue;
          rebate = (Math.round(addedTotal * 10) / 10).toFixed(1) * 1;
        } else {
          rebate = (Math.round(total * 10) / 10).toFixed(1) * 1;
        }
        if (!shipment.calculated) {
          await User.findByIdAndUpdate(shipment.user, {
            $inc: {
              totalKg: weight,
              wallet: rebate,
              balance: rebate,
            },
            calculated: true,
          });
        }
      })
    );

    return res.status(200).json({
      status: "success",
      msg: "Rebates updated successfully!",
    });
  }
};

export default handler;
