import type { WorkoutRecord } from './types'

export interface MonthlyStats {
  month: string
  totalDuration: number
  workoutCount: number
}

export interface OverallStats {
  totalWorkouts: number
  totalDuration: number
  averageDuration: number
  streakDays: number
}

export function getMonthlyStats(records: WorkoutRecord[]): MonthlyStats[] {
  const monthlyMap = new Map<string, MonthlyStats>()

  records.forEach((record) => {
    const date = new Date(record.completedAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월`

    const existing = monthlyMap.get(monthKey)
    if (existing) {
      existing.totalDuration += record.duration
      existing.workoutCount += 1
    } else {
      monthlyMap.set(monthKey, {
        month: monthLabel,
        totalDuration: record.duration,
        workoutCount: 1,
      })
    }
  })

  return Array.from(monthlyMap.values()).reverse()
}

export function getOverallStats(records: WorkoutRecord[]): OverallStats {
  if (records.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      averageDuration: 0,
      streakDays: 0,
    }
  }

  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0)
  const averageDuration = Math.round(totalDuration / records.length)

  // Calculate streak
  const sortedDates = records
    .map((r) => new Date(r.completedAt).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streakDays = 0
  let currentDate = new Date()

  for (const dateStr of sortedDates) {
    const recordDate = new Date(dateStr)
    const diffDays = Math.floor(
      (currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays <= 1) {
      streakDays++
      currentDate = recordDate
    } else {
      break
    }
  }

  return {
    totalWorkouts: records.length,
    totalDuration,
    averageDuration,
    streakDays,
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`
  }
  if (minutes > 0) {
    return `${minutes}분 ${secs > 0 ? `${secs}초` : ''}`
  }
  return `${secs}초`
}
