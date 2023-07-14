export type CanAccessHelperParams<
  Role extends string,
  Permission extends string,
> = {
  roles: Role[]
  permissions?: Permission[]
  userRoles?: Role[]
  userPermissions?: Permission[]
}

export function canAccessHelper<
  Role extends string,
  Permission extends string,
>({
  roles,
  permissions,
  userRoles,
  userPermissions,
}: CanAccessHelperParams<Role, Permission>) {
  const hasRole = roles.some((role) => (userRoles ?? []).includes(role))

  const hasPermission = (permissions ?? []).some((permission) =>
    (userPermissions ?? []).includes(permission),
  )

  return hasRole || hasPermission
}
