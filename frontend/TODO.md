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
- [ ] consider adding basic demo component instead of just '<p>Loading...</p>'

## auth/AuthProvider.tsx

- [ ] remove refreshUser from AuthContextValue as it is not used anywhere
    - [ ] ensure removed from `value`
- [ ] swap access token deletion and setUSer(null) with logout()
    catch (error) {
        logout();
        throw error;
    }
    add logout dependency to login in useCallback
- [ ] use token storage helper funcs in place of calls to `localstorage`

## auth/authStorage.ts

- [ ] use these helper functions instead of `localstorage.getItem("access_token")` for example

## api/apiFetch.ts and api/client/ts

- [ ] remove these and wire in /api/request.ts


## api/clients.ts

- [ ] fix imports for /api/request.ts
- [ ] remove `JSON.stringify` call from createClient apiRequest body, replace with just body
- [ ] remove `JSON.stringify` call from uupdateClient apiRequest body, replace with just body

## api/auth.ts

- [ ] replace body of `getCurrentUser` with the apiRequest helper:
```js
export function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}
```
- [ ] replace body of `register` with the apiRequest helper:
```js
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
