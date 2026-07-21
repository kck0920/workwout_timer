export interface Exercise {
  name: string
  type: 'exercise' | 'rest'
  duration: number // seconds
  repetitions?: number
}

export interface Preset {
  id: string
  name: string
  exercises: Exercise[]
  sets: number
  createdAt: number
  updatedAt: number
}

export interface WorkoutRecord {
  id: string
  presetId: string
  presetName: string
  completedAt: number
  duration: number // seconds
}
