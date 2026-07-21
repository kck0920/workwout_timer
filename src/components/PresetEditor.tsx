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

  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) return
    if (formData.exercises.length === 0) return

    setSaving(true)
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
    <div style={{ padding: 'var(--space-md)', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-xl)' }}>
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
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-md)',
          }}
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
          }}
        >
          세트 수
        </label>
        <input
          id="sets"
          type="number"
          min={1}
          max={10}
          value={formData.sets}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, sets: parseInt(e.target.value) || 1 }))
          }
          style={{
            width: '100px',
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-md)',
          }}
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
          <h3 style={{ fontSize: 'var(--font-size-lg)' }}>운동 목록</h3>
          <button
            type="button"
            onClick={addExercise}
            style={{
              padding: 'var(--space-xs) var(--space-sm)',
              backgroundColor: 'var(--color-surface-variant)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            + 추가
          </button>
        </div>

        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: 'var(--space-xs)',
          }}
        >
        {formData.exercises.map((exercise, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => updateExercise(index, { name: e.target.value })}
                placeholder="운동 이름"
                style={{
                  flex: 1,
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'var(--color-surface-variant)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
              <select
                value={exercise.type}
                onChange={(e) =>
                  updateExercise(index, { type: e.target.value as 'exercise' | 'rest' })
                }
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  backgroundColor: 'var(--color-surface-variant)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <option value="exercise">운동</option>
                <option value="rest">휴식</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor={`duration-${index}`}
                  style={{
                    display: 'block',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                    marginBottom: '2px',
                  }}
                >
                  시간 (초)
                </label>
                <input
                  id={`duration-${index}`}
                  type="number"
                  min={5}
                  max={300}
                  value={exercise.duration}
                  onChange={(e) =>
                    updateExercise(index, { duration: parseInt(e.target.value) || 30 })
                  }
                  style={{
                    width: '100%',
                    padding: 'var(--space-xs) var(--space-sm)',
                    backgroundColor: 'var(--color-surface-variant)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text)',
                    fontSize: 'var(--font-size-sm)',
                  }}
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
                      marginBottom: '2px',
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
                    style={{
                      width: '100%',
                      padding: 'var(--space-xs) var(--space-sm)',
                      backgroundColor: 'var(--color-surface-variant)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <button
                type="button"
                onClick={() => moveExercise(index, 'up')}
                disabled={index === 0}
                style={{
                  padding: 'var(--space-xs)',
                  backgroundColor: 'var(--color-surface-variant)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                  opacity: index === 0 ? 0.5 : 1,
                  color: 'var(--color-text)',
                }}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveExercise(index, 'down')}
                disabled={index === formData.exercises.length - 1}
                style={{
                  padding: 'var(--space-xs)',
                  backgroundColor: 'var(--color-surface-variant)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: index === formData.exercises.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: index === formData.exercises.length - 1 ? 0.5 : 1,
                  color: 'var(--color-text)',
                }}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => duplicateExercise(index)}
                style={{
                  padding: 'var(--space-xs)',
                  backgroundColor: 'var(--color-surface-variant)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                }}
              >
                복사
              </button>
              <button
                type="button"
                onClick={() => removeExercise(index)}
                disabled={formData.exercises.length <= 1}
                style={{
                  padding: 'var(--space-xs)',
                  backgroundColor: 'var(--color-error)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: formData.exercises.length <= 1 ? 'not-allowed' : 'pointer',
                  opacity: formData.exercises.length <= 1 ? 0.5 : 1,
                  color: 'white',
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !formData.name.trim() || formData.exercises.length === 0}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving || !formData.name.trim() ? 0.5 : 1,
            fontWeight: 600,
          }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-surface-variant)',
            color: 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          취소
        </button>

        {preset?.id && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-error)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              maxWidth: '300px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 'var(--space-md)' }}>정말 삭제하시겠습니까?</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: 'var(--space-sm)',
                  backgroundColor: 'var(--color-error)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  padding: 'var(--space-sm)',
                  backgroundColor: 'var(--color-surface-variant)',
                  color: 'var(--color-text)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
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
