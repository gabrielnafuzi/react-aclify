import {
  canAccessHelper,
  type CanAccessHelperParams,
} from './can-access-helper'

it('returns true if the user has at least one matching role', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['admin'],
    userRoles: ['admin', 'user'],
    userPermissions: [],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

it('returns true if the user has at least one matching permission', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: [],
    permissions: ['write'],
    userRoles: ['user'],
    userPermissions: ['read', 'write'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(true)
})

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

it('returns false if no roles or permissions are specified', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: [],
    userRoles: ['admin'],
    userPermissions: ['read'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(false)
})

it('returns false if no user roles or permissions are specified', () => {
  const params: CanAccessHelperParams<'admin' | 'user', 'read' | 'write'> = {
    roles: ['admin'],
    permissions: ['read'],
  }

  const result = canAccessHelper(params)

  expect(result).toBe(false)
})
