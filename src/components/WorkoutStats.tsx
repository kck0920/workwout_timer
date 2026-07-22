import { useMemo } from 'react'
import type { WorkoutRecord } from '../lib/types'
import { getMonthlyStats, getOverallStats, formatDuration } from '../lib/stats'

interface WorkoutStatsProps {
  records: WorkoutRecord[]
}

export function WorkoutStats({ records }: WorkoutStatsProps) {
  const overallStats = useMemo(() => getOverallStats(records), [records])
  const monthlyStats = useMemo(() => getMonthlyStats(records), [records])

  if (records.length === 0) {
    return null
  }

  const maxDuration = Math.max(...monthlyStats.map((s) => s.totalDuration))

  return (
    <div style={{ padding: '0 var(--space-md)', marginBottom: 'var(--space-lg)' }}>
      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
        운동 통계
      </h3>

      {/* Overall Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            {overallStats.totalWorkouts}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            총 운동 횟수
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            {formatDuration(overallStats.totalDuration)}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            총 운동 시간
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            {formatDuration(overallStats.averageDuration)}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            평균 운동 시간
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
            {overallStats.streakDays}일
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            연속 운동
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      {monthlyStats.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
          }}
        >
          <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
            월별 운동 시간
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {monthlyStats.map((stat) => (
              <div key={stat.month} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <div style={{ width: '80px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                  {stat.month}
                </div>
                <div style={{ flex: 1, height: '24px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${maxDuration > 0 ? (stat.totalDuration / maxDuration) * 100 : 0}%`,
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ width: '60px', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  {formatDuration(stat.totalDuration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
