export const DEFAULT_STORAGE_KEY = '__REACT_ACLIFY_USER__'

export const getUserStorage = <User = unknown>(key = DEFAULT_STORAGE_KEY) => {
  const getUser = () => {
    try {
      const user = localStorage.getItem(key)

      return user === 'undefined' ? null : JSON.parse(user ?? '')
    } catch {
      return null
    }
  }

  const setUser = (user: User | null) => {
    if (user === null) {
      localStorage.removeItem(key)

      return
    }

    localStorage.setItem(key, JSON.stringify(user))
  }

  return { getUser, setUser }
}
