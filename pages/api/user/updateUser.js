import User from "./../../../backend/userModel";
import Funds from "./../../../backend/fundsModel";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session || session?.user?.role !== "admin") {
      return res
        .status(200)
        .json({ status: "error", error: "You are not logged in" });
    }
    const { option, agentId } = req.body;

    if (!option || !agentId) {
      return res
        .status(200)
        .json({ status: "error", error: "Incomplete request body!" });
    }

    if (option === "suspend") {
      try {
        await User.findByIdAndUpdate(agentId, {
          suspended: true,
        });
        return res.status(200).json({
          status: "success",
        });
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }
    }
    if (option === "activate") {
      try {
        await User.findByIdAndUpdate(agentId, {
          suspended: false,
        });
        return res.status(200).json({
          status: "success",
        });
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }
    } else if (option === "delete") {
      try {
        await User.findByIdAndUpdate(agentId, {
          active: false,
        });
        return res.status(200).json({
          status: "success",
        });
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }
    } else if (option === "transactions") {
      try {
        const transactions = await Funds.find({ user: agentId });
        return res.status(200).json({
          status: "success",
          data: transactions,
        });
      } catch (error) {
        console.log(error);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }
    }
  }
};
export default handler;
