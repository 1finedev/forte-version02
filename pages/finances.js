import { getSession } from "next-auth/react";
import Layout from "./backLayout";

const Finances = () => {
  return <div></div>;
};

export default Finances;
Finances.getLayout = function getLayout(page) {
  return <Layout page="create-shipment">{page}</Layout>;
};
export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (session?.user?.role !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/profile",
      },
    };
  }
  return {
    props: {},
  };
}
