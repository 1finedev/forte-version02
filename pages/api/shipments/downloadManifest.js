import Shipment from "../../../backend/shipmentModel";
const Readable = require("stream").Readable;
const json2xls = require("json2xls");
import fs from "fs";
import path from "path";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { batchStart, batchEnd } = req.body;
    if (!batchStart || !batchEnd) {
      return res.status(200).json({
        status: "error",
        error: "No start and end date defined!",
      });
    }

    try {
      const data = await Shipment.find({
        createdAt: {
          $gte: batchStart,
          $lte: batchEnd,
        },
      });

      //add the values of  weight and extraWeight from the data array and create a new array
      let newData = [];
      data.map((ship) =>
        newData.push({
          ...ship._doc,
          weight: ship.weight + ship.extraWeight,
        })
      );
      const excel = json2xls(newData, {
        fields: [
          "name",
          "weight",
          "destination",
          "carton",
          "freightRate",
          "dollarRate",
          "customsRate",
          "freightInDollars",
          "freightTotal",
          "customsTotal",
          "amountDue",
          "mobile",
          "action",
        ],
      });

      const buffer = new Buffer(excel, "binary");
      const manifestBuffer = new Readable();
      manifestBuffer.push(buffer);
      manifestBuffer.push(null);

      await new Promise(function (resolve) {
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=manifest.xlsx"
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Length", `${manifestBuffer.size}`);
        manifestBuffer.pipe(res);
        manifestBuffer.on("end", resolve);

        manifestBuffer.on("error", function (err) {
          if (err.code === "ENOENT") {
            return res.status(200).json({
              error: "error",
              error: "Sorry we could not find the file you requested!",
            });
            res.end();
          } else {
            return res.status(200).json({
              error: "error",
              message: "Sorry, something went wrong!",
            });
            res.end();
          }
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: "error",
        msg: error.message,
      });
    }
  }
};

export default handler;
