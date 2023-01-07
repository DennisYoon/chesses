<img src="https://img.shields.io/badge/version-0.4.0-black" />

# 체스 구현체

## 진행 상황
|날짜|진행 상황|
|---|---|
|2022-12-16|전체적인 board 디자인 구현, board 생성과 기물 생성 함수 작성.|
|2022-12-17|1. 흑돌 사용자의 편의를 위해 흑돌 기물 이름과 정보를 180도 회전.<br>2. `gulp.js` 이용해 프론트엔드 언어를 `js`에서 `ts`로 변경 밑 `uglify`.<br>3. `기물 enum`과 `편 enum`, `위치 interface` 작성 밑 `Piece class`에 적용.|
|2022-12-19|1. 윤형이가 얘기한 대로 `Ware` -> `Piece`, `Pone` -> `Pawn`으로 변경.<br>2. 윤형이가 얘기한 대로 더러운 `new Piece(...)`를 전용 함수 사용으로 교체하고 폰은 반복문을 통해 생성.|
|2022-12-20|1. 파라미터 값에 따라 `board`의 크기 커스터마이징 가능.<br>2. `Situation`타입을 `types4Board.ts` 파일로 이동.<br>3. 파일명 변경.<br>4. `movableLocations` 구조 형성.|
|2022-12-23|1. 모드 선택 창 생성.<br>2. 판의 디자인과 색상 변경, 배경색상 변경.<br>3. 흑 or 백 차례를 시각적으로 알려주기 위해 자기 쪽 박스에 색상 변화.<br>4. 이름들 대폭 변경.<br>5. `urlChecker` 추가.<br>6. `pieceStruct` 분리.|
|2022-12-24|1. 잘못된 파라미터로 접속시 `일리걸 엑세스`창으로 접속.<br>2. 전체화면 모드 생성.<br>3. `setsetWillMoveListenersOf` 메소드 생성.<br>4. `Game` 클래스 파괴 밑 `Board` 클래스를 `Game` 클래스로 변경.<br>5. `board` 비율 변경.<br>6. `Piece` enum과 `Side` enum에 `null` 값 추가.<br>7. 기물 선택 시 이벤트 생성. (`waitUntil` 함수도)<br>8. `movableLocations`의 `rook` 함수 제작.<br>9. 움직일 수 있는 곳 시각적으로 표시.<br>10. 흑 or 백 차례를 시각적으로 알려주기 위해 자기 쪽 박스에 색상 변화 코딩.|
|2022-Christmas|1. commit 내용 수정.|
|2023-01-05|1. 선택했을 때 움직일 수 있는 곳 디자인 변경.<br>2. `night`의 `movableLocations` 구현.<br>3. `customizable` 접근 금지.|
|2022-01-06|1. 앙파상과 프로모션 제외 기물 움직임 모두 구현 완!<br>2. 기물 선택 취소 가능.<br>3. 움직임 반 구현.|
|2022-01-07|1. 기본적인 기물의 움직임 & 앙파상 구현!!<br>2. 차례 확인 오류 수정.<br>3. 함수 분리.