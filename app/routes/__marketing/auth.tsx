import { ActionFunction, redirect } from "@remix-run/node";
import { AuthType, ErrorType } from "~/data/types.server";
import { validateAuthInput } from "~/data/validation.server";
import AuthForm from "~/components/auth/AuthForm";
import auth from "~/styles/auth.css";
import { signup, login } from "~/data/auth.server";

export default function AuthPage() {
  return <AuthForm />;
}

export const action: ActionFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const authMode = searchParams.get("mode") || "login";
  const formData = await request.formData();
  let authInput: AuthType = { email: "", password: "" };

  authInput.email = formData.get("email") as string;
  authInput.password = formData.get("password") as string;

  try {
    validateAuthInput(authInput);
  } catch (error) {
    console.log(error);
    return error;
  }

  try {
    if (authMode === "login") {
      return await login(authInput);
    } else {
      return await signup(authInput);
    }
  } catch (error: any) {
    if (error.status === 422 || error.status === 401) {
      return { credentials: error.message };
    }
  }
};

export function links() {
  return [{ rel: "stylesheet", href: auth }];
}
