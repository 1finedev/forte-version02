import User from "./../../backend/userModel";
import Batch from "./../../backend/batchesModel";
import Shipment from "./../../backend/shipmentModel";
import mongoose from "mongoose";

import { getSession } from "next-auth/react";
const handler = async (req, res) => {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session || session?.user?.role !== "admin") {
      return res
        .status(200)
        .json({ status: "error", error: "You are not logged in" });
    }

    const batches = await Batch.find().sort({ field: "asc", _id: -1 }).limit(1);

    const allShipments = await Shipment.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: null,
          tKg: {
            $sum: "$weight",
          },
          totalShipments: {
            $sum: 1,
          },
        },
      },
    ]);

    const currentBatch = await Shipment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: batches[batches.length - 1]?.months?.[
              batches[batches.length - 1].months.length - 1
            ]?.batches?.[
              batches[batches.length - 1].months[
                batches[batches.length - 1].months.length - 1
              ].batches.length - 1
            ]?.startDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          tKg: {
            $sum: "$weight",
          },
          totalShipments: {
            $sum: 1,
          },
        },
      },
    ]);

    const bestAgent = await Shipment.aggregate([
      {
        $match: {
          user: {
            $ne: mongoose.Types.ObjectId("5f10c08391094200179c31ed"),
          },
        },
      },
      {
        $group: {
          _id: "$user",
          tKg: { $sum: "$weight" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          agentId: "$user.agentId",
          tKg: 1,
        },
      },
      { $sort: { tKg: -1 } },
      { $limit: 1 },
    ]);
    const pickupStats = await Shipment.aggregate([
      {
        $project: {
          _id: 1,
          paymentStatus: 1,
        },
      },

      {
        $unwind: "$paymentStatus",
      },

      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const userStats = await User.aggregate([
      {
        $project: {
          _id: 1,
          role: 1,
        },
      },

      {
        $unwind: "$role",
      },

      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    return res.json({
      status: "success",
      data: [userStats, pickupStats, bestAgent, allShipments, currentBatch],
    });
  }
};
export default handler;
