import { LoaderFunction } from "@remix-run/node";
import { getExpenses } from "~/data/expenses.server";
import { requireUserSession } from "~/data/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);

  return getExpenses();
};
