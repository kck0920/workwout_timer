import { useState, useCallback } from 'react'
import type { Preset, Exercise } from '../lib/types'
import { createPreset, updatePreset, deletePreset } from '../lib/db'

interface PresetEditorProps {
  preset: Preset | null
  onSave: () => void
  onDelete: () => void
  onCancel: () => void
}

function createEmptyExercise(): Exercise {
  return {
    name: '',
    type: 'exercise',
    duration: 30,
  }
}

function createDefaultPreset(): Preset {
  return {
    id: '',
    name: '',
    exercises: [createEmptyExercise()],
    sets: 3,
    createdAt: 0,
    updatedAt: 0,
  }
}

export function PresetEditor({ preset, onSave, onDelete, onCancel }: PresetEditorProps) {
  const [formData, setFormData] = useState<Preset>(preset ?? createDefaultPreset())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [editingDuration, setEditingDuration] = useState<{ index: number; value: string } | null>(null)
  const [setsInput, setSetsInput] = useState(String(preset?.sets ?? 3))

  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) return
    if (formData.exercises.length === 0) return

    setSaving(true)
    setSaveError(null)
    try {
      if (preset?.id) {
        await updatePreset(formData)
      } else {
        await createPreset({
          name: formData.name,
          exercises: formData.exercises,
          sets: formData.sets,
        })
      }
      onSave()
    } catch (err) {
      console.error('Failed to save preset:', err)
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }, [formData, preset, onSave])

  const handleDelete = useCallback(async () => {
    if (!preset?.id) return
    try {
      await deletePreset(preset.id)
      onDelete()
    } catch (err) {
      console.error('Failed to delete preset:', err)
    }
  }, [preset, onDelete])

  const addExercise = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, createEmptyExercise()],
    }))
  }, [])

  const removeExercise = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }))
  }, [])

  const updateExercise = useCallback((index: number, updates: Partial<Exercise>) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e, i) =>
        i === index ? { ...e, ...updates } : e
      ),
    }))
  }, [])

  const moveExercise = useCallback((index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.exercises.length) return prev

      const newExercises = [...prev.exercises]
      const [removed] = newExercises.splice(index, 1)
      newExercises.splice(newIndex, 0, removed)
      return { ...prev, exercises: newExercises }
    })
  }, [])

  const duplicateExercise = useCallback((index: number) => {
    setFormData((prev) => {
      const exercise = prev.exercises[index]
      const newExercises = [...prev.exercises]
      newExercises.splice(index + 1, 0, { ...exercise })
      return { ...prev, exercises: newExercises }
    })
  }, [])

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
        {preset?.id ? '프리셋 편집' : '새 프리셋'}
      </h2>

      {/* Preset Name */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          htmlFor="preset-name"
          style={{
            display: 'block',
            marginBottom: 'var(--space-xs)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          프리셋 이름
        </label>
        <input
          id="preset-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="예: 상체 루틴"
          className="form-input"
        />
      </div>

      {/* Sets */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          htmlFor="sets"
          style={{
            display: 'block',
            marginBottom: 'var(--space-xs)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          세트 수
        </label>
        <input
          id="sets"
          type="number"
          min={1}
          max={10}
          value={setsInput}
          onChange={(e) => {
            setSetsInput(e.target.value)
            const parsed = parseInt(e.target.value)
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
              setFormData((prev) => ({ ...prev, sets: parsed }))
            }
          }}
          onBlur={() => {
            const parsed = parseInt(setsInput)
            if (isNaN(parsed) || parsed < 1) {
              setSetsInput(String(formData.sets))
            } else {
              const clamped = Math.min(10, Math.max(1, parsed))
              setSetsInput(String(clamped))
              setFormData((prev) => ({ ...prev, sets: clamped }))
            }
          }}
          className="form-input"
          style={{ width: '120px' }}
        />
      </div>

      {/* Exercises */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}
        >
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>운동 목록</h3>
          <button
            type="button"
            onClick={addExercise}
            className="btn btn-secondary"
            style={{
              padding: 'var(--space-xs) var(--space-sm)',
              fontSize: 'var(--font-size-sm)',
              minHeight: '40px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            추가
          </button>
        </div>

        <div
          style={{
            maxHeight: '480px',
            overflowY: 'auto',
            paddingRight: 'var(--space-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
        {formData.exercises.map((exercise, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => updateExercise(index, { name: e.target.value })}
                placeholder="운동 이름"
                className="form-input"
                style={{ flex: 1 }}
              />
              <select
                value={exercise.type}
                onChange={(e) =>
                  updateExercise(index, { type: e.target.value as 'exercise' | 'rest' })
                }
                className="form-select"
                style={{ width: '120px' }}
              >
                <option value="exercise">운동</option>
                <option value="rest">휴식</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor={`duration-${index}`}
                  style={{
                    display: 'block',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                    marginBottom: '4px',
                    fontWeight: 500,
                  }}
                >
                  시간 (초)
                </label>
                <input
                  id={`duration-${index}`}
                  type="number"
                  min={5}
                  max={300}
                  value={editingDuration?.index === index ? editingDuration.value : String(exercise.duration)}
                  onChange={(e) => {
                    setEditingDuration({ index, value: e.target.value })
                    const parsed = parseInt(e.target.value)
                    if (!isNaN(parsed) && parsed >= 5 && parsed <= 300) {
                      updateExercise(index, { duration: parsed })
                    }
                  }}
                  onBlur={() => {
                    if (editingDuration?.index === index) {
                      const parsed = parseInt(editingDuration.value)
                      if (isNaN(parsed) || parsed < 5) {
                        setEditingDuration(null)
                      } else {
                        const clamped = Math.min(300, Math.max(5, parsed))
                        updateExercise(index, { duration: clamped })
                        setEditingDuration(null)
                      }
                    }
                  }}
                  className="form-input"
                />
              </div>
              {exercise.type === 'exercise' && (
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor={`reps-${index}`}
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-muted)',
                      marginBottom: '4px',
                      fontWeight: 500,
                    }}
                  >
                    반복 횟수
                  </label>
                  <input
                    id={`reps-${index}`}
                    type="number"
                    min={1}
                    max={100}
                    value={exercise.repetitions ?? ''}
                    onChange={(e) =>
                      updateExercise(index, {
                        repetitions: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="선택사항"
                    className="form-input"
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
              <button
                type="button"
                onClick={() => moveExercise(index, 'up')}
                disabled={index === 0}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: 'var(--space-xs)',
                  minHeight: '40px',
                }}
                title="위로 이동"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveExercise(index, 'down')}
                disabled={index === formData.exercises.length - 1}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: 'var(--space-xs)',
                  minHeight: '40px',
                }}
                title="아래로 이동"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => duplicateExercise(index)}
                className="btn btn-secondary"
                style={{
                  flex: 2,
                  padding: 'var(--space-xs)',
                  fontSize: 'var(--font-size-xs)',
                  minHeight: '40px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                복사
              </button>
              <button
                type="button"
                onClick={() => removeExercise(index)}
                disabled={formData.exercises.length <= 1}
                className="btn btn-danger"
                style={{
                  flex: 2,
                  padding: 'var(--space-xs)',
                  fontSize: 'var(--font-size-xs)',
                  minHeight: '40px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                삭제
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Action Buttons */}
      {saveError && (
        <div style={{
          padding: 'var(--space-sm) var(--space-md)',
          marginBottom: 'var(--space-md)',
          backgroundColor: 'var(--color-error)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          textAlign: 'center',
          fontWeight: 600,
        }}>
          {saveError}
        </div>
      )}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !formData.name.trim() || formData.exercises.length === 0}
          className="btn btn-primary"
          style={{
            flex: 2,
            padding: 'var(--space-md)',
          }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          style={{
            flex: 1,
            padding: 'var(--space-md)',
          }}
        >
          취소
        </button>

        {preset?.id && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-danger"
            style={{
              flex: 1,
              padding: 'var(--space-md)',
            }}
          >
            삭제
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              maxWidth: '360px',
              width: '90%',
              border: '1.5px solid var(--color-border)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>정말 삭제하시겠습니까?</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger"
                style={{
                  flex: 1,
                  padding: 'var(--space-sm)',
                }}
              >
                삭제
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: 'var(--space-sm)',
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
