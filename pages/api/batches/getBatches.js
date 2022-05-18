import Batch from "./../../../backend/batchesModel";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  await connectToDatabase();
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(200).json({
        status: "error",
        msg: "You must be logged in!",
      });
    }
    // get all batches in the database
    try {
      const batches = await Batch.find({});
      return res.status(200).json({ status: "success", data: batches });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        error: "An error occurred!",
      });
    }
  } else {
    return res.status(200).json({
      status: "error",
      error: "No handler defined for this route!",
    });
  }
};

export default handler;
