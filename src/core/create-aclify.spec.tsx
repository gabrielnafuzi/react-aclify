import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createAclify, type CanAccessProps } from './create-aclify'

const props: CanAccessProps<string, string> = {
  roles: ['admin'],
  permissions: ['read'],
  children: <div>Authorized</div>,
}

const createAcl = () => createAclify<string, string, Record<string, any>>()

const originalConsoleError = console.error

beforeEach(() => {
  console.error = originalConsoleError
})

describe('createAclify()', () => {
  it('returns AclifyProvider, useAclify and CanAccess', () => {
    const { AclifyProvider, useAclify, CanAccess } = createAcl()

    expect(AclifyProvider).toBeInstanceOf(Function)
    expect(useAclify).toBeInstanceOf(Function)
    expect(CanAccess).toBeInstanceOf(Function)
  })
})

describe('useAclify()', () => {
  it("throws an error when used outside of a <AclifyProvider />'s scope", () => {
    console.error = vi.fn()
    const { useAclify } = createAcl()

    expect(() => renderHook(() => useAclify())).toThrowError(
      'useAclify must be used within a AclifyProvider',
    )
  })

  it('returns setUser and isAuthorized', () => {
    const { AclifyProvider, useAclify } = createAcl()

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
    const { AclifyProvider, useAclify } = createAcl()

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
    const { AclifyProvider, useAclify } = createAcl()

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
    const { CanAccess, AclifyProvider } = createAcl()

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
    const { CanAccess, AclifyProvider } = createAcl()

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
    const { CanAccess, AclifyProvider } = createAcl()

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
    const { AclifyProvider, useAclify } = createAcl()

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
        user={null}
      >
        <Component />
      </AclifyProvider>,
    )

    await userEvent.click(screen.getByText('Set user'))
    expect(await screen.findByText('Authorized')).toBeInTheDocument()
  })

  it('updates user (checking with <CanAccess />)', async () => {
    const { CanAccess, AclifyProvider, useAclify } = createAcl()

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
        user={null}
      >
        <Component />
      </AclifyProvider>,
    )

    await userEvent.click(screen.getByText('Set user'))
    expect(await screen.findByText('Authorized')).toBeInTheDocument()
  })

  it("toggles between 'Authorized' and 'Not authorized'", async () => {
    const { AclifyProvider, useAclify } = createAcl()

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
        user={null}
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
