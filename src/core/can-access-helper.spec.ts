import {
  canAccessHelper,
  type CanAccessHelperParams,
} from './can-access-helper'

it('returns false if the user does not have any matching role or permission', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['admin'],
    permissions: ['read'],
    userRoles: ['user'],
    userPermissions: ['write'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(false)
})

it('returns true if no roles are required and user has permissions', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    permissions: ['read'],
    userRoles: ['user'],
    userPermissions: ['read'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

it('returns true if no permissions are required and user has roles', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['user'],
    userRoles: ['user'],
    userPermissions: ['write'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

it('returns true if no roles or permissions are specified', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    userRoles: ['admin'],
    userPermissions: ['read'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

it('returns false if no user roles or permissions are specified', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['admin'],
    permissions: ['read'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(false)
})

it('returns true if user has all required roles in "all" validation mode', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['admin', 'user'],
    userRoles: ['admin', 'user'],
    validationMode: { roles: 'all' },
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

it('returns false if user does not have all required roles in "all" validation mode', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['admin', 'user'],
    userRoles: ['admin'],
    validationMode: { roles: 'all' },
  }

  const result = canAccessHelper(params)

  expect(result).toBe(false)
})

it('returns true if user has some required roles in "some" validation mode', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['admin', 'user'],
    userRoles: ['admin'],
    validationMode: { roles: 'some' },
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

it('returns true if user has some required permissions in "some" validation mode', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    permissions: ['read', 'write'],
    userPermissions: ['read'],
    validationMode: { permissions: 'some' },
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

it('returns false if user does not have all required permissions in "all" validation mode', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    permissions: ['read', 'write'],
    userPermissions: ['read'],
    validationMode: { permissions: 'all' },
  }

  const result = canAccessHelper(params)

  expect(result).toBe(false)
})
