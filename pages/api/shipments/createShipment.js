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
    const { name, destination, weight, carton, agentId } = req.body;

    if (!name || !destination || !weight || !carton || !agentId) {
      return res.status(200).json({
        status: "error",
        error: "Please provide all required fields",
      });
    }

    // find user who owns this shipment and update user with userId
    const user = await User.findOne({ agentId: agentId.toLowerCase() });
    if (!user || user.role !== "agent") {
      return res.status(200).json({
        status: "error",
        error: "Invalid Agent Code",
      });
    }

    // find last inserted to avoid duplicate Entry with same details
    const lastInserted = await Shipment.findOne()
      .sort({ field: "asc", _id: -1 })
      .limit(1);
    if (
      lastInserted &&
      lastInserted.name === name.toUpperCase() &&
      lastInserted.weight === +weight &&
      lastInserted.carton === carton
    ) {
      return res.status(200).json({
        status: "error",
        error: "Double entry detected!!!",
      });
    }

    // find existing shipment with same name
    const existingCustomer = await Shipment.findOne({
      name: name.toUpperCase().trim(),
      user: user._id,
      mobile: { $ne: null },
    }).sort({ createdAt: -1 });

    try {
      const shipment = await Shipment.create({
        name: name.toUpperCase(),
        destination: destination.toUpperCase(),
        weight,
        carton,
        user: user._id,
        mobile: existingCustomer ? existingCustomer.mobile : null,
      });

      const data = {
        ...shipment._doc,
        user: { agentId: agentId, _id: user._id },
      };

      return res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (err) {
      console.log(err);
      return res.status(200).json({
        status: "error",
        error: err.message,
      });
    }
  }
};

export default handler;
