import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState, useLayoutEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import AOS from "aos";
import "aos/dist/aos.css";
import { LoadingScreen } from "../components";

const options = {
  color: "white",
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};
// handle client side session

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  // handle page load animation
  useEffect(() => {
    AOS.init({ duration: 500 });
    AOS.refresh();
  }, []);

  //workaround to enable SSR work on pages that use getServerSideProps without causing useLayoutEffect errors
  const canUseDOM = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    // check local storage and decide if theme is set
    const color = localStorage.getItem("mainColor");
    if (color !== null) {
      document.documentElement.style.setProperty("--mainColor", color);
    }
  }, [router]);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionProvider
      session={session}
      options={{
        clientMaxAge: 2 * 60 * 60, // Re-fetch session if cache is older than 2 hours
        keepAlive: 60 * 60, // Send keepAlive message every hour
      }}
      refetchOnWindowFocus={true}
    >
      <AlertProvider template={AlertTemplate} {...options}>
        <NextNProgress color="white" />

        {Component.auth ? (
          <Auth>
            <>{getLayout(<Component {...pageProps} />)}</>
          </Auth>
        ) : (
          <>{getLayout(<Component {...pageProps} />)}</>
        )}
      </AlertProvider>
    </SessionProvider>
  );
}

const Auth = ({ children }) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return children;
  }
  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <LoadingScreen />;
};

export default MyApp;
