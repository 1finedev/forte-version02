import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAlert } from "react-alert";
import { Layout, PageNav } from "./../../components";

const EditShipment = () => {
  // hooks init
  const router = useRouter();
  const alert = useAlert();

  // state
  const [shipment, setShipment] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // get shipment from previous page in local storage
    const shipment = localStorage.getItem(`${router.query?.shipmentid}`);
    if (shipment) {
      setShipment(JSON.parse(shipment));
    } else {
      router.back();
    }

    // clear local storage on component unmount
    return () => {
      localStorage.removeItem(`${router.query?.shipmentid}`);
    };
  }, [router]);

  const handleUpdate = async () => {
    const Joi = (await import("joi")).default;

    //   input validation
    const myCustomJoi = Joi.extend(require("joi-phone-number"));

    const schema = Joi.object({
      name: Joi.string().required().max(28),
      PhoneNumber: myCustomJoi
        .string()
        .phoneNumber()
        .required()
        .max(13)
        .regex(/^\d+$/),
      destination: Joi.string().max(28).required(),
    });

    const { error, value } = await schema.validate({
      PhoneNumber: shipment.mobile,
      name: shipment.name,
      destination: shipment.destination,
    });
    if (error) {
      alert.show(
        <div style={{ textTransform: "initial", fontFamily: "Roboto" }}>
          {error.details[0].message.includes("must be a string")
            ? "Please fill all fields"
            : value?.mobile?.length > 14
            ? "mobile number is too long"
            : error.details[0].message}
        </div>,
        {
          type: "error",
        }
      );
    } else {
      setLoading(true);
      setShipment({
        ...shipment,
        mobile: shipment.mobile.replace(/\s/g, "").trim(),
      });
      const res = await axios.post(`/api/shipments/${shipment._id}`, {
        shipment,
      });

      if (res.data.status === "success") {
        setLoading(false);
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            Shipment updated successfully
          </div>,
          {
            type: "success",
          }
        );
        router.back();
      } else {
        setLoading(false);
        alert.show(
          <div
            className="text-white dark:text-white"
            style={{ textTransform: "initial", fontFamily: "Roboto" }}
          >
            {res.data.msg}{" "}
          </div>,
          {
            type: "error",
          }
        );
      }
    }
  };

  return (
    <div className="min-h-[100vh] bg-mainColor  text-black">
      <Layout>
        <PageNav />
        <div className="p-[20px]">
          <p className="mb-[20px] text-center font-heading text-xl font-bold uppercase text-white">
            Update Shipment
          </p>
          <form className="text-mainColor">
            <div className="mb-[20px] flex flex-col space-y-[10px]">
              <label className="text-white"> Customer Name: </label>
              <input
                type="text"
                name="name"
                value={shipment?.name ? shipment.name : ""}
                onChange={(e) =>
                  setShipment({ ...shipment, name: e.target.value })
                }
                className="rounded-lg border border-mainColor bg-gray-200 p-[8px] text-mainColor"
              />
            </div>{" "}
            <div className="mb-[20px] flex flex-col space-y-[10px]">
              <label className="text-white">Destination:</label>
              <input
                type="text"
                name="destination"
                value={shipment?.destination ? shipment.destination : ""}
                onChange={(e) =>
                  setShipment({ ...shipment, destination: e.target.value })
                }
                className="rounded-lg border border-mainColor bg-gray-200 p-[8px] text-mainColor"
              />
            </div>
            <div className="mb-[20px] flex flex-col space-y-[10px]">
              <label className="text-white">
                Phone Number: (e.g +2348115307397)
              </label>
              <input
                type="text"
                name="mobile"
                value={shipment?.mobile ? `+${shipment?.mobile}` : ""}
                onChange={(e) =>
                  setShipment({
                    ...shipment,
                    mobile: e.target.value
                      .replace(" ", "")
                      .replace("+", "")
                      .toString(),
                  })
                }
                className="rounded-lg border border-mainColor bg-gray-200 p-[8px] text-mainColor"
              />
            </div>
            <div className="mb-[15px] flex flex-col space-y-[10px]">
              <label className="mb-[10px] text-white">
                Delivery Instruction:
              </label>
              <select
                name="action"
                className="rounded-lg border border-mainColor bg-gray-200 p-[8px] text-mainColor caret-current focus:outline-none"
                onChange={(e) =>
                  setShipment({ ...shipment, action: e.target.value })
                }
              >
                <option defaultValue="deliver">Deliver 🚛</option>
                <option value="deliver">Do not deliver 🚳</option>
              </select>
            </div>
            <div className="mt-[25px] flex items-center justify-center">
              <p
                className="w-[50vw] cursor-pointer rounded-lg border bg-white p-[8px] text-center font-heading text-mainColor"
                onClick={handleUpdate}
              >
                {loading ? "🚫" : "Update shipment"}
              </p>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default EditShipment;
EditShipment.auth = true;
