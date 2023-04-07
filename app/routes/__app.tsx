import expensesStyles from "~/styles/expenses.css";
import { Outlet } from "@remix-run/react";
import ExpensesHeader from "~/components/navigation/ExpensesHeader";
import { LoaderFunction } from "@remix-run/node";
import { getUserFromSession } from "~/data/auth.server";

export default function ExpensesAppLayout() {
  return (
    <>
      <ExpensesHeader />
      <Outlet />
    </>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: expensesStyles }];
}

export const loader: LoaderFunction = ({ request }) => {
  return getUserFromSession(request);
};
