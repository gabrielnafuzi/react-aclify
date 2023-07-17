import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createAclify, type CanAccessProps } from './create-aclify'

type Role = 'admin' | 'user'
type Permission = 'read' | 'write'
type User = {
  id: number
  name: string
  roles: Role[]
  permissions: Permission[]
}

const props: CanAccessProps<Role, Permission> = {
  roles: ['admin'],
  permissions: ['read'],
  children: <div>Authorized</div>,
}

const { AclifyProvider, CanAccess, useAclify } = createAclify<
  Role,
  Permission,
  User
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

  it('returns setUser and isAuthorized', () => {
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

    expect(result.current.setUser).toBeInstanceOf(Function)
    expect(result.current.isAuthorized).toBeInstanceOf(Function)
  })
})

describe('useAclify().isAuthorized()', () => {
  it('returns true when authorized', () => {
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

    expect(result.current.isAuthorized(['admin'], ['read'])).toBe(true)
  })

  it('returns false when not authorized', () => {
    const { result } = renderHook(() => useAclify(), {
      wrapper: ({ children }) => (
        <AclifyProvider
          getUserRoles={() => ['user']}
          getUserPermissions={() => ['write']}
        >
          {children}
        </AclifyProvider>
      ),
    })

    expect(result.current.isAuthorized(['admin'], ['read'])).toBe(false)
  })
})

describe('useAclify().CanAccess', () => {
  it('renders children when authorized', () => {
    render(
      <AclifyProvider
        getUserRoles={() => ['admin']}
        getUserPermissions={() => ['read']}
      >
        <CanAccess {...props} />
      </AclifyProvider>,
    )

    expect(screen.getByText('Authorized')).toBeInTheDocument()
  })

  it('does not render children when not authorized', () => {
    render(
      <AclifyProvider
        getUserRoles={() => ['user']}
        getUserPermissions={() => ['write']}
      >
        <CanAccess {...props} />
      </AclifyProvider>,
    )

    expect(screen.queryByText('Authorized')).not.toBeInTheDocument()
  })

  it('renders fallback when not authorized', () => {
    render(
      <AclifyProvider
        getUserRoles={() => ['user']}
        getUserPermissions={() => ['write']}
      >
        <CanAccess {...props} fallback={<div>Not authorized</div>} />
      </AclifyProvider>,
    )

    expect(screen.getByText('Not authorized')).toBeInTheDocument()
  })
})

describe('useAclify().setUser()', () => {
  it('updates user (checking with isAuthorized)', async () => {
    const Component = () => {
      const { setUser, isAuthorized } = useAclify()

      return (
        <div>
          <button
            type="button"
            onClick={() =>
              setUser({
                id: 1,
                name: 'John',
                roles: ['admin'],
                permissions: ['read'],
              })
            }
          >
            Set user
          </button>

          {isAuthorized(['admin'], ['read']) ? (
            <div>Authorized</div>
          ) : (
            <div>Not authorized</div>
          )}
        </div>
      )
    }

    render(
      <AclifyProvider
        getUserRoles={(user) => user?.roles ?? []}
        getUserPermissions={(user) => user?.permissions ?? []}
      >
        <Component />
      </AclifyProvider>,
    )

    await userEvent.click(screen.getByText('Set user'))
    expect(await screen.findByText('Authorized')).toBeInTheDocument()
  })

  it('updates user (checking with <CanAccess />)', async () => {
    const Component = () => {
      const { setUser } = useAclify()

      return (
        <div>
          <button
            type="button"
            onClick={() =>
              setUser({
                id: 1,
                name: 'John',
                roles: ['admin'],
                permissions: ['read'],
              })
            }
          >
            Set user
          </button>

          <CanAccess roles={['admin']} permissions={['read']}>
            <div>Authorized</div>
          </CanAccess>
        </div>
      )
    }

    render(
      <AclifyProvider
        getUserRoles={(user) => user?.roles ?? []}
        getUserPermissions={(user) => user?.permissions ?? []}
      >
        <Component />
      </AclifyProvider>,
    )

    await userEvent.click(screen.getByText('Set user'))
    expect(await screen.findByText('Authorized')).toBeInTheDocument()
  })

  it("toggles between 'Authorized' and 'Not authorized'", async () => {
    const Component = () => {
      const { setUser, isAuthorized } = useAclify()

      return (
        <div>
          <button
            type="button"
            onClick={() =>
              setUser({
                id: 1,
                name: 'John',
                roles: ['admin'],
                permissions: ['read'],
              })
            }
          >
            Set user
          </button>

          <button type="button" onClick={() => setUser(null)}>
            Remove user
          </button>

          {isAuthorized(['admin'], ['read']) ? (
            <div>Authorized</div>
          ) : (
            <div>Not authorized</div>
          )}
        </div>
      )
    }

    render(
      <AclifyProvider
        getUserRoles={(user) => user?.roles ?? []}
        getUserPermissions={(user) => user?.permissions ?? []}
      >
        <Component />
      </AclifyProvider>,
    )

    await userEvent.click(screen.getByText('Set user'))
    expect(await screen.findByText('Authorized')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Remove user'))
    expect(await screen.findByText('Not authorized')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Set user'))
    expect(await screen.findByText('Authorized')).toBeInTheDocument()
  })
})
