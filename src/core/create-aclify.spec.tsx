import { render, renderHook, screen } from '@testing-library/react'

import { createAclify, type CanAccessProps } from './create-aclify'

type Role = 'admin' | 'user'
type Permission = 'read' | 'write'

const props: CanAccessProps<Role, Permission> = {
  roles: ['admin'],
  permissions: ['read'],
  children: <div>Authorized</div>,
}

const { AclifyProvider, CanAccess, useAclify } = createAclify<
  Role,
  Permission
>()

const originalConsoleError = console.error

beforeEach(() => {
  console.error = originalConsoleError
})

describe('createAclify()', () => {
  it('returns AclifyProvider, useAclify and CanAccess', () => {
    expect(AclifyProvider).toBeInstanceOf(Function)
    expect(useAclify).toBeInstanceOf(Function)
    expect(CanAccess).toBeInstanceOf(Function)
  })
})

describe('useAclify()', () => {
  it("throws an error when used outside of a <AclifyProvider />'s scope", () => {
    console.error = vi.fn()

    expect(() => renderHook(() => useAclify())).toThrowError(
      'useAclify must be used within a AclifyProvider',
    )
  })

  it('returns isAuthorized', () => {
    const { result } = renderHook(() => useAclify(), {
      wrapper: ({ children }) => (
        <AclifyProvider userRoles={['admin']} userPermissions={['read']}>
          {children}
        </AclifyProvider>
      ),
    })

    expect(result.current.isAuthorized).toBeInstanceOf(Function)
  })
})

describe('useAclify().isAuthorized()', () => {
  it('returns true when authorized', () => {
    const { result } = renderHook(() => useAclify(), {
      wrapper: ({ children }) => (
        <AclifyProvider userRoles={['admin']} userPermissions={['read']}>
          {children}
        </AclifyProvider>
      ),
    })

    expect(
      result.current.isAuthorized({ roles: ['admin'], permissions: ['read'] }),
    ).toBe(true)
  })

  it('returns false when not authorized', () => {
    const { result } = renderHook(() => useAclify(), {
      wrapper: ({ children }) => (
        <AclifyProvider userRoles={['user']} userPermissions={['write']}>
          {children}
        </AclifyProvider>
      ),
    })

    expect(
      result.current.isAuthorized({ roles: ['admin'], permissions: ['read'] }),
    ).toBe(false)
  })
})

describe('useAclify().CanAccess', () => {
  it('renders children when authorized', () => {
    render(
      <AclifyProvider userRoles={['admin']} userPermissions={['read']}>
        <CanAccess {...props} />
      </AclifyProvider>,
    )

    expect(screen.getByText('Authorized')).toBeInTheDocument()
  })

  it('does not render children when not authorized', () => {
    render(
      <AclifyProvider userRoles={['user']} userPermissions={['write']}>
        <CanAccess {...props} />
      </AclifyProvider>,
    )

    expect(screen.queryByText('Authorized')).not.toBeInTheDocument()
  })

  it('renders fallback when not authorized', () => {
    render(
      <AclifyProvider userRoles={['user']} userPermissions={['write']}>
        <CanAccess {...props} fallback={<div>Not authorized</div>} />
      </AclifyProvider>,
    )

    expect(screen.getByText('Not authorized')).toBeInTheDocument()
  })
})
