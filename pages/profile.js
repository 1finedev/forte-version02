import { connectToDatabase } from "../backend/dbConnect";
import { getSession } from "next-auth/react";
import User from "./../backend/userModel";
import axios from "axios";

const Profile = () => {
  return <p>An Error has occurred.</p>;
};

export async function getServerSideProps({ req, res }) {
  await connectToDatabase();
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (session && session?.user?.verified === false) {
    try {
      // generate otp
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = Date.now() + 10 * 60 * 1000;

      // send a message to the user and generate otp
      const body = `Hello ${session.user.fullname.split(" ")[0]}, 
The code to verify your FORTE-BRIDGE Logistics Agent account is *${otp}*. 
This code will expire in 10 minutes.`;

      const values = {
        body: body,
        phone: session?.user?.mobile,
      };

      const user = await User.findOne({ _id: session.user._id });

      if (user && user.verified === false) {
        await axios
          .post(
            "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
            values
          )
          .catch((err) => {
            console.log(err);
            axios.post(
              "https://eu176.chat-api.com/instance225964/sendMessage?token=u10endg0wkm7iu17",
              {
                body: `Message delivery failed! \n${err}`,
                phone: "905526157375",
              }
            );
          });

        await User.findByIdAndUpdate(session?.user?._id, {
          otp,
          otpExpiresAt,
        });

        // redirect user to verify
        return {
          redirect: {
            destination: "/verify",
            permanent: false,
          },
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
  switch (session?.user?.role) {
    case null:
      return <p>Unable to render page.. Contact Developer!</p>;
    case "mod":
      return {
        redirect: {
          permanent: false,
          destination: "/shipment-management",
        },
      };
    case "sec":
      return {
        redirect: {
          permanent: false,
          destination: "/shipment-management",
        },
      };
    case "agent":
      return {
        redirect: {
          permanent: false,
          destination: "/dashboard",
        },
      };
    case "admin":
      return {
        redirect: {
          permanent: false,
          destination: "/management-console",
        },
      };
    case "customer":
      return {
        redirect: {
          permanent: false,
          destination: "/customer",
        },
      };
    default:
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
  }

  return {
    props: {},
  };
}

export default Profile;
Profile.auth = true;
