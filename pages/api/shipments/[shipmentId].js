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

  const { shipmentId } = req.query;
  if (!shipmentId) {
    return res.status(200).json({
      status: "error",
      error: "No shipment id provided!",
    });
  }

  // todo: validate request body values
  if (req.method === "POST") {
    try {
      if (req.body.shipment.agentId) {
        const user = await User.findOne({
          agentId: req.body.shipment.agentId.toLowerCase(),
        });
        if (!user) {
          return res.status(200).json({
            status: "error",
            error: "Invalid Agent Code!",
          });
        }
        // check if shipment has been calculated previously and remove the calculated sum
        const previous = await Shipment.findOne({
          _id: req.body.shipment.shipmentId,
        });

        if (previous.calculated === true) {
          await User.findByIdAndUpdate(previous.user._id, {
            $inc: {
              balance: -previous.rebate,
              wallet: -previous.rebate,
              totalKg: -previous.weight,
            },
          });
        }

        const values = {
          user: user._id,
        };
        const shipment = await Shipment.findByIdAndUpdate(
          { _id: shipmentId },
          values,
          {
            new: true,
            runValidators: true,
          }
        ).select(session.role === "sec" ? "-mobile" : "");

        if (shipment.calculated === true) {
          await User.findByIdAndUpdate(shipment.user, {
            $inc: {
              totalKg: shipment.weight,
              wallet: shipment.rebate,
              balance: shipment.rebate,
            },
          });
        }
        return res.status(200).json({ status: "success", data: shipment });
      } else {
        let values;
        if (session.user.role === "agent") {
          values = {
            name: req.body.shipment.name.toUpperCase().trim(),
            destination: req.body.shipment.destination.toUpperCase(),
            mobile: req.body.shipment.mobile,
          };
        } else if (
          session.user.role === "sec" ||
          session.user.role === "admin"
        ) {
          values = {
            ...req.body.shipment,
          };
        }
        const shipment = await Shipment.findByIdAndUpdate(
          { _id: shipmentId },
          values,
          {
            new: true,
            runValidators: true,
          }
        );
        return res.status(200).json({ status: "success", data: shipment });
      }
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
            totalKg: -previous.weight,
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
