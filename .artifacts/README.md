# ViewLogic Artifacts

이 폴더는 ViewLogic 프로젝트의 큰 파일들을 수정할 때 참고하기 위한 구조화된 정보를 담고 있습니다.

## 콜그래프 시스템 (Callgraph System)

### callgraph/callgraph-summary.json ⭐ 
**함수 호출 관계 요약 - 코드 수정 전 영향 범위 파악용**

### callgraph/router-function-callgraph.json
**router.js 상세 콜그래프 - 필요시 참고**

### callgraph/build-function-callgraph.json  
**build.cjs 상세 콜그래프 - 필요시 참고**

## LLM 장기 기억 시스템 (Long-term Memory System)

### memory/project-context.json ⭐ 🧠  
**프로젝트 전체 컨텍스트 - 새 세션 시 첫 번째로 읽을 파일**

### memory/coding-rules.json ⭐ 📋
**절대 규칙과 컨벤션 - 코드 수정 전 필수 확인**

### memory/common-tasks.json ⭐ 🔧  
**자주 하는 작업 워크플로우 - 실제 작업 시 체크리스트로 활용**

### memory/architecture-patterns.json 🏗️
**아키텍처 패턴 - 새 기능 설계 시 참고**

### memory/conversation-history.json 💭  
**과거 결정 기록 - 맥락 이해를 위한 참고**

### memory/maintenance-guide.json 🔧
**간소화된 업데이트 가이드 - artifacts 관리 방법**

## 업데이트 가이드

### ⭐ **핵심 업데이트 규칙**
1. **항상**: 코드 수정 후 → `node generate-callgraph.cjs`
2. **기능 완료 후**: `project-context.json` currentState 업데이트  
3. **새 규칙 발견**: `coding-rules.json`에 추가
4. **새 워크플로우**: `common-tasks.json`에 추가

**상세 가이드**: `memory/maintenance-guide.json` 참고

## 파일 구조

```
.artifacts/
├── README.md                              # 이 파일
├── callgraph/                             # 함수 호출 관계 분석
│   ├── callgraph-summary.json             # 함수 호출 관계 요약 ⭐
│   ├── router-function-callgraph.json     # router.js 상세 콜그래프  
│   └── build-function-callgraph.json      # build.cjs 상세 콜그래프
└── memory/                                # LLM 장기 기억 시스템 (통합)
    ├── project-context.json               # 프로젝트 컨텍스트 + 코어파일 구조
    ├── coding-rules.json                   # 절대 규칙과 컨벤션
    ├── architecture-patterns.json         # 아키텍처 패턴
    ├── common-tasks.json                   # 자주 하는 작업 패턴
    ├── conversation-history.json           # 중요한 결정 기록
    └── maintenance-guide.json              # artifacts 업데이트 가이드
```

**루트 레벨 도구:**
```
generate-callgraph.cjs                     # 콜그래프 생성 도구 (루트에 위치)
```

## 주의사항

- 이 파일들은 실제 코드가 아닌 **참고용 메타데이터**입니다
- 실제 코드 변경 시에는 원본 파일(.js, .cjs)을 수정해야 합니다
- artifacts 파일은 원본 파일과 항상 동기화를 유지해야 합니다

## 사용 시나리오

### ⭐ **LLM 사용 시나리오**

**🧠 새 세션 시작**: `project-context.json` → `coding-rules.json` → 작업별 파일들

**🔧 기능 개발**: `common-tasks.json` 워크플로우 → `architecture-patterns.json` 패턴 적용

**🐛 코드 수정**: `callgraph-summary.json` 영향도 파악 → 수정 → 업데이트

## 도구 활용

### 콜그래프 업데이트
```bash
node generate-callgraph.cjs
```

### LLM 프롬프트 예시
```
먼저 .artifacts/memory/project-context.json을 읽고 프로젝트를 이해한 후, 
.artifacts/memory/coding-rules.json의 규칙을 준수하여 작업해줘.
```

## 버전 관리

- 각 JSON 파일의 `lastUpdated` 필드로 최신 업데이트 날짜 추적
- `recentChanges` 배열로 주요 변경사항 기록
- 원본 파일 수정 시 해당 날짜와 변경 내용을 반드시 업데이트
- LLM 장기 기억 시스템은 지속적으로 업데이트하여 최신 상태 유지