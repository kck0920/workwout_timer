interface ExerciseAnimationProps {
  exerciseName?: string
  isExercise: boolean
}

export function ExerciseAnimation({ exerciseName = '', isExercise }: ExerciseAnimationProps) {
  const name = exerciseName.toLowerCase()

  let type = 'general'
  if (!isExercise || name.includes('휴식')) {
    type = 'rest'
  } else if (name.includes('점핑') || name.includes('jumping')) {
    type = 'jumpingJacks'
  } else if (name.includes('스쿼트') || name.includes('squat')) {
    type = 'squat'
  } else if (name.includes('파이크') || name.includes('pike')) {
    type = 'pikePushup'
  } else if (name.includes('푸시업') || name.includes('푸쉬업') || name.includes('push')) {
    type = 'pushup'
  } else if (name.includes('클라이머') || name.includes('climber')) {
    type = 'mountainClimber'
  } else if (name.includes('런지') || name.includes('lunge')) {
    type = 'lunge'
  } else if (name.includes('브릿지') || name.includes('bridge')) {
    type = 'gluteBridge'
  } else if (name.includes('레그') || name.includes('leg raise')) {
    type = 'legRaise'
  } else if (name.includes('슈퍼맨') || name.includes('superman')) {
    type = 'superman'
  } else if (name.includes('딥스') || name.includes('dips')) {
    type = 'dips'
  } else if (name.includes('홀로우') || name.includes('hollow')) {
    type = 'hollowBody'
  } else if (name.includes('플랭크') || name.includes('plank')) {
    type = 'plank'
  }

  const mainColor = isExercise ? 'var(--color-primary)' : 'var(--color-secondary)'
  const headColor = 'var(--color-text)'

  return (
    <div
      style={{
        width: '96px',
        height: '96px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes anim-jack-arms-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-130deg); }
        }
        @keyframes anim-jack-arms-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(130deg); }
        }
        @keyframes anim-jack-legs-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes anim-jack-legs-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes anim-squat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(18px); }
        }
        @keyframes anim-pushup {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(16px); }
        }
        @keyframes anim-pike {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(8deg); }
        }
        @keyframes anim-climber-leg1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-18px); }
        }
        @keyframes anim-climber-leg2 {
          0%, 100% { transform: translateX(-18px); }
          50% { transform: translateX(0); }
        }
        @keyframes anim-lunge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(18px); }
        }
        @keyframes anim-bridge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes anim-legraise {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-75deg); }
        }
        @keyframes anim-superman {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes anim-dips {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(14px); }
        }
        @keyframes anim-rest {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes anim-twist {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        style={{ width: '100%', height: '100%' }}
        stroke={mainColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Floor line */}
        <line x1="10" y1="88" x2="90" y2="88" stroke="var(--color-border)" strokeWidth="3" opacity="0.6" />

        {type === 'jumpingJacks' && (
          <g transform="translate(50, 48)">
            {/* Head */}
            <circle cx="0" cy="-30" r="7" fill={headColor} stroke="none" />
            {/* Torso */}
            <line x1="0" y1="-22" x2="0" y2="5" />
            {/* Left Arm */}
            <g style={{ transformOrigin: '0px -20px', animation: 'anim-jack-arms-left 0.8s infinite ease-in-out' }}>
              <line x1="0" y1="-20" x2="-22" y2="-5" />
            </g>
            {/* Right Arm */}
            <g style={{ transformOrigin: '0px -20px', animation: 'anim-jack-arms-right 0.8s infinite ease-in-out' }}>
              <line x1="0" y1="-20" x2="22" y2="-5" />
            </g>
            {/* Left Leg */}
            <g style={{ transformOrigin: '0px 5px', animation: 'anim-jack-legs-left 0.8s infinite ease-in-out' }}>
              <line x1="0" y1="5" x2="-10" y2="35" />
            </g>
            {/* Right Leg */}
            <g style={{ transformOrigin: '0px 5px', animation: 'anim-jack-legs-right 0.8s infinite ease-in-out' }}>
              <line x1="0" y1="5" x2="10" y2="35" />
            </g>
          </g>
        )}

        {type === 'squat' && (
          <g style={{ animation: 'anim-squat 1.2s infinite ease-in-out' }}>
            <circle cx="50" cy="22" r="7" fill={headColor} stroke="none" />
            {/* Torso */}
            <line x1="50" y1="30" x2="50" y2="54" />
            {/* Arms (extended front) */}
            <line x1="50" y1="35" x2="72" y2="35" />
            {/* Thighs & Calves */}
            <path d="M50,54 L38,68 L48,88" />
            <path d="M50,54 L62,68 L52,88" />
          </g>
        )}

        {type === 'pushup' && (
          <g transform="translate(10, 20)">
            <g style={{ animation: 'anim-pushup 1.2s infinite ease-in-out' }}>
              {/* Head */}
              <circle cx="20" cy="38" r="7" fill={headColor} stroke="none" />
              {/* Body */}
              <line x1="20" y1="46" x2="75" y2="52" />
              {/* Arms */}
              <line x1="30" y1="47" x2="30" y2="68" />
              {/* Feet */}
              <line x1="75" y1="52" x2="80" y2="68" />
            </g>
          </g>
        )}

        {type === 'pikePushup' && (
          <g style={{ animation: 'anim-pike 1.2s infinite ease-in-out' }}>
            <circle cx="32" cy="52" r="7" fill={headColor} stroke="none" />
            {/* V shape body */}
            <path d="M26,68 L50,30 L76,78" />
            <line x1="50" y1="30" x2="36" y2="62" />
          </g>
        )}

        {type === 'mountainClimber' && (
          <g transform="translate(5, 10)">
            {/* Head */}
            <circle cx="24" cy="40" r="7" fill={headColor} stroke="none" />
            {/* Body & Arms */}
            <line x1="24" y1="48" x2="68" y2="52" />
            <line x1="32" y1="49" x2="32" y2="78" />
            {/* Leg 1 */}
            <g style={{ animation: 'anim-climber-leg1 0.6s infinite ease-in-out' }}>
              <path d="M68,52 L50,66 L78,78" />
            </g>
            {/* Leg 2 */}
            <g style={{ animation: 'anim-climber-leg2 0.6s infinite ease-in-out' }}>
              <path d="M68,52 L38,62 L78,78" />
            </g>
          </g>
        )}

        {type === 'lunge' && (
          <g style={{ animation: 'anim-lunge 1.4s infinite ease-in-out' }}>
            <circle cx="45" cy="22" r="7" fill={headColor} stroke="none" />
            <line x1="45" y1="30" x2="45" y2="54" />
            <path d="M45,54 L62,64 L62,88" />
            <path d="M45,54 L28,68 L24,88" />
          </g>
        )}

        {type === 'gluteBridge' && (
          <g transform="translate(0, 15)">
            <circle cx="22" cy="65" r="7" fill={headColor} stroke="none" />
            <g style={{ animation: 'anim-bridge 1.4s infinite ease-in-out' }}>
              <path d="M22,65 L50,45 L72,62 L72,73" />
            </g>
          </g>
        )}

        {type === 'legRaise' && (
          <g transform="translate(5, 20)">
            <circle cx="25" cy="64" r="7" fill={headColor} stroke="none" />
            <line x1="25" y1="64" x2="52" y2="64" />
            <g style={{ transformOrigin: '52px 64px', animation: 'anim-legraise 1.6s infinite ease-in-out' }}>
              <line x1="52" y1="64" x2="84" y2="64" />
            </g>
          </g>
        )}

        {type === 'superman' && (
          <g transform="translate(0, 15)">
            <g style={{ animation: 'anim-superman 1.5s infinite ease-in-out' }}>
              <circle cx="20" cy="50" r="7" fill={headColor} stroke="none" />
              <path d="M12,42 L30,58 L62,58 L82,46" />
            </g>
          </g>
        )}

        {type === 'dips' && (
          <g transform="translate(5, 10)">
            <g style={{ animation: 'anim-dips 1.2s infinite ease-in-out' }}>
              <circle cx="40" cy="32" r="7" fill={headColor} stroke="none" />
              <line x1="40" y1="40" x2="40" y2="60" />
              <path d="M40,48 L25,58 L25,78" />
              <path d="M40,60 L62,60 L78,78" />
            </g>
          </g>
        )}

        {type === 'hollowBody' && (
          <g transform="translate(0, 15)">
            <g style={{ animation: 'anim-superman 1.8s infinite ease-in-out' }}>
              <circle cx="22" cy="56" r="7" fill={headColor} stroke="none" />
              <path d="M12,46 L30,62 L60,62 L80,50" />
            </g>
          </g>
        )}

        {type === 'plank' && (
          <g transform="translate(5, 20)">
            <g style={{ animation: 'anim-twist 2s infinite ease-in-out' }}>
              <circle cx="22" cy="48" r="7" fill={headColor} stroke="none" />
              <line x1="22" y1="56" x2="76" y2="56" />
              <path d="M30,56 L30,68 L22,68" />
              <line x1="76" y1="56" x2="82" y2="68" />
            </g>
          </g>
        )}

        {type === 'rest' && (
          <g transform="translate(50, 48)">
            <g style={{ animation: 'anim-rest 2s infinite ease-in-out', transformOrigin: 'center' }}>
              <circle cx="0" cy="-24" r="8" fill={headColor} stroke="none" />
              {/* Sitting torso */}
              <line x1="0" y1="-16" x2="0" y2="10" />
              {/* Hands on knees */}
              <path d="M0,-8 L-16,4 L-12,20" />
              <path d="M0,-8 L16,4 L12,20" />
              {/* Crossed legs */}
              <path d="M0,10 L-20,24 L20,24 L0,10" />
            </g>
          </g>
        )}

        {type === 'general' && (
          <g transform="translate(50, 48)">
            <g style={{ animation: 'anim-rest 1.5s infinite ease-in-out', transformOrigin: 'center' }}>
              <circle cx="0" cy="-24" r="8" fill={headColor} stroke="none" />
              <line x1="0" y1="-16" x2="0" y2="10" />
              <line x1="0" y1="-10" x2="-18" y2="8" />
              <line x1="0" y1="-10" x2="18" y2="8" />
              <line x1="0" y1="10" x2="-12" y2="35" />
              <line x1="0" y1="10" x2="12" y2="35" />
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}
