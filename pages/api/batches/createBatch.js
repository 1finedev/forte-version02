import Batch from "../../../backend/batchesModel";
import format from "date-fns/format";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  await connectToDatabase();
  if (req.method === "GET") {
    const yearBatch = await Batch.findOne()
      .sort({ field: "asc", _id: -1 })
      .limit(1);

    const lastMonthInBatch = yearBatch?.months?.[yearBatch?.months?.length - 1];

    if (
      // No batch ever created or it's the first month in a year
      yearBatch === null ||
      (yearBatch?.year !== getYear(new Date(yearBatch?.createdAt)) &&
        getMonth(new Date(Date.now())) === 0)
    ) {
      try {
        await Batch.create({
          year: format(new Date(Date.now()), "yyyy"),
          months: [
            {
              name: format(new Date(Date.now()), "MMMM"),
              batches: [{ batch: 1 }],
            },
          ],
        });

        return res.status(200).json({
          status: "success",
        });
      } catch (e) {
        console.log(e);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }
    } else if (
      // if month exists in the year
      lastMonthInBatch?.name === format(new Date(Date.now()), "MMMM")
    ) {
      try {
        await Batch.updateOne(
          {
            year: format(new Date(Date.now()), "yyyy"),
          },
          {
            $push: {
              "months.$[outer].batches": {
                batch:
                  lastMonthInBatch?.batches?.[
                    lastMonthInBatch?.batches?.length - 1
                  ]?.batch + 1,
              },
            },
          },
          {
            arrayFilters: [
              {
                "outer._id": lastMonthInBatch?._id,
              },
            ],
          }
        );
        return res.status(200).json({
          status: "success",
        });
      } catch (e) {
        console.log(e);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }
    } else {
      try {
        console.log(format(new Date(Date.now()), "yyyy"));
        const mon = await Batch.findOneAndUpdate(
          {
            year: format(new Date(Date.now()), "yyyy"),
          },
          {
            $push: {
              months: {
                name: format(new Date(Date.now()), "MMMM"),
                batches: [{ batch: 1 }],
              },
            },
          }
        );
        console.log(mon);
        return res.status(200).json({
          status: "success",
        });
      } catch {
        console.log(e);
        return res.status(200).json({
          status: "error",
          error: "An error occurred!",
        });
      }
    }
  } else {
    return res.status(200).json({
      status: "error",
      msg: "No handler defined for this route",
    });
  }
};
export default handler;
