import type { ErrorBoundaryComponent, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useCatch,
  useMatches,
} from "@remix-run/react";
import Error from "./components/util/Error";

import sharedStyles from "~/styles/shared.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "RemixExpenses",
  viewport: "width=device-width,initial-scale=1",
});

export interface DocumentType {
  title?: string;
  children: React.ReactNode;
}

function Document({ title, children }: DocumentType) {
  const matches = useMatches();

  const disableJS = matches.some((match) => match.handle?.disableJS);

  return (
    <html lang="en">
      <head>
        {title && <title>{title}</title>}
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {!disableJS && <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
    <Document title={caughtResponse.statusText}>
      <main>
        <Error title={caughtResponse.statusText}>
          <p>
            {caughtResponse.data?.message ||
              "Something went wrong. Please try again later"}
          </p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </Error>
      </main>
    </Document>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <Document title="An error occured">
      <main>
        <Error title="An error occured">
          <p>
            {error.message || "Something went wrong. Please try again later"}
          </p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </Error>
      </main>
    </Document>
  );
};

export function links() {
  return [{ rel: "stylesheet", href: sharedStyles }];
}
