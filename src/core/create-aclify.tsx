/* eslint-disable react/jsx-no-useless-fragment */
import { useCallback, useMemo } from 'react'

import { canAccessHelper } from './can-access-helper'
import { createAclifyContext } from './create-aclify-context'

export type CanAccessProps<
  Roles extends string,
  Permissions extends string = string,
> = {
  /**
   * The roles required to access the content.
   */
  roles: Roles[]
  /**
   * The permissions required to access the content.
   */
  permissions?: Permissions[]
  children: React.ReactNode
  /**
   * The fallback to render when the user is not authorized.
   */
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

    /**
     * Check if the user is authorized to access the content.
     * @param roles The roles required to access the content.
     * @param permissions The permissions required to access the content.
     */
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
      return <>{children}</>
    }

    return <>{fallback}</>
  }

  return {
    AclifyProvider,
    useAclify,
    CanAccess,
  }
}
