import marketingStyles from "~/styles/marketing.css";
import { Outlet } from "@remix-run/react";
import MainHeader from "~/components/navigation/MainHeader";
import { LoaderFunction } from "@remix-run/node";
import { getUserFromSession } from "~/data/auth.server";

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export const loader: LoaderFunction = ({ request }) => {
  return getUserFromSession(request);
};

export function links() {
  return [{ rel: "stylesheet", href: marketingStyles }];
}

export const headers = () => {
  return {
    "Cache-Control": "max-age=3600",
  };
};
