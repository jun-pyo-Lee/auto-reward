
### 
NESTJS + MSA + MongoDB 기반으로 각각의 서버구조로 구축해보는 것을 공부

----
#### 실행법
- powerShell에서 docker-compose up -d --build
----
- 권한정리
   - 회원가입, 로그인을 제외한 모든 요청에 요구사항에 맞춰 권한을 부여해놨습니다.

---
이벤트 설계
---

조건
1. 운영자 또는 관리자가 이벤트를 생성할수있어야하며
2. 보상 정보를 추가할 수 있어야한다.
3. 유저는 특정 이벤트에 대해 보상을 요청해야한다.
4. 보상은 검토하거나, 자동으로 주는걸로 진행해야한다.
   
이벤트 설계 조건을 보았을때, 바로 생각났던 것이 
"초성퀴즈" 와 "룰렛" 이벤트 였습니다.

초성퀴즈 맞출시 3장 자동지급 (사용자가 입력한 값이 답이 맞는지 검증 맞으면, 자동지급)
룰렛권 10장, 20장,30장 획득하면 특별보상 추가 지급 신청(운영자가 검토 필요, 중복지급X)

룰렛을 돌리면 랜덤하게 보상을 획득하는 것으로 구현해봤습니다.

---
# API 설계 및 데이터
- 해당 순서대로 진행하면 좋을 듯 싶습니다.<br/>
필수로 넣어야 할 데이터도 존재합니다.<br/>

- BaseURL : http://localhost:3000
1. 회원가입
- /auth/register		(POST) </br>
      - 입력데이터 : </br>
   {"U_LoginID" : "admin", "U_LoginPW" : "admin", "U_Nm" : "관리자", "U_NickNm" : "관리자","U_Role" : "Admin"}</br>
   {"U_LoginID" : "user", "U_LoginPW" : "user", "U_Nm" : "유저", "U_NickNm" : "유저","U_Role" : "User"}</br>
   {"U_LoginID" : "auditor", "U_LoginPW" : "auditor", "U_Nm" : "감사자", "U_NickNm" : "감사자","U_Role" : "Auditor"}</br>
   {"U_LoginID" : "operator", "U_LoginPW" : "operator", "U_Nm" : "운영자", "U_NickNm" : "운영자","U_Role" : "Operator"}</br>
- 주의점 : U_Role(역할)은 꼭 대문자로 직접 입력해서 Insert 해야합니다.

2. 로그인
- /auth/login      (POST)</br>
   - 입력데이터 : </br>
 {"U_LoginID" : "admin","U_LoginPW" : "admin"}</br>
 로그인 시 JWT토큰 발행됩니다. <br/>

4. 이벤트 추가
- /event/event-add	(POST)
   - 입력데이터 : <br/>
   {
     "E_Nm": "초성퀴즈",
     "E_SrtDe": "2025-05-10",
     "E_EndDe" : "2025-12-31",
     "E_Sts" : "진행중"
}</br>
{
     "E_Nm": "룰렛",
     "E_SrtDe": "2025-05-10",
     "E_EndDe" : "2025-05-15",
     "E_Sts" : "진행중"
}
   - "초성퀴즈" 와 "룰렛"은 꼭 입력해주세요.
   - 중복된 이벤트 등록 시, <br/> {
    "message": [
        "이미 존재하는 이벤트입니다.",
        "이벤트명 : 룰렛",
        "이벤트코드 : E_00000002"
    ],
    "error": "Conflict",
    "statusCode": 409
}


5. 보상 등록
- /event/reward-add (POST)
   - 입력데이터 <br/>
   {
    "RW_E_ID" : "E_00000001",
    "RW_Nm" : "티켓",
    "RW_Qty" : 3,
    "RW_Tic" : 1
}<br/>
   - RW_E_ID는 이벤트 내역 조회로 코드를 보고 등록해야합니다.
   - 보상명 "티켓"은 꼭 초성퀴즈의 이벤트에 등록해주세요.
   - RW_Tic은 기본값은 1로 넣어주시고, 추후 룰렛이벤트(유저가 보상요청 시) 에 사용되며, 룰렛을 돌린 횟수에따라 신청 가능합니다.
   - 룰렛 1번돌리기의 보상은 랜덤으로 지급됩니다.


6. 퀴즈 등록
- /event/quiz-add (POST)
  - 입력데이터</br>
    {
    "CQ_Que" : "ㅇㄹㅈ",
    "CQ_Hint" : "음식",
    "CQ_Ans" : "오렌지"}<br/>
  - "초성퀴즈" 이벤트가 등록되어있지 않으면, 초성퀴즈문제를 등록 할 수 없습니다.


7.  퀴즈 뽑기
- /event/quiz-random (GET)
  - 출력데이터 <br/>
  {
    "_id": "682b6e89fe8182840dd8dad2",
    "CQ_ID": "CQ_00000005",
    "CQ_E_ID": "E_00000001",
    "CQ_Que": "ㅇㄹㅈ",
    "CQ_Hint": "음식",
    "CQ_U_ID": "U_00000001",
    "CQ_De": "2025-05-19"
}<br/>
   - 해당 데이터를 Front에 던지면 Front단에서 CQ_Que(문제), CQ_Hint(힌트) 두가지만 보여주는 처리를 진행해야합니다.


8. 퀴즈맞추기
- /event/quiz-answer (POST)
     - 입력데이터</br>
       {
          "CQ_ID": "CQ_00000002",
          "answer":"이블윙즈"
      }
   - CQ_ID는 클라이언트에서 자동으로 가져올것이지만, 룰렛 진행을 위해 넣어놨습니다.
   - 이 문제를 하루에 한번 맞출 경우, 룰렛 티켓이 발급되며, 보상테이블에 입력했던 티켓 수량만큼 발급됩니다.
   - 하루에 한문제만 맞출수 있게 로직을 구현해놨으므로, 더 나은 테스트를 위해, 티켓의 수량을 넉넉히 하시면 좋을듯합니다.


9. 룰렛돌리기 
- /event/roulette-play (POST)
   - 입력데이터는 없으나, 헤더에서 U_ID를 계속 전달하기때문에 POST로 지정했습니다.
   - 보상테이블에 "룰렛" 이벤트 코드로 등록되고, RW_Tic (티켓조건)이 1인 보상중 랜덤으로 보상획득합니다.
   
10. 특별보상신청하기
- /event/wating-reward-req (POST)
   - 입력데이터는 없고 클라이언트와의 연결이 필요합니다. 들어와야할 param값은 아래의 두가지입니다.<br/>
      예시) {"U_ID":"U_00000001", "RW_ID":"RW_00000001"}<br/>
   - 해당 로직은, 룰렛 돌린 횟수에 따라 보상을 신청할 수 있습니다.<br/>
   - 룰렛을 10번 넘게 돌렸다면, 클라이언트에서 10번 보상 링크를 누르고 해당 링크의 RW_ID(보상고유ID)를 받아와 로그인한 유저의 U_ID가 신청하게됩니다 (즉, 버튼만 누르면 검증 후 자동신청).
   - 즉, 룰렛을 n번 돌려야만 조건에 부합하며 중복신청은 막았습니다.

11. 보상 검토 후 지급하기
- /event/wating-reward-res (POST)
   - 입력데이터는 없고, 클라이언트와의 연결이 필요합니다. 들어와야할 param값은 아래의 두가지입니다. <br/>
  예시) {"WR_U_ID":"U_00000001", "WR_ID":"WR_00000001"}<br/>
   - 이 또한, 클라이언트에서 운영자나 관리자가 보상 대기 테이블(WR)에서 유저를 보고 승인해주어야합니다.(승인 버튼 클릭 시, 자동 지급)
   - 유저가 지금까지 사용했던 룰렛티켓횟수를 볼 수 있습니다.
   - 승인 성공 시, UQ(통합테이블)에 보상 이력이 추가됩니다.


12. 보상 요청 조회
- /event/wating-reward-list    (POST)<br/>
     - 해당 요청은 접속한 유저가 자신의 이력만 조회 가능합니다.

13. 보상 요청 조회 (유저전체)
- /event/wating-reward-list-all (GET)
      - 해당 요청은 관리자, 감사자, 운영자만 조회 가능하며 전체 유저의 보상 요청이력을 볼 수 있습니다.

14. 통합 보상이력 조회
- /event/useq-list-all (GET)
      - 전체 유저들의 보상이력을 조회하는 요청입니다.

15. 퀴즈 데이터 조회
- /event/quiz-list-all (GET)
      - 등록된 퀴즈 데이터들을 조회하는 요청입니다

16. 이벤트 조회
- /event/event-list-all (GET)
      - 등록된 이벤트를 조회하는 요청입니다.

17. 보상테이블 조회
- /event/reward-list-all (GET)
      - 등록된 보상 테이블을 조회하는 요청입니다.



---

## DB설계
해당 설계는 먼저 RDBMS 기준으로 조인과 프로시저의 기능을 생각하며 작성하였습니다.

각 테이블 별 _ID 는 데이터 삽입시, U_00000001 , U_0000002 이렇게 끝 숫자가 자동으로 증가되어 insert되게 됩니다


U(유저테이블)<br/>
---
U_ID        // 유저 고유 ID<br/>
U_LoginID   // 로그인 ID<br/>
U_LoginPW   // 비밀번호<br/>
U_Name      // 이름<br/>
U_NickNm    // 닉네임<br/>
U_Role      // 역할<br/>
U_CreDe     // 생성일<br/>
U_IsDel     // 탈퇴여부<br/>
U_DelDe     // 탈퇴일<br/>

---
E(이벤트테이블)
---
E_ID        // 이벤트 고유 ID<br/>
E_Nm        // 이벤트명<br/>
E_SrtDe     // 이벤트시작일<br/>
E_EndDe     // 이벤트종료일<br/>
E_Sts       // 이벤트상태<br/>
E_U_ID      // 이벤트 등록자<br/>
E_InDe      // 이벤트 등록일<br/>

---
R(역할테이블)
---
R_ID        // 역할 고유 ID<br/>
R_Nm        // 역할이름<br/>
R_Per       // 역할별 권한설정<br/>

---
CQ(퀴즈테이블)
---
CQ_ID       // 퀴즈 고유ID<br/>
CQ_E_ID     // 이벤트 고유ID<br/>
CQ_Que      // 퀴즈 문제<br/>
CQ_Hint     // 퀴즈 힌트<br/>
CQ_Ans      // 퀴즈 답<br/>
CQ_U_ID     // 퀴즈 등록자(관리자만가능)<br/>

---
RT(보상 대기 테이블)
---
WR_ID       // 보상 대기 ID<br/>
WR_E_ID     // 이벤트 고유 ID<br/>
WR_RW_ID    // 보상 아이템 고유 ID<br/>
WR_U_ID     // 유저 고유 ID<br/>
WR_Qty      // 보상 검증용 수량<br/>
WR_De       // 등록일<br/>
WR_Sts      // 보상 대기/승인 <br/>

---
UQ(통합테이블)
---
UQ_ID       // 통합고유ID<br/>
UQ_U_ID     // 유저고유ID<br/>
UQ_E_ID     // 이벤트고유ID<br/>
UQ_RW_ID    // 보상 고유 ID<br/>
UQ_Qty      // 보상 수량<br/>
UQ_Sts      // 지급 여부(대기,획득,사용)<br/>
UQ_De       // 지급 <br/>


이벤트 조회 : 
이벤트 조회시 , 여러종류의 param값으로 이벤트별, 등록자별, 기간별로 조회가 가능하며 <br/>
UQ테이블 활용시(유저별,보상별) 등으로 조회도 가능합니다. <br/>

UQ 테이블이란?<br/>
모든 유저의 보상 지급 이력 테이블 입니다.<br/>
보상을 요청 할 시 <br/>
해당 유저의 U_ID<br/>
이벤트 테이블의 E_ID<br/>
보상테이블의 RW_ID<br/>
를 param값으로 받아 데이터가 insert되게 됩니다.<br/>


### 아래부터는 좀 더 시인성을 높히기위하여 제가 작성했던 내용을 캡쳐하여 첨부하겠습니다

![Image](https://github.com/user-attachments/assets/e863b99e-c656-45c6-a920-f9d624654ef5)
![Image](https://github.com/user-attachments/assets/f8d9911a-e9f8-48ae-b69c-296de7620de4)
![image](https://github.com/user-attachments/assets/c4ac8182-a278-4dac-b4d7-d4856190a251)
![image](https://github.com/user-attachments/assets/113cb844-6c95-430d-8872-799e492761b0)


---
#### 구현 중 겪은 어려움과 느낀점
- 관계형 데이터베이스만 다뤘었기에, 각 테이블간 조인과 프로시져를 사용하지 않고,<br/> 어떻게 데이터를 원하는대로 뽑아내고, 저장할 수 있을 것 인가? 에 대해 고민이였습니다.
하지만, 제 아는 지식을 토대로 먼저 RDBMS처럼 DB를 설계하고 들어올 데이터를 생각하며 구성하였습니다.<br/>
그로인해, 스키마 설계 자체가 RDBMS의 모습이 많이 보이는듯 합니다.<br/>

---
