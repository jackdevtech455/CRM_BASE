# TODO

## General

- [ ] consider moving from react-router-dom (for compatibility) to react-router/dom (current) or react-router (current)
- [x] set up an autoformatter
- [ ] add fork note to consider removing public access to /register
- [ ] make sure register page is consistent in its wording and usage whether its public or private to register an account
- [ ] consider why /login and /register are outside Layout and if they might needd their own layuout/navbar
- [ ] consider removing volumes for pnpm store and node_modules
- [ ] rewrite dependecy install instructions so it can be done from host or from container
- [ ] consider removing the COPY of package.json and pnpm lock file in Dockerfile as they are bind mounted
- [ ] consider removing the COPY . . in Dockerfile as bind mounted
- [ ] consider changing .vscode settings to .editorconfig to be editor agnostic
- [ ] move from `pnpm dev --host 0.0.0.0` to `pnpm build` on prod and staging
- [ ] get hot reloading working

## router.tsx

- [ ] consider using relative routes (like 'clients') in router.tsx isntead of absolute ones (like '/clients')
- [ ] consider adding default root instead of React's default like:

  ```js
  {
    path: "*",
    element: <NotFoundPage />,
  }
  ```

  - [ ] consider if catchall is inside or outside of auth

## auth/ProtctedRoute.tsx

- [ ] consider state={{ from=location }} instead of location.pathname - this should preserve url params, hashes and other state when returning you after login
- [ ] consider adding basic demo component instead of just:

  ```html
  <p>Loading...</p>
  ```

## auth/AuthProvider.tsx

- [x] remove refreshUser from AuthProvider as it is not used anywhere
  - [x] ensure removed from `value`
- [x] swap access token deletion and setUSer(null) with logout()
    catch (error) {
        logout();
        throw error;
    }
    add logout dependency to login in useCallback
- [x] use token storage helper funcs in place of calls to `localstorage`

## auth/authStorage.ts

- [x] use these helper functions instead of `localstorage.getItem("access_token")` for example

## api/apiFetch.ts and api/client/ts

- [x] remove these and wire in /api/request.ts

## api/clients.ts

- [ ] fix imports for /api/request.ts
- [ ] remove `JSON.stringify` call from createClient apiRequest body, replace with just body
- [ ] remove `JSON.stringify` call from uupdateClient apiRequest body, replace with just body

## api/auth.ts

- [ ] replace body of `getCurrentUser` with the apiRequest helper:

  ```ts
  export function getCurrentUser(): Promise<User> {
    return apiRequest<User>("/auth/me");
  }
  ```

- [ ] replace body of `register` with the apiRequest helper:

  ```ts
  export function register(
    credentials: RegisterCredentials,
  ): Promise<User> {
    return apiRequest<User>("/auth/register", {
      method: "POST",
      body: credentials,
    });
  }
  ```

  - [ ] consider that logged-in users would now send their token to the register endpoint

## pages/LoginPage.tsx

- [ ] make use of from location after login, change:

```ts
navigate("/", { replace: true });
```

to:

```ts
const location = useLocation();
const navigate = useNavigate();

const from = location.state?.from ?? "/";

navigate(from, { replace: true });
```

if typing issues try:

```ts
const location = useLocation();
const from =
  typeof location.state?.from === "string"
    ? location.state.from
    : "/";
```

## layout.tsx

- [ ] remove 'Create Account' block and link register page from login page:

```ts
<Link to="/register">Create an account</Link>
```

- [ ] remove inline styles, change to:

```ts
<nav>
  <Link to="/">Dashboard</Link>
  <Link to="/clients">Clients</Link>
  <Link to="/tickets">Tickets</Link>

  <span>
    {user?.name} ({user?.email})
  </span>

  <LogoutButton />
</nav>
```

## LogoutButton.tsx

- [ ] clear user tanstack query cache on logout

## DashboardPage.tsx

- [x] replace useState with Tanstack query
- [x] add type for dashboard response in types/dashboard.ts:

```ts
export type Dashboard = {
  client_count: number;
  ticket_count: number;
  recent_clients: Client[];
  recent_tickets: Ticket[];
};
```

- [x] change `apiRequest<unknown>("/dashboard");` to `Dashboard` type from api/dashboard.ts as:

```ts
import { apiRequest } from "./request";

export function getDashboard(): Promise<Dashboard> {
  return apiRequest<Dashboard>("/api/dashboard");
}
```

- [x] reduce complexity of main page to something like:

```ts
<>
  <h1>Dashboard</h1>

  <p>Clients: {dashboard.client_count}</p>
  <p>Tickets: {dashboard.ticket_count}</p>

  <h2>Recent clients</h2>
  ...

  <h2>Recent tickets</h2>
  ...
</>
```

- [x] ensure `<main>` is replaced with <>
- [x] add tanstack query like:

```ts
import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "../api/dashboard";

export default function DashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (dashboardQuery.isPending) {
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
    </>
  );
}
```

- [x] ensure dashboard const can not be undefined

## ClientsPage.tsx

- [x] add tanstack to ClientsPage.tsx like:

```ts
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "../api/clients";

export default function ClientsPage() {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: number;
      data: ClientUpdate;
    }) => updateClient(clientId, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });

  // render...
}
```

- [x] simplify list display like:

```ts
if (clientsQuery.isPending) {
  return <p>Loading clients...</p>;
}

if (clientsQuery.isError) {
  return <p>{clientsQuery.error.message}</p>;
}

const clients = clientsQuery.data;

if (clients.length === 0) {
  return (
    <>
      <h1>Clients</h1>
      <p>No clients yet.</p>
    </>
  );
}
```

and

```ts
<ul>
  {clients.map((client) => (
    <li key={client.id}>
      {client.name}
    </li>
  ))}
</ul>
```

- [ ] use mutateAsync like:

```ts
await createClientMutation.mutateAsync(data);
```

## TicketsPage.tsx

- [ ] use tanstack like:

```ts
const queryClient = useQueryClient();

const ticketsQuery = useQuery({
  queryKey: ["tickets"],
  queryFn: getTickets,
});

const createTicketMutation = useMutation({
  mutationFn: createTicket,
  onSuccess: () => {
    void queryClient.invalidateQueries({
      queryKey: ["tickets"],
    });

    void queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    });
  },
});

const updateTicketMutation = useMutation({
  mutationFn: ({
    ticketId,
    data,
  }: {
    ticketId: number;
    data: TicketUpdate;
  }) => updateTicket(ticketId, data),

  onSuccess: () => {
    void queryClient.invalidateQueries({
      queryKey: ["tickets"],
    });

    void queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    });
  },
});

const deleteTicketMutation = useMutation({
  mutationFn: deleteTicket,
  onSuccess: () => {
    void queryClient.invalidateQueries({
      queryKey: ["tickets"],
    });

    void queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    });
  },
});
```
