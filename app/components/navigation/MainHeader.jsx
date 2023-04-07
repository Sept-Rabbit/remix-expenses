import Logo from "../util/Logo";
import { Link, NavLink, useLoaderData, Form } from "@remix-run/react";

function MainHeader() {
  const userId = useLoaderData();

  return (
    <header id="main-header">
      <Logo />
      <nav id="main-nav">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
        </ul>
      </nav>
      <nav id="cta-nav">
        <ul>
          <li>
            {userId && (
              <Form method="post" action="/logout" id="logout-form">
                <button className="cta-alt">Log out</button>
              </Form>
            )}
            {!userId && (
              <Link to="/auth" className="cta">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
