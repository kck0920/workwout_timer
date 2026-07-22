import type { Preset, WorkoutRecord } from './types'

const DB_NAME = 'workout-timer'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains('presets')) {
        const presetStore = db.createObjectStore('presets', { keyPath: 'id' })
        presetStore.createIndex('name', 'name', { unique: false })
      }

      if (!db.objectStoreNames.contains('records')) {
        const recordStore = db.createObjectStore('records', { keyPath: 'id' })
        recordStore.createIndex('presetId', 'presetId', { unique: false })
        recordStore.createIndex('completedAt', 'completedAt', { unique: false })
      }
    }
  })
}

function generateId(): string {
  return crypto.randomUUID()
}

async function getTransaction(
  db: IDBDatabase,
  stores: string[],
  mode: IDBTransactionMode = 'readonly'
): Promise<IDBTransaction> {
  const tx = db.transaction(stores, mode)
  return tx
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Preset CRUD
export async function createPreset(
  preset: Omit<Preset, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Preset> {
  const db = await openDB()
  const tx = await getTransaction(db, ['presets'], 'readwrite')
  const store = tx.objectStore('presets')

  const newPreset: Preset = {
    ...preset,
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  await promisifyRequest(store.add(newPreset))
  return newPreset
}

export async function getPreset(id: string): Promise<Preset | undefined> {
  const db = await openDB()
  const tx = await getTransaction(db, ['presets'])
  const store = tx.objectStore('presets')
  return promisifyRequest(store.get(id))
}

export async function getAllPresets(): Promise<Preset[]> {
  const db = await openDB()
  const tx = await getTransaction(db, ['presets'])
  const store = tx.objectStore('presets')
  return promisifyRequest(store.getAll())
}

export async function updatePreset(preset: Preset): Promise<Preset> {
  const db = await openDB()
  const tx = await getTransaction(db, ['presets'], 'readwrite')
  const store = tx.objectStore('presets')

  const updatedPreset: Preset = {
    ...preset,
    updatedAt: Date.now(),
  }

  await promisifyRequest(store.put(updatedPreset))
  return updatedPreset
}

export async function deletePreset(id: string): Promise<void> {
  const db = await openDB()
  const tx = await getTransaction(db, ['presets'], 'readwrite')
  const store = tx.objectStore('presets')
  await promisifyRequest(store.delete(id))
}

// Workout Record CRUD
export async function createRecord(
  record: Omit<WorkoutRecord, 'id' | 'completedAt'>
): Promise<WorkoutRecord> {
  const db = await openDB()
  const tx = await getTransaction(db, ['records'], 'readwrite')
  const store = tx.objectStore('records')

  const newRecord: WorkoutRecord = {
    ...record,
    id: generateId(),
    completedAt: Date.now(),
  }

  await promisifyRequest(store.add(newRecord))
  return newRecord
}

export async function getAllRecords(): Promise<WorkoutRecord[]> {
  const db = await openDB()
  const tx = await getTransaction(db, ['records'])
  const store = tx.objectStore('records')
  const records = await promisifyRequest(store.getAll())
  return records.sort((a, b) => b.completedAt - a.completedAt)
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await openDB()
  const tx = await getTransaction(db, ['records'], 'readwrite')
  const store = tx.objectStore('records')
  await promisifyRequest(store.delete(id))
}

export async function updateRecordMemo(id: string, memo: string): Promise<void> {
  const db = await openDB()
  const tx = await getTransaction(db, ['records'], 'readwrite')
  const store = tx.objectStore('records')
  const record = await promisifyRequest(store.get(id))
  if (record) {
    record.memo = memo
    await promisifyRequest(store.put(record))
  }
}

// Preset Export/Import
export function exportPreset(preset: Preset): string {
  const exportData = {
    version: 1,
    exportedAt: Date.now(),
    preset: {
      name: preset.name,
      exercises: preset.exercises,
      sets: preset.sets,
    },
  }
  return JSON.stringify(exportData, null, 2)
}

export async function importPreset(jsonString: string): Promise<Preset> {
  const data = JSON.parse(jsonString)
  
  if (!data.version || !data.preset) {
    throw new Error('유효하지 않은 프리셋 파일입니다.')
  }

  const { name, exercises, sets } = data.preset
  
  if (!name || !Array.isArray(exercises) || typeof sets !== 'number') {
    throw new Error('프리셋 데이터가 올바르지 않습니다.')
  }

  return createPreset({ name, exercises, sets })
}
