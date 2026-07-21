import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock IndexedDB
const mockStore = new Map<string, unknown>()
const mockDB = {
  transaction: vi.fn(() => ({
    objectStore: vi.fn(() => ({
      add: vi.fn(() => ({ onsuccess: null, onerror: null })),
      get: vi.fn(() => ({ onsuccess: null, onerror: null, result: undefined })),
      getAll: vi.fn(() => ({ onsuccess: null, onerror: null, result: [] })),
      put: vi.fn(() => ({ onsuccess: null, onerror: null })),
      delete: vi.fn(() => ({ onsuccess: null, onerror: null })),
    })),
  })),
}

vi.stubGlobal('indexedDB', {
  open: vi.fn(() => ({
    onerror: null,
    onsuccess: null,
    result: mockDB,
    onupgradeneeded: null,
  })),
})

vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid',
})

describe('Database Operations', () => {
  beforeEach(() => {
    mockStore.clear()
    vi.clearAllMocks()
  })

  it('should export database functions', async () => {
    const db = await import('../db')
    
    expect(typeof db.createPreset).toBe('function')
    expect(typeof db.getPreset).toBe('function')
    expect(typeof db.getAllPresets).toBe('function')
    expect(typeof db.updatePreset).toBe('function')
    expect(typeof db.deletePreset).toBe('function')
    expect(typeof db.createRecord).toBe('function')
    expect(typeof db.getAllRecords).toBe('function')
    expect(typeof db.deleteRecord).toBe('function')
  })
})
