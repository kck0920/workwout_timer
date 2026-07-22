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
export const DEFAULT_BODYWEIGHT_PRESETS: Omit<Preset, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: '[맨손 20분] 전신 칼로리 폭파 루틴',
    sets: 4,
    exercises: [
      { name: '점핑잭 (전신 유산소)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '에어 스쿼트 (하체 기본)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '무릎 푸시업 (가슴/삼두)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '마운틴 클라이머 (복근/복부)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '플랭크 (코어 전반)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '세트 간 휴식', type: 'rest', duration: 20 },
    ],
  },
  {
    name: '[맨손 20분] 하체 & 코어 강화 루틴',
    sets: 4,
    exercises: [
      { name: '와이드 스쿼트 (허벅지 안쪽/둔근)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '리버스 런지 (허벅지/힙)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '글루트 브릿지 (힙/햄스트링)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '레그 레이즈 (하복부)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '플랭크 트위스트 (옆구리/코어)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '세트 간 휴식', type: 'rest', duration: 20 },
    ],
  },
  {
    name: '[맨손 20분] 상체 & 코어 단련 루틴',
    sets: 4,
    exercises: [
      { name: '표준 푸시업 (가슴/어깨/팔)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '파이크 푸시업 (어깨/상체)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '슈퍼맨 홀드 (등/허리/척추)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '플로어 딥스 (삼두/팔 뒷근육)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '홀로우 바디 홀드 (코어 전면)', type: 'exercise', duration: 50, restDuration: 10 },
      { name: '세트 간 휴식', type: 'rest', duration: 20 },
    ],
  },
]

export async function seedDefaultPresets(): Promise<Preset[]> {
  const seeded: Preset[] = []
  for (const presetData of DEFAULT_BODYWEIGHT_PRESETS) {
    const created = await createPreset(presetData)
    seeded.push(created)
  }
  return seeded
}

export async function getAllPresets(): Promise<Preset[]> {
  const db = await openDB()
  const tx = await getTransaction(db, ['presets'])
  const store = tx.objectStore('presets')
  const presets = await promisifyRequest(store.getAll())
  if (presets.length === 0) {
    return await seedDefaultPresets()
  }
  return presets
}

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
