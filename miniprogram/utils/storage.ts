export const getStorage = <T>(key: string, fallback: T): T => {
  try {
    const value = wx.getStorageSync(key) as T | '' | undefined
    return value === '' || value === undefined ? fallback : value
  } catch (error) {
    console.warn(`Failed to read storage: ${key}`, error)
    return fallback
  }
}

export const setStorage = <T>(key: string, value: T): void => {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    console.warn(`Failed to write storage: ${key}`, error)
  }
}

export const removeStorage = (key: string): void => {
  try {
    wx.removeStorageSync(key)
  } catch (error) {
    console.warn(`Failed to remove storage: ${key}`, error)
  }
}

