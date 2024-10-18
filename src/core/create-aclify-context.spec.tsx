import { renderHook } from '@testing-library/react'

import { createAclifyContext } from './create-aclify-context'

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

  it('provides user roles and permissions', () => {
    const { AclifyProvider, useAclify } = createAclifyContext()

    const { result } = renderHook(() => useAclify(), {
      wrapper: ({ children }) => (
        <AclifyProvider userRoles={['admin']} userPermissions={['read']}>
          {children}
        </AclifyProvider>
      ),
    })

    expect(result.current.userRoles).toEqual(['admin'])
    expect(result.current.userPermissions).toEqual(['read'])
  })

  it('throws error when used outside provider', () => {
    console.error = vi.fn()
    const { useAclify } = createAclifyContext()

    expect(() => renderHook(() => useAclify())).toThrowError(
      'useAclify must be used within a AclifyProvider',
    )
  })
})
