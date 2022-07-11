import buildClient from "../api/build-client";

// the file name is the actual URL name
const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  /* MOVE THIS PART INTO build-client FOR REUSE

  // Verify weather invoke this func inside the browser(client) or server
  if (typeof window === "undefined") {
    // window only exist browser -> we are on server
    // URL should be consider namespace
    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: req.headers,
      }
    );
    return data;
  } else {
    // we are on browser
    // baseURL -> ''
    const { data } = await axios.get("/api/users/currentuser");
    return data; // {currentUser}
  }
  */

  const client = buildClient(context); //axios client
  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
