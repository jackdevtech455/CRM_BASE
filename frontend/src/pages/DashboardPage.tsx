import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard";

export default function DashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (dashboardQuery.isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (dashboardQuery.isError) {
    return <p>{dashboardQuery.error.message}</p>;
  }

  const dashboard = dashboardQuery.data;

  return (
    <>
      <h1>Dashboard</h1>
      <p>Clients: {dashboard.client_count}</p>
      <p>Tickets: {dashboard.ticket_count}</p>
      <h2>Recent clients</h2>
      ...
      <h2>Recent tickets</h2>
      ...
    </>
  );
}
