import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { DEFAULT_STORAGE_KEY, getUserStorage } from './storage'

export type AclifyContext<
  Role extends string = string,
  Permission extends string = string,
  User extends Record<string, unknown> = Record<string, unknown>,
> = {
  /**
   * Function to get the user roles when checking permissions.
   */
  getUserRoles: (user?: User | null) => Role[]
  /**
   * Function to get the user permissions when checking permissions.
   */
  getUserPermissions: (user?: User | null) => Permission[]
  /**
   * The current user.
   */
  user: User | null
  /**
   * Function to set the user. This will also update the user in local storage.
   * @param user The user to set. If null, the user will be removed from local storage.
   */
  setUser: (user: User | null) => void
}

export type AclifyProviderProps<
  Role extends string = string,
  Permission extends string = string,
  User extends Record<string, unknown> = Record<string, unknown>,
> = {
  children: React.ReactNode
  /**
   * The key to use for storing the user in local storage.
   * @default '__REACT_ACLIFY_USER__'
   */
  storageKey?: string
} & Pick<
  AclifyContext<Role, Permission, User>,
  'getUserRoles' | 'getUserPermissions'
>

export function createAclifyContext<
  Role extends string = string,
  Permission extends string = string,
  User extends Record<string, unknown> = Record<string, unknown>,
>() {
  const AclifyContext = createContext<AclifyContext<
    Role,
    Permission,
    User
  > | null>(null)

  const AclifyProvider = ({
    children,
    getUserPermissions,
    getUserRoles,
    storageKey = DEFAULT_STORAGE_KEY,
  }: AclifyProviderProps<Role, Permission, User>) => {
    const userStorage = getUserStorage<User>(storageKey)
    const [user, setUser] = useState<User | null>(userStorage.getUser())

    const handleSetUser = useCallback(
      (user: User | null) => {
        setUser(user)
        userStorage.setUser(user)
      },
      [userStorage],
    )

    const values = useMemo(() => {
      return {
        getUserPermissions,
        getUserRoles,
        user,
        setUser: handleSetUser,
      }
    }, [getUserPermissions, getUserRoles, user, handleSetUser])

    return (
      <AclifyContext.Provider value={values}>{children}</AclifyContext.Provider>
    )
  }

  const useAclify = () => {
    const context = useContext(AclifyContext)

    if (!context) {
      throw new Error('useAclify must be used within a AclifyProvider')
    }

    return context
  }

  return { AclifyProvider, useAclify }
}
