// /expenses/add
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { useNavigate } from "@remix-run/react";
import { addExpense } from "~/data/expenses.server";
import type { ExpenseType } from "~/data/types.server";
import { ActionFunction, redirect } from "@remix-run/node";
import { validateExpenseInput } from "~/data/validation.server";
import { requireUserSession } from "~/data/auth.server";

export default function AddExpensesPage() {
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

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserSession(request);
  let expenseData: ExpenseType = { title: "", amount: 0, date: new Date() };
  const formData = await request.formData();

  expenseData.title = formData.get("title") as string;
  expenseData.amount = formData.get("amount") as unknown as number;
  expenseData.date = formData.get("date") as unknown as Date;

  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }

  await addExpense(expenseData, userId);
  return redirect("/expenses");
};
