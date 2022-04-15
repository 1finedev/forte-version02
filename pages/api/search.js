import { getSession } from "next-auth/react";
import User from "./../../backend/userModel";
import Shipment from "./../../backend/shipmentModel";
import Funds from "./../../backend/fundsModel";

const handler = async (req, res) => {
  const { query, path, searchType, batchStart, batchEnd } = req.body;
  if (!query || !path || !searchType || !batchStart || !batchEnd) {
    return res
      .status(200)
      .json({ status: "error", error: "Missing parameters" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(200).json({ status: "error", error: "Not logged in" });
  }
  switch (searchType) {
    case "shipment":
      {
        let option;
        if (path === "name") {
          option = {
            name: new RegExp(query, "i"),
            createdAt: { $gte: batchStart, $lte: batchEnd },
          };
        } else if (path === "carton") {
          option = {
            carton: query,
            createdAt: { $gte: batchStart, $lte: batchEnd },
          };
        } else if (path === "location") {
          option = {
            destination: new RegExp(query, "i"),
            createdAt: { $gte: batchStart, $lte: batchEnd },
          };
        } else if (path === "weight") {
          option = {
            weight: query,
            createdAt: { $gte: batchStart, $lte: batchEnd },
          };
        } else if (path === "agentId" && query.length > 2) {
          const agent = await User.findOne({ agentId: query });
          if (!agent) {
            return res
              .status(200)
              .json({ status: "error", error: "Agent not found" });
          }
          option = {
            user: agent?._id,
            createdAt: { $gte: batchStart, $lte: batchEnd },
          };
        } else return res.status(200).json({ status: "success", data: [] });

        const result = await Shipment.find(
          session?.user?.role === "agent"
            ? {
                name: new RegExp(query, "i"),
                user: session?.user?._id,
                createdAt: { $gte: batchStart, $lte: batchEnd },
              }
            : option
        ).limit(100);
        return res.status(200).json({ status: "success", data: result });
      }
      break;
    case "agents":
      {
        let option;
        if (path === "name") {
          option = { fullname: new RegExp(query, "i") };
        } else if (path === "suspended") {
          option = { suspended: true };
        } else if (path === "active") {
          option = { suspended: false };
        } else if (path === "amountGt") {
          option = { balance: { $gte: query } };
        } else if (path === "amountLt") {
          option = { balance: { $lte: query } };
        } else if (path === "agentId" && query.length > 2) {
          option = { agentId: new RegExp(query, "i") };
        } else return res.status(200).json({ status: "success", data: [] });

        const result = await User.find(
          session?.user?.role === "agent"
            ? { fullname: new RegExp(query, "i"), user: session?.user?._id }
            : option
        )
          .limit(50)
          .sort(
            path === "amountGt"
              ? { balance: 1 }
              : path === "amountLt"
              ? { balance: -1 }
              : {}
          );
        return res.status(200).json({ status: "success", data: result });
      }
      break;
    case "transactions":
      {
        let option;
        if (path === "name") {
          option = { fullname: new RegExp(query, "i") };
        } else if (path === "approved") {
          option = { status: "Approved" };
        } else if (path === "pending") {
          option = { status: "Pending" };
        } else if (path === "rejected") {
          option = { status: "Rejected" };
        } else if (path === "amountGt") {
          option = { amount: { $gte: query } };
        } else if (path === "amountLt") {
          option = { amount: { $lte: query } };
        } else if (path === "agentId" && query.length > 2) {
          const agent = await User.findOne({ agentId: query });
          if (!agent) {
            return res
              .status(200)
              .json({ status: "error", error: "Agent not found" });
          }
          option = { user: agent?._id };
        } else return res.status(200).json({ status: "success", data: [] });

        const result = await Funds.find(
          session?.user?.role === "agent"
            ? { fullname: new RegExp(query, "i"), user: session?.user?._id }
            : option
        )
          .limit(50)
          .sort(
            path === "amountGt"
              ? { balance: 1 }
              : path === "amountLt"
              ? { balance: -1 }
              : { createdAt: -1 }
          );
        return res.status(200).json({ status: "success", data: result });
      }
      break;
    default:
      {
        return res
          .status(200)
          .json({ status: "error", error: "Invalid search type" });
      }
      break;
  }
};
export default handler;
