# mini-project-myarchiveBE
💪 항해99 미니프로젝트 11조 백앤드 협업 git 입니다.

## ✔프로젝트 소개
#### 화나고 힘들 때마다 하나씩 지르게 되는 물건들을 일단 위시리스트에 저장해봅시다...
✅ 화날때마다 손이 이끄는데로 아이쇼핑을 하는 중 맘에드는 물건을 발견하면 바로 url을 복사해오세요!
</br>
✅ 복사한 url로 나의 위시리스트를 손쉽게 저장하고 관리할 수 있으며 다른 사람들과 공유할 수 있습니다.
</br>
✅ 메인 피드에서 다른 유저들의 위시리스트를 카테고리 별로 모아서 확인 해보세요!

## ✔사용한 라이브러리
``` JS
npm i cookie-parser dotenv express sequelize jsonwebtoken mysql2 prettier
npm i -D sequelize-cli nodemon
```
## ✔프로젝트 구조
```text
▼ mini-project-myarchive-be
  ▼ config
      config.js
  ▼ middlewares
    auth-middleware.js
  ▼ migrations
    20230317051016-create-users.js
    20230317051017-create-posts.js
  ▼ models
    index.js
    posts.js
    users.js
  ▼ routes
    posts.route.js
    users.route.js
    index.route.js
  app.js
```
구현이 완료되면 3 Layer Architecture 패턴으로 수정 예정입니다.
</br>
❗❗ 일단 구현이 우선 ❗❗

## ✔협업 진행 시 지켜야 할 약속
작업 중 구현이 잘 안되거나 막힌다고 자책하지 않기!!
</br>
찾아보다가 도저히 해답이 안나올 때는 동료에게 질문하기!!
</br>
질문하는 동료한테 친절하게 답해주기
</br>
담당하게 된 작업이 생각보다 너무 어렵거나 스코프가 커진다고 느낀다면 언제든지 팀장과 상의해서 재분배하기!!
</br>
부수적인 기능보다는 메인 기능에 집중해서 완벽하게 구현하기

## ✔API 설계가 완료되면 추가적으로 해볼 것
에러핸들링 미들웨어 적용해서 에러핸들링하기
</br>
유저 정보에 대한 보안강화하기
