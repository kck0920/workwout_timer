# Workout Timer PWA - Spec

## Problem Statement

운동을 할 때 각 운동별로 적절한 타이머가 필요하지만, 범용적인 운동 타이머 앱은 찾기 어렵습니다. 특히 인터벌 운동(세트 기반)을 할 때 운동-휴식 시간을 수동으로 관리해야 하며, 운동 종목별로 다른 설정이 필요합니다. 모바일/태블릿에서 운동 중 화면이 꺼지거나 앱 전환 시 타이머가 멈추는 문제도 있습니다.

## Solution

세트 기반 인터벌 운동을 지원하는 모바일/태블릿 PWA 타이머를 만듭니다. 사용자는 혼합 운동(HIIT + 근력 + 유산소) 프리셋을 선택하거나 커스텀 프리셋을 만들 수 있으며, 운동 중 원형 프로그레스 바와 소리/진동 피드백으로 진행 상황을 확인할 수 있습니다. 백그라운드에서도 타이머가 계속 실행되고, 다크 테마를 기본으로 제공합니다. 반응형 레이아웃으로 모바일과 태블릿 모두에서 최적의 경험을 제공합니다.

## User Stories

1. As a user, I want to select a pre-built workout preset (HIIT, strength, cardio), so that I can start exercising immediately without setup
2. As a user, I want to create a custom preset with my own exercises and timing, so that I can tailor workouts to my needs
3. As a user, I want to duplicate an existing preset and modify it, so that I can create variations without starting from scratch
4. As a user, I want to edit a preset's name, exercises, sets, and timing, so that I can keep my presets up to date
5. As a user, I want to delete a preset I no longer need, so that my preset list stays clean
6. As a user, I want to start a workout from a preset, so that I can begin exercising with one tap
7. As a user, I want to see a circular progress bar during exercise, so that I can visually track remaining time
8. As a user, I want to hear a sound when exercise/rest transitions happen, so that I know when to switch without looking at the screen
9. As a user, I want to feel a vibration when exercise/rest transitions happen, so that I get tactile feedback during workout
10. As a user, I want the timer to continue running when I switch apps or lock my phone, so that my workout isn't interrupted
11. As a user, I want to see the current exercise name and set number during workout, so that I know where I am in the routine
12. As a user, I want to pause the timer during workout, so that I can take an unexpected break
13. As a user, I want to skip to the next exercise or rest period, so that I can customize my workout flow in real-time
14. As a user, I want to see my workout history (date, preset name), so that I can track my consistency
15. As a user, I want the app to use dark mode by default, so that it's easy on my eyes during early morning or late night workouts
16. As a user, I want to toggle between dark and light mode, so that I can choose my preferred theme
17. As a user, I want to use the app offline after first load, so that I can workout anywhere without internet
18. As a user, I want set-based interval structure (Set 1: Exercise A x3, rest, Set 2: Exercise B x3), so that it mirrors real workout routines
19. As a user, I want to see a list of all my presets on the home screen, so that I can quickly pick one
20. As a user, I want the app to feel native on my phone, so that it provides a smooth mobile experience
21. As a user, I want the app to work well on my tablet, so that I can use a larger screen during workouts
22. As a user, I want the UI to adapt to tablet screen size, so that elements are appropriately sized and positioned

## Implementation Decisions

### Tech Stack
- React + Vite for the application framework
- PWA with service worker for offline support and installability
- IndexedDB for structured data persistence (presets, workout history)
- CSS custom properties for dark/light theme switching

### Architecture
- **Timer Engine**: Core module that manages countdown logic, interval sequencing, and background execution. Uses `requestAnimationFrame` or `setInterval` with drift correction. Continues running when page loses focus via Web Workers or background timer API.
- **Preset Manager**: CRUD operations for workout presets with duplicate functionality. Stores in IndexedDB.
- **Audio Manager**: Plays sound cues at exercise/rest transitions. Uses Web Audio API for reliable playback even when tab is backgrounded.
- **Vibration Manager**: Uses `navigator.vibrate()` API for haptic feedback at transitions.
- **History Logger**: Records completed workouts (date, preset name, duration) to IndexedDB.

### Data Model

**Preset**
```
{
  id: string (UUID)
  name: string
  exercises: Array<{
    name: string
    type: 'exercise' | 'rest'
    duration: number (seconds)
    repetitions?: number
  }>
  sets: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Workout Record**
```
{
  id: string (UUID)
  presetId: string
  presetName: string
  completedAt: timestamp
  duration: number (seconds)
}
```

### UI Layout (Workout Screen)

**Mobile (< 768px)**
- Top: Current exercise name + set indicator (e.g., "Set 2/3")
- Center: Large circular progress bar with countdown timer in center
- Bottom: Pause/Skip/Stop controls
- Color coding: exercise = primary color, rest = muted color

**Tablet (>= 768px)**
- Side panel: Preset list / workout history (when not in active workout)
- Main area: Circular progress bar (larger) + controls
- Top bar: Current exercise name + set indicator
- Bottom: Pause/Skip/Stop controls (larger touch targets)

### Sound Design
- Short beep for exercise start
- Longer tone for rest start
- Double beep for set completion
- Triple beep for workout complete

### Theme
- Dark mode default with CSS custom properties
- System preference detection via `prefers-color-scheme`
- Manual toggle saved to localStorage

### PWA Configuration
- Service worker for offline caching
- Web app manifest for installability
- Responsive design for mobile (< 768px) and tablet (>= 768px) breakpoints
- Touch-optimized controls with appropriate sizing for both form factors

## Testing Decisions

### Testing Approach
- Unit tests for timer engine logic (countdown, drift correction, interval sequencing)
- Unit tests for preset CRUD operations
- Integration tests for workout flow (start → exercise → rest → complete)
- E2E tests for critical user journeys (create preset → start workout → complete)

### Test Quality Criteria
- Test external behavior, not implementation details
- Mock IndexedDB for unit tests
- Mock audio/vibration APIs in tests
- Test timer accuracy under various conditions (background, tab switch)

### Prior Art
- No existing tests in codebase (greenfield project)

## Out of Scope

- User authentication or cloud sync
- Social features (sharing workouts, leaderboards)
- Exercise video demonstrations
- Heart rate monitor integration
- Advanced workout analytics (charts, trends)
- Multi-language support (Korean only for MVP)
- Exercise library with images/videos
- Rest timer customization between sets (fixed at preset value)

## Further Notes

- Timer must be accurate even when browser throttles background tabs
- IndexedDB operations should be wrapped in a clean async API
- Consider using a state management library (Zustand recommended for simplicity) for app state
- PWA install prompt should be shown after first workout completion
- Use CSS media queries with breakpoints: mobile (< 768px), tablet (>= 768px)
- Tablet layout should utilize extra space for parallel information display (e.g., preset list alongside timer)
