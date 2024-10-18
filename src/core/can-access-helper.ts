type ValidationMode = {
  /**
   * The validation mode for roles.
   * - `'all'`: All roles must be present.
   * - `'some'`: At least one role must be present.
   * @default 'all'
   **/
  roles?: 'all' | 'some'
  /**
   * The validation mode for permissions.
   * - `'all'`: All permissions must be present.
   * - `'some'`: At least one permission must be present.
   * @default 'all'
   **/
  permissions?: 'all' | 'some'
}

export type CanAccessHelperParams<
  Role extends string,
  Permission extends string,
> = {
  /**
   * The roles required to access the content.
   */
  roles?: Role[]
  /**
   * The permissions required to access the content.
   */
  permissions?: Permission[]
  /**
   * The roles of the user.
   */
  userRoles?: Role[]
  /**
   * The permissions of the user.
   */
  userPermissions?: Permission[]
  /**
   * The validation mode for roles and permissions.
   */
  validationMode?: ValidationMode
}

const checkAll = <T>(arr: T[], target: T[]) =>
  target.every((item) => arr.includes(item))

const checkSome = <T>(arr: T[], target: T[]) =>
  target.some((item) => arr.includes(item))

export function canAccessHelper<
  Role extends string,
  Permission extends string,
>({
  roles = [],
  permissions = [],
  userRoles = [],
  userPermissions = [],
  validationMode = {},
}: CanAccessHelperParams<Role, Permission>) {
  const rolesValidationMode = validationMode.roles ?? 'all'
  const permissionsValidationMode = validationMode.permissions ?? 'all'

  const hasRole =
    roles.length === 0 ||
    (rolesValidationMode === 'all'
      ? checkAll(userRoles, roles)
      : checkSome(userRoles, roles))

  const hasPermission =
    permissions.length === 0 ||
    (permissionsValidationMode === 'all'
      ? checkAll(userPermissions, permissions)
      : checkSome(userPermissions, permissions))

  return hasRole && hasPermission
}
