import { Layout } from "./../components";

import { useSession } from "next-auth/react";

const Statistics = () => {
  console.log(useSession());
  return (
    <Layout>
      <div className="h-[20vh] w-full bg-mainColor">
        <p>Performance Analysis</p>
        <div>
          <p></p>
        </div>
      </div>
      <div>
        <p> Statistics Board </p>

        <div>
          <div>
            <p>Best Week</p>
            <p>Here...</p>
          </div>
          <div>
            <p>Best Batch total</p>
            <p>Here...</p>
          </div>
          <div>
            <p>Batch high-score</p>
            <p>Here...</p>
          </div>
          <div>
            <p>Top 5 customers</p>
            <p>Here...</p>
          </div>
          <div>
            <p>customer streak high-score</p>
            <p>Here...</p>
          </div>
          <div>
            <p>referral customers total</p>
            <p>Here...</p>
          </div>
          <div>
            <p>Top 5 destinations</p>
            <p>Here...</p>
          </div>
          <div>
            <p>Highest funds payout</p>
            <p>Here...</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;
Statistics.auth = true;
