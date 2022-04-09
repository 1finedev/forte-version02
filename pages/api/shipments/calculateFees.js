import Shipment from "../../../backend/shipmentModel";
import User from "../../../backend/userModel";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { freight, customs, dollar, batchStart, batchEnd } = req.body;
    if (!freight || !customs || !dollar || !batchStart || !batchEnd) {
      return res
        .status(200)
        .json({ status: "error", error: "Incomplete parameters!" });
    }

    const data = await Shipment.find({
      createdAt: { $gte: batchStart, $lte: batchEnd },
      destination: { $ne: "GHANA" },
    });

    const calc = await Promise.all(
      data.map(async (shipment) => {
        const freightRate = freight * 1;
        const customsRate = customs * 1;
        const dollarRate = dollar * 1;
        // calculate Fee
        const weight = (shipment.weight + shipment.extraWeight) * 1;
        const freightInDollars = freightRate * weight;
        const freightCalc = freightInDollars * dollarRate;
        const freightTotal = (Math.round(freightCalc * 10) / 10).toFixed(1) * 1;
        const customsTot = customsRate * weight;
        const customsTotal = (Math.round(customsTot * 10) / 10).toFixed(1) * 1;
        const amountDue = Math.round(freightTotal + customsTotal);

        // update shipment and lock
        await Shipment.findByIdAndUpdate(
          shipment._id,
          {
            freightRate,
            customsRate,
            dollarRate,
            freightTotal,
            customsTotal,
            amountDue,
            freightInDollars,
            locked: true,
            shipStatus: "WAREHOUSE",
          },
          {
            new: true,
            runValidators: true,
          }
        );
        // update user balances
        const dollarSide = process.env.DOLLAR_AGENT;
        const nairaSide = process.env.NAIRA_AGENT;
        const dollarAgent = shipment.weight * dollarSide;
        const nairaAgent = shipment.weight * nairaSide;
        const convertDollar = dollarAgent * dollarRate;
        const total = nairaAgent + convertDollar;

        if (shipment.calculated === false) {
          await Shipment.findByIdAndUpdate(shipment._id, {
            calculated: true,
            rebate: total,
            dollarSide,
            nairaSide,
          });
          await User.findByIdAndUpdate(shipment.user, {
            $inc: {
              totalKg: weight,
              wallet: total,
              balance: total,
            },
          });
        }
      })
    );
    await calc;
    return res.status(200).json({
      status: "success",
    });
  }
};

export default handler;
