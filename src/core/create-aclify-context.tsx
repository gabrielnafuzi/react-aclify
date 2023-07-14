import { createContext, useContext, useMemo, useState } from 'react'

export type AclifyContext<
  Role extends string = string,
  Permission extends string = string,
  User extends Record<string, unknown> = Record<string, unknown>,
> = {
  getUserRoles: (user?: User | null) => Role[]
  getUserPermissions: (user?: User | null) => Permission[]
  user?: User | null
  setUser: (user: User | null) => void
}

export type AclifyProviderProps<
  Role extends string = string,
  Permission extends string = string,
  User extends Record<string, unknown> = Record<string, unknown>,
> = {
  children: React.ReactNode
} & Pick<
  AclifyContext<Role, Permission, User>,
  'user' | 'getUserRoles' | 'getUserPermissions'
>

export function createAclifyContext<
  Role extends string = string,
  Permission extends string = string,
  User extends Record<string, unknown> = Record<string, unknown>,
>() {
  const Context = createContext<AclifyContext<Role, Permission, User> | null>(
    null,
  )

  const AclifyProvider = ({
    children,
    getUserPermissions,
    getUserRoles,
    user: initialUser,
  }: AclifyProviderProps<Role, Permission, User>) => {
    const [user, setUser] = useState(initialUser)

    const values = useMemo(() => {
      return {
        getUserPermissions,
        getUserRoles,
        user,
        setUser,
      }
    }, [user, getUserPermissions, getUserRoles])

    return <Context.Provider value={values}>{children}</Context.Provider>
  }

  const useAclify = () => {
    const context = useContext(Context)

    if (!context) {
      throw new Error('useAclify must be used within a AclifyProvider')
    }

    return context
  }

  return { AclifyProvider, useAclify }
}
