import User from "./../../backend/userModel";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "./../../backend/dbConnect";

const handler = async (req, res) => {
  if (req.method === "GET") {
    await connectToDatabase();
    const session = await getSession({ req });
    if (!session || session?.user?.role !== "admin") {
      return res
        .status(200)
        .json({ status: "error", error: "You are not logged in" });
    }

    try {
      const users = await User.find({})
        .sort({ agentId: 1 })
        .collation({ locale: "en_US", numericOrdering: true });
      return res.status(200).json({ status: "success", data: users });
    } catch (error) {
      return res
        .status(200)
        .json({ status: "error", error: "Something went wrong" });
    }
  }
};
export default handler;
