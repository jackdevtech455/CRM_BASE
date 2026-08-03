# TODO

## General

[ ] consider moving from react-router-dom (for compatibility) to react-router/dom (current) or react-router (current)
[ ] set up an autoformatter
[ ] add fork note to consider removing public access to /register
[ ] make sure register page is consistent in its wording and usage whether its public or private to register an account
[ ] consider why /login and /register are outside Layout and if they might needd their own layuout/navbar
[ ] consider removing volumes for pnpm store and node_modules
[ ] rewrite dependecy install instructions so it can be done from host or from container
[ ] consider removing the COPY of package.json and pnpm lock file in Dockerfile as they are bind mounted
[ ] consider removing the COPY . . in Dockerfile as bind mounted

## router.tsx

[ ] consider using relative routes (like 'clients') in router.tsx isntead of absolute ones (like '/clients')
[ ] consider adding default root instead of React's default like:
    ```js
    {
    path: "*",
    element: <NotFoundPage />,
    }
    ```
    [ ] consider if catchall is inside or outside of auth

## auth/ProtctedRoute.tsx

[ ] consider state={{ from=location }} instead of location.pathname - this should preserve url params, hashes and other state when returning you after login
[ ] consider adding basic demo component instead of just '<p>Loading...</p>'

## auth/AuthProvider.tsx

[ ] a
