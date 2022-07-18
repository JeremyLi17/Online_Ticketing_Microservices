import Link from 'next/link';

// the file name is the actual URL name
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>All Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
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

  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
