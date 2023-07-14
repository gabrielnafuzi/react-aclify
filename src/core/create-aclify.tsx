import { useCallback, useMemo } from 'react'

import { canAccessHelper } from './can-access-helper'
import { createAclifyContext } from './create-aclify-context'

export type CanAccessProps<
  Roles extends string,
  Permissions extends string = string,
> = {
  roles: Roles[]
  permissions?: Permissions[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function createAclify<
  Role extends string = string,
  Permission extends string = string,
  User extends Record<string, unknown> = Record<string, unknown>,
>() {
  const { AclifyProvider, useAclify: useAclifyContext } = createAclifyContext<
    Role,
    Permission,
    User
  >()

  const useAclify = () => {
    const { getUserPermissions, getUserRoles, user, setUser } =
      useAclifyContext()

    const isAuthorized = useCallback(
      (roles: Role[], permissions?: Permission[]) => {
        return canAccessHelper({
          roles,
          permissions,
          userPermissions: getUserPermissions(user),
          userRoles: getUserRoles(user),
        })
      },
      [user, getUserPermissions, getUserRoles],
    )

    return useMemo(
      () => ({
        setUser,
        isAuthorized,
      }),
      [setUser, isAuthorized],
    )
  }

  const CanAccess = ({
    roles,
    permissions,
    children,
    fallback,
  }: CanAccessProps<Role, Permission>) => {
    const { isAuthorized } = useAclify()

    if (isAuthorized(roles, permissions)) {
      return children
    }

    return fallback ?? null
  }

  return {
    AclifyProvider,
    useAclify,
    CanAccess,
  }
}
