'use client'
import { useCallback, useMemo } from 'react'

import {
  canAccessHelper,
  type CanAccessHelperParams,
} from './can-access-helper'
import { createAclifyContext } from './create-aclify-context'

export type CanAccessProps<
  Roles extends string,
  Permissions extends string = string,
> = {
  /**
   * The content to render when the user is authorized.
   */
  children: React.ReactNode
  /**
   * The fallback to render when the user is not authorized.
   */
  fallback?: React.ReactNode
} & Pick<
  CanAccessHelperParams<Roles, Permissions>,
  'roles' | 'permissions' | 'validationMode'
>

export function createAclify<
  Role extends string = string,
  Permission extends string = string,
>() {
  const { AclifyProvider, useAclify: useAclifyContext } = createAclifyContext<
    Role,
    Permission
  >()

  const useAclify = () => {
    const { userPermissions, userRoles } = useAclifyContext()

    /**
     * Check if the user is authorized to access the content.
     * @param roles The roles required to access the content.
     * @param permissions The permissions required to access the content.
     */
    const isAuthorized = useCallback(
      ({
        roles,
        permissions,
        validationMode,
      }: Pick<
        CanAccessHelperParams<Role, Permission>,
        'roles' | 'permissions' | 'validationMode'
      >) => {
        return canAccessHelper({
          roles,
          permissions,
          userPermissions,
          userRoles,
          validationMode,
        })
      },
      [userPermissions, userRoles],
    )

    return useMemo(
      () => ({
        isAuthorized,
      }),
      [isAuthorized],
    )
  }

  const CanAccess = ({
    roles,
    permissions,
    validationMode,
    children,
    fallback,
  }: CanAccessProps<Role, Permission>) => {
    const { isAuthorized } = useAclify()

    if (isAuthorized({ roles, permissions, validationMode })) {
      return children
    }

    return fallback
  }

  return {
    AclifyProvider,
    useAclify,
    CanAccess,
  }
}
