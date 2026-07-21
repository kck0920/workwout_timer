# 04 — 타이머 엔진

**What to build:** 세트 기반 인터벌 타이머의 핵심 로직을 만든다. 카운트다운, 운동-휴식 전환, 세트 시퀀스 관리를 담당한다.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] 상태 머신: idle → exercising → resting → completed
- [ ] 카운트다운 로직 (setInterval + drift 보정)
- [ ] 세트 시퀀스 관리 (현재 세트, 현재 운동 인덱스)
- [ ] 이벤트 콜백 (onTick, onTransition, onSetComplete, onComplete)
- [ ] pause / resume / skip 기능
- [ ] 유닛 테스트
