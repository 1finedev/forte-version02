import axios from "axios";
import Shipment from "./../../../backend/shipmentModel";
import { connectToDatabase } from "./../../../backend/dbConnect";

const handler = async (req, res) => {
  await connectToDatabase();
  if (req.method === "POST") {
    const transformPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const formatter = new Intl.DateTimeFormat("en", { month: "long" });
    const month = formatter.format(new Date(req.body.currentBatch.startDate));

    const body = `Dear ${req.body.name},

Your ${
      req.body.weight + req.body.extraWeight
    }KG shipment with FORTE-BRIDGE Cargo is ready for collection!

Details:
Manifest: ${req.body.currentBatch.startDate.split("-")[0]}, ${month}, Batch ${
      req.body.currentBatch.batch
    }
Destination ${req.body.destination}
Weight: ${req.body.weight + req.body.extraWeight}KG
Freight: ₦${transformPrice(req.body.freightTotal)}
Customs: ₦${transformPrice(req.body.customsTotal)}
Total Amount: ₦${transformPrice(req.body.amountDue)}

Pay ₦${transformPrice(
      req.body.amountDue
    )} naira only into the bank details below.

NOTE: KINDLY PAY THE FULL AMOUNT INCLUDING THE KOBO (₦${transformPrice(
      req.body.amountDue
    )}) naira only into the bank details below.

Account Name: Fortebridge Global Logistics
Account Number: 0427481733
Bank Name: Guaranty Trust Bank (GTB)
Send proof of payment to this number or (+2348156672664)

You can pick up at "32, Stella Sholanke Street, Opposite Surepath School, off M/M Int'l airport road, Ajao Estate, Ikeja, Lagos (Enter fatai irawo street and go straight down to the T-junction)"

PICKUP YOUR ITEMS QUICKLY TO AVOID ATTRACTING DEMURRAGE CHARGES.
For additional enquiries, please contact us on +2348094404441
`;

    const values = {
      body: body,
      phone: req.body.mobile,
    };

    axios
      .post(
        "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
        values
      )
      .then(async () => {
        if (!req.body.mobile) {
          await Shipment.findByIdAndUpdate(req.body._id, {
            messageSent: false,
            locked: false,
          });
          axios.post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            {
              body: `Message delivery failed! \nAgent: ${req.body.user.agentId.toUpperCase()} \nShipment: ${
                req.body.name
              } - ${req.body.weight}KG \nReason: phone number is empty`,
              phone: "905526157375",
            }
          );
        } else {
          await Shipment.findByIdAndUpdate(req.body._id, {
            messageSent: true,
            locked: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        axios.post(
          "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
          {
            body: `Message delivery failed! \nAgent: ${req.body.user.agentId} \nShipment: ${req.body.name} - ${req.body.weight}KG \nReason: ${err.message}`,
            phone: "905526157375",
          }
        );
      });

    res.status(200).json({
      status: "success",
      message: `Message sent to ${req.body.name}!`,
    });
  }
};
export default handler;
