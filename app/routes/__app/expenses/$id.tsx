// /expenses/<some-id> => /expenses/expense-1, /expenses/e-1
import { ActionFunction, MetaFunction, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { deleteExpense, updateExpense } from "~/data/expenses.server";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import type { ExpenseType } from "~/data/types.server";
import { validateExpenseInput } from "~/data/validation.server";

export default function UpdateExpensesPage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

// export const loader: LoaderFunction = async ({ params }) => {
//   const expenseId = params.id as string;
//   const expense = await getExpense(expenseId);
//   console.log(expense);
//   return expense;
// };
export const action: ActionFunction = async ({ params, request }) => {
  let expenseData: ExpenseType = { title: "", amount: 0, date: new Date() };
  const expenseId = params.id!;

  if (request.method === "PATCH") {
    const formData = await request.formData();

    expenseData.title = formData.get("title") as string;
    expenseData.amount = formData.get("amount") as unknown as number;
    expenseData.date = formData.get("date") as unknown as Date;

    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    updateExpense(expenseId, expenseData);
    return redirect("/expenses");
  } else if (request.method === "DELETE") {
    await deleteExpense(expenseId);
    return { deletedId: expenseId };
  }
};

//window.location.href
export const meta: MetaFunction = ({ params, location, data, parentsData }) => {
  const expense = parentsData["routes/__app/expenses"].find(
    (expense: ExpenseType) => expense.id === params.id
  );
  return {
    title: expense.title,
    description: "Update expense",
  };
};
