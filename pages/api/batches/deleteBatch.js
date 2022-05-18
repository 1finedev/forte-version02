import Batch from "./../../../backend/batchesModel";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  await connectToDatabase();
  if (req.method === "POST") {
    const { year, monthId, batchId, batchLength } = req.body;
    if (!year || !batchId || !monthId || !batchLength) {
      return res.status(200).json({
        status: "error",
        error: "You must provide all parameters!",
      });
    }

    const session = await getSession({ req });
    if (!session) {
      return res.status(200).json({
        status: "error",
        msg: "You must be logged in!",
      });
    }
    // delete  batch in the database

    try {
      if (batchLength === 1) {
        await Batch.updateOne(
          {
            year: year,
          },
          { $pull: { months: { _id: monthId } } }
        );
        return res.status(200).json({
          status: "success",
        });
      } else {
        await Batch.updateOne(
          {
            year: year,
          },
          {
            $pull: {
              "months.$[outer].batches": { _id: batchId },
            },
          },
          {
            arrayFilters: [
              {
                "outer._id": monthId,
              },
            ],
          }
        );

        return res.status(200).json({
          status: "success",
        });
      }
    } catch (e) {
      console.log(e);
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
