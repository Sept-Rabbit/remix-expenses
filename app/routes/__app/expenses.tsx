// /expenses => shared layout

import { LoaderFunction, json, HeadersFunction } from "@remix-run/node";
import {
  CatchBoundaryComponent,
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { getExpenses } from "~/data/expenses.server";
import { FaPlus, FaDownload } from "react-icons/fa";
import ExpensesList from "~/components/expenses/ExpensesList";
import { requireUserSession } from "~/data/auth.server";

export default function ExpensesLayout() {
  const expenses = useLoaderData();

  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <section id="expenses-actions">
        <Link to="add">
          <FaPlus />
          <span>Add Expense</span>
        </Link>
        <a href="/expenses/raw">
          <FaDownload />
          <span>Load Raw Data</span>
        </a>
      </section>
      <main>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No expenses found</h1>
            <p>
              Start <Link to="/expenses/add">adding some</Link> today.
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);

  return json(expenses, { headers: { "Cache-Control": "max-age=3" } });
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  return <p>Error</p>;
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  ...loaderHeaders,
  "Cache-Control": loaderHeaders.get("Cache-Control"),
});
