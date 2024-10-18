'use client'
import { createContext, useContext, useMemo } from 'react'

export type AclifyContext<
  Role extends string = string,
  Permission extends string = string,
> = {
  /**
   * The roles of the user.
   */
  userRoles: Role[]
  /**
   * The permissions of the user.
   */
  userPermissions: Permission[]
}

export type AclifyProviderProps<
  Role extends string = string,
  Permission extends string = string,
> = {
  children: React.ReactNode
} & Pick<AclifyContext<Role, Permission>, 'userRoles' | 'userPermissions'>

export function createAclifyContext<
  Role extends string = string,
  Permission extends string = string,
>() {
  const AclifyContext = createContext<AclifyContext<Role, Permission> | null>(
    null,
  )

  const AclifyProvider = ({
    children,
    userPermissions,
    userRoles,
  }: AclifyProviderProps<Role, Permission>) => {
    const values = useMemo(() => {
      return {
        userPermissions,
        userRoles,
      }
    }, [userPermissions, userRoles])

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
