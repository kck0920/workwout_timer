interface ExerciseAnimationProps {
  exerciseName?: string
  isExercise: boolean
}

export function ExerciseAnimation({ exerciseName = '', isExercise }: ExerciseAnimationProps) {
  const name = exerciseName.toLowerCase()

  let type = 'general'
  let muscleLabel = '전신'

  if (!isExercise || name.includes('휴식')) {
    type = 'rest'
    muscleLabel = '휴식 및 호흡'
  } else if (name.includes('점핑') || name.includes('jumping')) {
    type = 'jumpingJacks'
    muscleLabel = '전신 유산소'
  } else if (name.includes('스쿼트') || name.includes('squat')) {
    type = 'squat'
    muscleLabel = '허벅지 & 둔근'
  } else if (name.includes('파이크') || name.includes('pike')) {
    type = 'pikePushup'
    muscleLabel = '어깨 (삼각근)'
  } else if (name.includes('푸시업') || name.includes('푸쉬업') || name.includes('push')) {
    type = 'pushup'
    muscleLabel = '가슴 & 삼두'
  } else if (name.includes('클라이머') || name.includes('climber')) {
    type = 'mountainClimber'
    muscleLabel = '복근 & 심폐'
  } else if (name.includes('런지') || name.includes('lunge')) {
    type = 'lunge'
    muscleLabel = '대퇴부 & 둔근'
  } else if (name.includes('브릿지') || name.includes('bridge')) {
    type = 'gluteBridge'
    muscleLabel = '힙업 & 햄스트링'
  } else if (name.includes('레그') || name.includes('leg raise')) {
    type = 'legRaise'
    muscleLabel = '하복부'
  } else if (name.includes('슈퍼맨') || name.includes('superman')) {
    type = 'superman'
    muscleLabel = '등 & 허리'
  } else if (name.includes('딥스') || name.includes('dips')) {
    type = 'dips'
    muscleLabel = '삼두 (팔 뒷근육)'
  } else if (name.includes('홀로우') || name.includes('hollow')) {
    type = 'hollowBody'
    muscleLabel = '코어 전면'
  } else if (name.includes('플랭크') || name.includes('plank')) {
    type = 'plank'
    muscleLabel = '코어 전반'
  }

  const primaryColor = isExercise ? 'var(--color-primary)' : 'var(--color-secondary)'
  const glowColor = isExercise ? 'rgba(244, 63, 94, 0.6)' : 'rgba(99, 102, 241, 0.6)'
  const bodyColor = 'var(--color-text)'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes anim-jack-arms-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-135deg); }
        }
        @keyframes anim-jack-arms-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(135deg); }
        }
        @keyframes anim-jack-legs-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-28deg); }
        }
        @keyframes anim-jack-legs-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(28deg); }
        }
        @keyframes anim-shadow-jack {
          0%, 100% { transform: scaleX(1); opacity: 0.6; }
          50% { transform: scaleX(0.4); opacity: 0.2; }
        }
        @keyframes anim-squat-body {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(22px) rotate(-8deg); }
        }
        @keyframes anim-squat-thighs {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5) translateY(10px); }
        }
        @keyframes anim-pushup-body {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(18px); }
        }
        @keyframes anim-pushup-elbow {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(45deg); }
        }
        @keyframes anim-pike-body {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(10deg); }
        }
        @keyframes anim-climber-leg1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-24px) translateY(-8px); }
        }
        @keyframes anim-climber-leg2 {
          0%, 100% { transform: translateX(-24px) translateY(-8px); }
          50% { transform: translateX(0); }
        }
        @keyframes anim-lunge-body {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes anim-bridge-hips {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes anim-legraise-legs {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-82deg); }
        }
        @keyframes anim-superman-body {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-4deg); }
        }
        @keyframes anim-dips-body {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(16px); }
        }
        @keyframes anim-plank-pulse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes anim-rest-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes muscle-glow {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 2px ${glowColor}); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px ${glowColor}); }
        }
      `}</style>

      {/* Media / SVG Container */}
      <div
        style={{
          width: '110px',
          height: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {type === 'jumpingJacks' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            <img
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnF4cHBpcGs4ZDZxd3I3cGo3YnRwem9vaGNvZmwydHZzZTc0Z2NoaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WgViBJUWQMEeu5Jvmd/giphy.gif"
              alt="점핑잭 운동 GIF"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
        ) : (
          <svg
            viewBox="0 0 120 120"
            style={{ width: '100%', height: '100%' }}
            stroke={bodyColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* Floor & Shadow */}
            <line x1="12" y1="104" x2="108" y2="104" stroke="var(--color-border)" strokeWidth="3" opacity="0.5" />
            <ellipse
              cx="60"
              cy="104"
              rx="32"
              ry="4"
              fill="rgba(0, 0, 0, 0.2)"
              stroke="none"
            />

          {/* 2. SQUAT */}
          {type === 'squat' && (
            <g transform="translate(10, 10)" style={{ animation: 'anim-squat-body 1.3s infinite ease-in-out' }}>
              {/* Head */}
              <circle cx="50" cy="24" r="8" fill={bodyColor} stroke="none" />
              {/* Torso */}
              <path d="M50,32 L46,62" strokeWidth="5" />
              {/* Arms extended */}
              <line x1="48" y1="40" x2="80" y2="40" strokeWidth="4" />
              {/* Thighs & Calves */}
              <path d="M46,62 L32,76 L48,94" strokeWidth="4" />
              <path d="M46,62 L64,76 L52,94" strokeWidth="4" />
              {/* Muscle Highlight: Thighs/Glutes */}
              <path d="M46,62 L32,76" stroke={primaryColor} strokeWidth="5" style={{ animation: 'muscle-glow 1s infinite' }} />
              <path d="M46,62 L64,76" stroke={primaryColor} strokeWidth="5" style={{ animation: 'muscle-glow 1s infinite' }} />
            </g>
          )}

          {/* 3. PUSHUP */}
          {type === 'pushup' && (
            <g transform="translate(12, 28)" style={{ animation: 'anim-pushup-body 1.2s infinite ease-in-out' }}>
              {/* Head */}
              <circle cx="20" cy="38" r="8" fill={bodyColor} stroke="none" />
              {/* Body Line */}
              <line x1="20" y1="46" x2="84" y2="52" strokeWidth="5" />
              {/* Chest & Triceps Glow */}
              <line x1="24" y1="46" x2="52" y2="49" stroke={primaryColor} strokeWidth="6" style={{ animation: 'muscle-glow 1s infinite' }} />
              {/* Arms */}
              <path d="M32,47 L32,68 L38,68" strokeWidth="4" />
              {/* Feet */}
              <line x1="84" y1="52" x2="88" y2="68" strokeWidth="4" />
            </g>
          )}

          {/* 4. PIKE PUSHUP */}
          {type === 'pikePushup' && (
            <g transform="translate(10, 15)" style={{ animation: 'anim-pike-body 1.2s infinite ease-in-out' }}>
              <circle cx="28" cy="56" r="8" fill={bodyColor} stroke="none" />
              {/* Inverted V Body */}
              <path d="M22,78 L52,32 L84,86" strokeWidth="5" />
              {/* Arms */}
              <line x1="52" y1="32" x2="34" y2="70" strokeWidth="4" />
              {/* Shoulder Glow */}
              <circle cx="52" cy="32" r="7" fill={primaryColor} stroke="none" style={{ animation: 'muscle-glow 1s infinite' }} />
            </g>
          )}

          {/* 5. MOUNTAIN CLIMBER */}
          {type === 'mountainClimber' && (
            <g transform="translate(8, 18)">
              {/* Head */}
              <circle cx="26" cy="44" r="8" fill={bodyColor} stroke="none" />
              {/* Body */}
              <line x1="26" y1="52" x2="78" y2="56" strokeWidth="5" />
              {/* Core Glow */}
              <line x1="36" y1="53" x2="62" y2="55" stroke={primaryColor} strokeWidth="6" style={{ animation: 'muscle-glow 1s infinite' }} />
              {/* Arms */}
              <line x1="34" y1="53" x2="34" y2="84" strokeWidth="4" />
              {/* Leg 1 */}
              <g style={{ animation: 'anim-climber-leg1 0.6s infinite ease-in-out' }}>
                <path d="M78,56 L54,72 L84,84" strokeWidth="4" />
              </g>
              {/* Leg 2 */}
              <g style={{ animation: 'anim-climber-leg2 0.6s infinite ease-in-out' }}>
                <path d="M78,56 L42,66 L84,84" strokeWidth="4" />
              </g>
            </g>
          )}

          {/* 6. LUNGE */}
          {type === 'lunge' && (
            <g transform="translate(10, 10)" style={{ animation: 'anim-lunge-body 1.4s infinite ease-in-out' }}>
              <circle cx="50" cy="22" r="8" fill={bodyColor} stroke="none" />
              <line x1="50" y1="30" x2="50" y2="60" strokeWidth="5" />
              {/* Front Leg */}
              <path d="M50,60 L70,72 L70,94" strokeWidth="4" />
              {/* Back Leg */}
              <path d="M50,60 L30,76 L24,94" strokeWidth="4" />
              {/* Thigh Glow */}
              <path d="M50,60 L70,72" stroke={primaryColor} strokeWidth="5" style={{ animation: 'muscle-glow 1s infinite' }} />
            </g>
          )}

          {/* 7. GLUTE BRIDGE */}
          {type === 'gluteBridge' && (
            <g transform="translate(5, 20)">
              <circle cx="24" cy="72" r="8" fill={bodyColor} stroke="none" />
              <g style={{ animation: 'anim-bridge-hips 1.4s infinite ease-in-out' }}>
                {/* Torso & Bridge */}
                <path d="M24,72 L58,48 L84,70 L84,84" strokeWidth="5" />
                {/* Glute Glow */}
                <circle cx="58" cy="48" r="8" fill={primaryColor} stroke="none" style={{ animation: 'muscle-glow 1s infinite' }} />
              </g>
            </g>
          )}

          {/* 8. LEG RAISE */}
          {type === 'legRaise' && (
            <g transform="translate(8, 22)">
              <circle cx="26" cy="72" r="8" fill={bodyColor} stroke="none" />
              <line x1="26" y1="72" x2="60" y2="72" strokeWidth="5" />
              {/* Lower Abs Glow */}
              <circle cx="52" cy="72" r="6" fill={primaryColor} stroke="none" style={{ animation: 'muscle-glow 1s infinite' }} />
              {/* Raising Legs */}
              <g style={{ transformOrigin: '60px 72px', animation: 'anim-legraise-legs 1.6s infinite ease-in-out' }}>
                <line x1="60" y1="72" x2="98" y2="72" strokeWidth="4" />
              </g>
            </g>
          )}

          {/* 9. SUPERMAN */}
          {type === 'superman' && (
            <g transform="translate(5, 22)">
              <g style={{ animation: 'anim-superman-body 1.5s infinite ease-in-out' }}>
                <circle cx="22" cy="54" r="8" fill={bodyColor} stroke="none" />
                {/* Arch Body */}
                <path d="M12,44 L32,64 L68,64 L92,48" strokeWidth="5" />
                {/* Back Glow */}
                <path d="M32,64 L68,64" stroke={primaryColor} strokeWidth="6" style={{ animation: 'muscle-glow 1s infinite' }} />
              </g>
            </g>
          )}

          {/* 10. DIPS */}
          {type === 'dips' && (
            <g transform="translate(10, 15)">
              <g style={{ animation: 'anim-dips-body 1.2s infinite ease-in-out' }}>
                <circle cx="45" cy="32" r="8" fill={bodyColor} stroke="none" />
                <line x1="45" y1="40" x2="45" y2="66" strokeWidth="5" />
                {/* Arms */}
                <path d="M45,48 L28,60 L28,84" strokeWidth="4" />
                {/* Triceps Glow */}
                <path d="M45,48 L28,60" stroke={primaryColor} strokeWidth="5" style={{ animation: 'muscle-glow 1s infinite' }} />
                {/* Legs */}
                <path d="M45,66 L72,66 L86,84" strokeWidth="4" />
              </g>
            </g>
          )}

          {/* 11. HOLLOW BODY */}
          {type === 'hollowBody' && (
            <g transform="translate(5, 22)">
              <g style={{ animation: 'anim-superman-body 1.8s infinite ease-in-out' }}>
                <circle cx="24" cy="62" r="8" fill={bodyColor} stroke="none" />
                <path d="M14,50 L34,68 L68,68 L90,54" strokeWidth="5" />
                <path d="M34,68 L68,68" stroke={primaryColor} strokeWidth="6" style={{ animation: 'muscle-glow 1s infinite' }} />
              </g>
            </g>
          )}

          {/* 12. PLANK */}
          {type === 'plank' && (
            <g transform="translate(8, 22)">
              <g style={{ animation: 'anim-plank-pulse 1.8s infinite ease-in-out' }}>
                <circle cx="24" cy="52" r="8" fill={bodyColor} stroke="none" />
                <line x1="24" y1="60" x2="84" y2="60" strokeWidth="5" />
                {/* Core Glow */}
                <line x1="36" y1="60" x2="68" y2="60" stroke={primaryColor} strokeWidth="6" style={{ animation: 'muscle-glow 1s infinite' }} />
                {/* Elbows */}
                <path d="M32,60 L32,74 L24,74" strokeWidth="4" />
                {/* Feet */}
                <line x1="84" y1="60" x2="90" y2="74" strokeWidth="4" />
              </g>
            </g>
          )}

          {/* 13. REST */}
          {type === 'rest' && (
            <g transform="translate(60, 56)">
              <g style={{ animation: 'anim-rest-breathe 2s infinite ease-in-out', transformOrigin: 'center' }}>
                <circle cx="0" cy="-28" r="9" fill={bodyColor} stroke="none" />
                {/* Torso */}
                <line x1="0" y1="-18" x2="0" y2="12" strokeWidth="5" />
                {/* Heart / Breathing Glow */}
                <circle cx="0" cy="-6" r="6" fill={primaryColor} stroke="none" style={{ animation: 'muscle-glow 1.5s infinite' }} />
                {/* Arms Resting on knees */}
                <path d="M0,-8 L-20,6 L-14,24" strokeWidth="4" />
                <path d="M0,-8 L20,6 L14,24" strokeWidth="4" />
                {/* Crossed legs */}
                <path d="M0,12 L-24,28 L24,28 L0,12" strokeWidth="4" />
              </g>
            </g>
          )}

          {/* 14. GENERAL FALLBACK */}
          {type === 'general' && (
            <g transform="translate(60, 56)">
              <g style={{ animation: 'anim-rest-breathe 1.5s infinite ease-in-out', transformOrigin: 'center' }}>
                <circle cx="0" cy="-28" r="8" fill={bodyColor} stroke="none" />
                <line x1="0" y1="-20" x2="0" y2="10" strokeWidth="5" />
                <line x1="0" y1="-12" x2="-20" y2="8" strokeWidth="4" />
                <line x1="0" y1="-10" x2="20" y2="8" strokeWidth="4" />
                <line x1="0" y1="10" x2="-14" y2="40" strokeWidth="4" />
                <line x1="0" y1="10" x2="14" y2="40" strokeWidth="4" />
              </g>
            </g>
          )}
        </svg>
        )}
      </div>

      {/* Target Muscle Badge */}
      <div
        style={{
          marginTop: '4px',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-surface-variant)',
          border: '1px solid var(--color-border)',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: primaryColor,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        🎯 {muscleLabel}
      </div>
    </div>
  )
}
