import Shipment from "./../../../backend/shipmentModel";
import { getSession } from "next-auth/react";
import User from "../../../backend/userModel";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  await connectToDatabase();
  const session = await getSession({ req });

  if (!session) {
    return res.status(200).json({
      status: "error",
      error: "You must be logged in!",
    });
  }

  if (session.user.role === "agent") {
    req.body.shipment.weight = undefined;
    req.body.shipment.extraWeight = undefined;
    req.body.shipment.dollarRate = undefined;
    req.body.shipment.discount = undefined;
    req.body.shipment.carton = undefined;
    req.body.shipment.amountDue = undefined;
    req.body.shipment.customsRate = undefined;
    req.body.shipment.customsTotal = undefined;
    req.body.shipment.freightInDollars = undefined;
    req.body.shipment.freightRate = undefined;
    req.body.shipment.freightTotal = undefined;
    req.body.shipment.locked = undefined;
    req.body.shipment.paymentStatus = undefined;
    req.body.shipment.agentId = undefined;
  }
  const { shipmentId } = req.query;
  if (!shipmentId) {
    return res.status(200).json({
      status: "error",
      error: "No shipment id provided!",
    });
  }

  // todo: validate request body values
  if (req.method === "POST") {
    let user;
    try {
      if (req.body.shipment.agentId) {
        user = await User.findOne({ agentId: req.body.shipment.agentId });
        if (!user) {
          return res.status(200).json({
            status: "error",
            error: "Invalid Agent Code!",
          });
        }
      }

      // shipment has been calculated
      if (req.body.shipment.calculated) {
        // todo: remove commission from previous agent and add to new agent if already calculated
        const previous = await Shipment.findOne({ _id: req.body.shipment._id });
        await User.findByIdAndUpdate(previous.user, {
          $inc: {
            balance: -previous.rebate,
            wallet: -previous.rebate,
            totalKg: -previous.rebate,
          },
        });
      }

      const values = {
        ...req.body.shipment,
        user: req.body.shipment.agentId ? user._id : undefined,
        name: req.body.shipment.name.toUpperCase(),
        destination: req.body.shipment.destination.toUpperCase(),
      };

      const shipment = await Shipment.findByIdAndUpdate(
        { _id: shipmentId },
        values,
        {
          new: true,
          runValidators: true,
        }
      ).select(session.role === "sec" ? "-mobile" : "");

      if (shipment.calculated) {
        // update commission on new shipment
        let rebate;
        const dollarSide = shipment.dollarSide || process.env.DOLLAR_AGENT;
        const nairaSide = shipment.nairaSide || process.env.NAIRA_AGENT;
        const dollarAgent = shipment.weight * dollarSide;
        const nairaAgent = shipment.weight * nairaSide;
        const convertDollar = dollarAgent * shipment.dollarRate;
        const total = nairaAgent + convertDollar;

        if (shipment.extraWeight > 0) {
          const freightInDollars = shipment.freightRate * shipment.extraWeight;
          const freightCalc = freightInDollars * shipment.dollarRate;
          const freightTotal =
            (Math.round(freightCalc * 10) / 10).toFixed(1) * 1;
          const customsTot = shipment.customsRate * shipment.extraWeight;
          const customsTotal =
            (Math.round(customsTot * 10) / 10).toFixed(1) * 1;
          const amountDue = Math.round(freightTotal + customsTotal);
          const addedTotal = total + amountDue;
          rebate = (Math.round(addedTotal * 10) / 10).toFixed(1) * 1;
        } else {
          rebate = (Math.round(total * 10) / 10).toFixed(1) * 1;
        }
        await Shipment.findByIdAndUpdate(shipment._id, {
          rebate,
          dollarSide,
          nairaSide,
        });
        await User.findByIdAndUpdate(shipment.user, {
          $inc: {
            totalKg: shipment.weight,
            wallet: rebate,
            balance: rebate,
          },
        });
      }

      return res.status(200).json({ status: "success", data: shipment });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        error: "An error occurred!",
      });
    }
  } else if (req.method === "DELETE") {
    if (session.user.role !== "admin") {
      return res.status(200).json({
        status: "error",
        error: "Insufficient Privileges! Nice try tho! 😜",
      });
    }
    const { shipmentId } = req.query;
    if (!shipmentId) {
      return res.status(200).json({
        status: "error",
        error: "No shipmentId provided!",
      });
    }
    try {
      // todo: remove commission from previous agent if already calculated
      const previous = await Shipment.findOne({ _id: shipmentId });

      if (previous.calculated) {
        await User.findByIdAndUpdate(previous.user, {
          $inc: {
            balance: -previous.rebate,
            wallet: -previous.rebate,
            totalKg: -previous.rebate,
          },
        });
      }
      await Shipment.findByIdAndDelete(shipmentId);
      return res
        .status(200)
        .json({ status: "success", data: "shipment deleted successfully!" });
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
