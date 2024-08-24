import { useEffect } from "react";
import {
  Outlet,
  Link,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit, // for auto submit form
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

// Action that the form data gets sent to
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

// Loader that retrieves data for the page
// export async function loader() {
//   const contacts = await getContacts();
//   return { contacts };
// }

// Loader that retrieves data for the page and filters the list based on query params
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

// Sidebar for the app
export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit(); // for auto submit form

  // For search spinner
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          {/* <form id="search-form" role="search"> */}
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              // As you type, the form is submitted automatically
              onChange={(event) => {
                // Pushes current entry into history stack (don't want)
                // submit(event.currentTarget.form);

                // Replaces current entry in history stack with next page
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          {/* </form> */}

          {/* <form method="post"> */}
          {/* <button type="submit">New</button> */}
          {/* </form> */}

          {/* Prevents the browser from sending the request to the server and sends it to your route action instead */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {/* <ul> */}
          {/* <li> */}
          {/* Full document request to the server for next page */}
          {/* <a href={`/contacts/1`}>Your Name</a> */}

          {/* Client side routing so the document doesn't need to request from server */}
          {/* Open network tab to confirm that it's not making requests anymore */}
          {/* <Link to={`contacts/1`}>Your Name</Link> */}
          {/* </li> */}
          {/* <li> */}
          {/* Full document request to the server for next page */}
          {/* <a href={`/contacts/2`}>Your Friend</a> */}

          {/* Client side routing so the document doesn't need to request from server */}
          {/* Open network tab to confirm that it's not making requests anymore */}
          {/* <Link to={`contacts/2`}>Your Friend</Link> */}
          {/* </li> */}
          {/* </ul> */}

          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* <Link to={`contacts/${contact.id}`}> */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      // When the user is at the URL in the NavLink, then isActive will be true
                      // When it's about to be active (the data is still loading) then isPending will be true
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                  {/* </Link> */}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        {/* Tells root route where we want to render children */}
        <Outlet />
      </div>
    </>
  );
}
