import axios from "axios";

const handler = (req, res) => {
  if (req.method === "POST") {
    const transformPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const body = `Dear ${req.body.name},

Your ${
      req.body.weight + req.body.extraWeight
    }KG shipment with FORTE-BRIDGE Cargo is ready for collection!

Details:
Destination ${req.body.destination}
Weight: ${req.body.weight + req.body.extraWeight}KG
Freight: ₦${transformPrice(req.body.freightTotal)}
Customs: ₦${transformPrice(req.body.customsTotal)}
Total Amount: ₦${transformPrice(req.body.amountDue)}

Pay ₦${transformPrice(
      req.body.amountDue
    )} naira only into the bank details below.

Account Name: Access Bank
Account Number: 1495381315
Bank Name: FORTE BRIDGE LOGISTICS NIG LTD.

*No cash payment is accepted.*

You can pickup at 14 Ola Adeshile Str. Off Gogo Hassan Ajao Estate Lagos.

reply this message with proof of payment with account name for confirmation or to *Ifeanyi on WhatsApp* - 08105991312 

Mon-Fri: 10:00am-5:00pm Sat:10:00am-3:00pm. 

*Demurrage apply (400/DAY) 5 days after pick up message is received*.
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
      .then(() => {
        if (req.body.mobile === null || req.body.mobile === "") {
          axios.post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            {
              body: `Message delivery failed! \nAgent: ${req.body.user.agentId} \nShipment: ${req.body.name} - ${req.body.weight}KG \nReason: phone number is empty`,
              phone: "905526157375",
            }
          );
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
