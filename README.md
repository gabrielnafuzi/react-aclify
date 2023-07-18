# react-aclify

react-aclify is a highly useful package that provides a set of tools for Access Control List (ACL) in React applications. It supports TypeScript and presents an intuitive API for managing user roles and permissions.

<a href="https://www.npmjs.org/package/react-aclify"><img src="https://img.shields.io/npm/v/react-aclify.svg" alt="npm"></a>
<img src="https://github.com/gabrielnafuzi/react-aclify/workflows/CI/badge.svg" alt="build status">
<a href="https://unpkg.com/react-aclify/dist/index.js"><img src="https://img.badgesize.io/https://unpkg.com/react-aclify/dist/index.js?compression=gzip&label=gzip" alt="gzip size"></a>
<img src="https://img.shields.io/github/languages/top/gabrielnafuzi/react-aclify" alt="GitHub top language" />

## Features

- **Role and Permission Management**: Utilize React hooks and components to easily manage user roles and permissions for more secure and controlled access.
- **TypeScript Friendly**: Full TypeScript support provides strong type checking for user roles, permissions, and more, enhancing the development experience.
- **Granular Access Control**: With the `CanAccess` component, control visibility of parts of your application based on user roles and permissions.
- **Context Interaction**: The `useAclify` hook provides convenient methods (`setUser` and `isAuthorized`) for interacting with the user's roles and permissions in your context.
- **Adaptable**: Thanks to its unopinionated design, react-aclify can be integrated with a variety of project architectures and libraries.

## Install

```bash
# npm
npm install react-aclify
# yarn
yarn add react-aclify
# pnpm
pnpm add react-aclify
```

## Usage

Use the `createAclify` function to create the components and hook for your application:

```ts
import { createAclify } from 'react-aclify'

export const { CanAccess, useAclify, AclifyProvider } = createAclify()
```

For better TypeScript support, you can also pass the Roles, Permissions, and User types to the `createAclify` function, so that way the components and hook will be typed accordingly:

```ts
import { createAclify } from 'react-aclify'

type Role = 'admin' | 'user'
type Permission = 'posts:read' | 'posts:create' | 'posts:delete'
type User = {
  id: string
  /* ... */
  roles: Role[]
  permissions: Permission[]
}

export const { CanAccess, useAclify, AclifyProvider } = createAclify<
  Roles,
  Permissions,
  User
>()
```

## `<AclifyProvider />`

The `AclifyProvider` is a context provider that you use to wrap your application, or any part of it where you want to perform role or permission-based actions. The `AclifyProvider` accepts the following props:

- `getUserRoles`: A function to get the user's roles. This function will be used internally when checking permissions.

- `getUserPermissions`: A function to get the user's permissions. This function will be used internally when checking permissions.

- `storageKey` (optional): The key to use for storing the user in local storage. The default value is `'__REACT_ACLIFY_USER__'`.

Here's an example of how you can use the `AclifyProvider`:

```jsx
import { AclifyProvider } from '@/lib/aclify'

const App = () => (
  <AclifyProvider
    getUserRoles={(user) => user?.roles || []}
    getUserPermissions={(user) => user?.permissions || []}
  >
    {/* Your application goes here */}
  </AclifyProvider>
)
```

## `useAclify`

The `useAclify` hook is used to interact with the `AclifyProvider` context. It returns an object with the following properties:

- `setUser`: This function is used to set the current user. It's especially useful for updating the user's information in your application, such as after the user logs in or updates their profile.

- `isAuthorized`: This function checks whether the user is authorized to access a certain part of the application based on their roles and permissions. It takes two parameters: an array of roles and an array of permissions, and it returns a boolean indicating whether the user is authorized.

Here's an example of how to use the `useAclify` hook:

```tsx
import { useAclify } from '@/lib/aclify'

const Component = () => {
  const { isAuthorized, setUser } = useAclify()

  const handleLogin = () => {
    // After successfully logging in, you can set the user's data using setUser.
    setUser({
      id: '123',
      name: 'John Doe',
      roles: ['user'],
      permissions: ['posts:read'],
    })
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>

      {isAuthorized(['user'], ['posts:read']) && (
        <div>Authorized to read posts</div>
      )}
    </div>
  )
}
```

## `<CanAccess />`

The `CanAccess` component is a convenient way of restricting certain parts of your UI based on the user's roles and permissions.

It accepts the following props:

- `roles`: An array of roles. The user must have at least one of these roles to access the children of the `CanAccess` component.

- `permissions`: An optional array of permissions. If specified, the user must also have these permissions to access the children.

- `children`: The content that should be rendered if the user has the required roles and permissions.

- `fallback`: An optional component or element to be rendered if the user does not have the required roles or permissions.

Here's an example of how to use the `CanAccess` component:

```tsx
import { CanAccess } from '@/lib/aclify'

const Component = () => {
  return (
    <div>
      <CanAccess
        roles={['user']}
        permissions={['posts:read']}
        fallback={<div>Not authorized</div>}
      >
        <div>Authorized to read posts</div>
      </CanAccess>
    </div>
  )
}
```

## Contribute

Contributions to evebus are always welcome! If you find a bug or have an idea for a new feature, feel free to open an issue or submit a pull request. Every contribution helps make evebus a better tool for everyone.

## License

[MIT License](https://opensource.org/licenses/MIT) © [Gabriel Moraes](https://github.com/gabrielnafuzi)
