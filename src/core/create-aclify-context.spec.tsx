import { act, renderHook } from '@testing-library/react'

import { createAclifyContext } from './create-aclify-context'
import { DEFAULT_STORAGE_KEY } from './storage'

const originalConsoleError = console.error

beforeEach(() => {
  console.error = originalConsoleError
})

describe('createAclifyContext()', () => {
  it('creates a valid context', () => {
    const { AclifyProvider, useAclify } = createAclifyContext()
    expect(AclifyProvider).toBeDefined()
    expect(useAclify).toBeDefined()
  })

  it('provides user state and methods', () => {
    const { AclifyProvider, useAclify } = createAclifyContext()

    const { result } = renderHook(() => useAclify(), {
      wrapper: ({ children }) => (
        <AclifyProvider
          getUserRoles={() => ['admin']}
          getUserPermissions={() => ['read']}
        >
          {children}
        </AclifyProvider>
      ),
    })

    expect(result.current.user).toBeNull()
    expect(result.current.getUserRoles).toBeInstanceOf(Function)
    expect(result.current.getUserPermissions).toBeInstanceOf(Function)
    expect(result.current.setUser).toBeInstanceOf(Function)

    act(() => {
      result.current.setUser({
        id: 1,
        roles: ['admin'],
        permissions: ['read'],
      })
    })

    expect(result.current.user).toEqual({
      id: 1,
      roles: ['admin'],
      permissions: ['read'],
    })
  })

  it('throws error when used outside provider', () => {
    console.error = vi.fn()
    const { useAclify } = createAclifyContext()

    expect(() => renderHook(() => useAclify())).toThrowError(
      'useAclify must be used within a AclifyProvider',
    )
  })

  it("users initial state from storage if it's available", () => {
    localStorage.setItem(
      DEFAULT_STORAGE_KEY,
      JSON.stringify({
        id: 1,
        roles: ['admin'],
        permissions: ['read'],
      }),
    )

    const { AclifyProvider, useAclify } = createAclifyContext()

    const { result } = renderHook(() => useAclify(), {
      wrapper: ({ children }) => (
        <AclifyProvider
          getUserRoles={() => ['admin']}
          getUserPermissions={() => ['read']}
        >
          {children}
        </AclifyProvider>
      ),
    })

    expect(result.current.user).toEqual({
      id: 1,
      roles: ['admin'],
      permissions: ['read'],
    })
  })
})
