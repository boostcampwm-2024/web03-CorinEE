# web03-CorinEE
<div align="center">

![corinee](https://github.com/user-attachments/assets/4ee33c08-0fe6-41b1-8b48-11c0c2273df7)

  

## 본격 코린이 탈출! 실전 투자자로 나아가는 여정 🚀

</div>

## 📄 목차

- [📄 목차](#-목차)
- [✍🏻 프로젝트 소개](#프로젝트-소개)
- [🛠️ 기술적 도전](#%EF%B8%8F-기술적-도전)
  - [🔎 FE 기술적 도전](#-FE-기술적-도전)
    - [♻️ 코드의 재사용성 높이기](#%EF%B8%8F-코드의-재사용성-높이기)
    - [⚡API 호출 최적화](#API-호출-최적화)
  - [🔎 BE 기술적 도전](#-BE-기술적-도전)
    - [📊 매수/매도 최적화](#-매수매도-최적화)
    - [📈 차트 api 트래픽 조절](#-차트-api-트래픽-조절)
  - [🔎 공통 기술적 도전](#-공통-기술적-도전)
    - [🛠️ 실시간 데이터 송수신 구조 개선](#%EF%B8%8F-실시간-데이터-송수신-구조-개선)
- [✍🏻 페이지별 기능 설명](#페이지별-기능-설명)
  - [📊 홈 페이지](#-홈-페이지)
  - [📈 비트코인 상세보기 페이지](#-비트코인-상세보기-페이지)
  - [💰 내 계좌 페이지](#-내-계좌-페이지)
  - [🏆 모의 투자 랭킹 페이지](#-모의-투자-랭킹-페이지)
- [⚙️ 기술 스택](#️-기술-스택)
- [🏛️ 시스템 아키텍처](#️-시스템-아키텍처)
- [👨‍👩‍👧‍👧 팀원 소개](#-팀원-소개)

# 프로젝트 소개
> 🌱 코인 투자, 첫 걸음이 막막하신가요? 처음 시작하는 분들을 위한 안전한 투자 연습장이 여기 있습니다!<br>
>
> 📊 <strong>실제 업비트(Upbit) 거래소의 실시간 API를 연동하여 실제 시장 가격 데이터를</strong> 그대로 활용합니다.<br>
> 이는 여러분이 <strong>실전과 동일한 환경에서</strong> 투자 연습을 할 수 있다는 것을 의미합니다!<br>
>
> 🔥 코린이 서비스와 함께라면 자신감 있는 투자자로 성장할 수 있어요!<br>
> <strong>실제 시장 데이터로 연습하고</strong>, 실전에서 더 현명한 투자 결정을 내려보세요!<br>
> 이제 진짜 같은 모의투자로 당신의 투자 실력을 한 단계 업그레이드하세요! 💪
>
>[코린이 사이트 방문하기](https://www.corinee.site/)

# 🛠️ 기술적 도전

## 🔎 FE 기술적 도전

### ♻️ 코드의 재사용성 높이기
- FE의 팀적 목표중 하나는 코드의 재사용성을 높이는 방법을 많이 사용하고자 했습니다.
- 코드의 재사용성을 높여 코드의 중복을 줄이고 개발 생산성을 향상 시키기 위해 노력했으며 아래 내용은 코드 재사용성을 높이기 위한 노력을 담고 있습니다.

#### HOC 패턴을 통한 컴포넌트 제어
| 로그인 필요한 컴포넌트                                                                                                                   | HOC 패턴                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| <img alt="" src="https://github.com/user-attachments/assets/4727c774-e48d-471a-b3c5-9cff18cc43fd" /> | <img width="1350px" height="auto" alt="" src="https://github.com/user-attachments/assets/21ec264e-d54f-4647-9bf5-0869f98e5fbf" /> |

- **Problem**
    - 현재 서비스상 **로그인시에만 접근할 수 있는 컴포넌트가** 상당수 존재했습니다.
    - 로그인 시 필요한 컴포넌트들은 로그인 인증을 확인하는 코드들이 **중복적으로 작성되는 문제점이 발견됐습니다.**
- **Solved**
    - 여러 해결 방법 중, 프론트엔드에서 중요한 역량 중 하나인 **재사용성**을 고려하여 **HOC(고차 컴포넌트) 패턴**을 활용해 문제를 해결하였습니다.
- [고차 컴포넌트를 활용한 접근 제어](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%EA%B3%A0%EC%B0%A8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%A0%91%EA%B7%BC-%EC%A0%9C%EC%96%B4)

#### axios interceptor 활용으로 코드 중복 개선
![interceptor](https://github.com/user-attachments/assets/fc519aac-d7c1-4b0f-94e6-b79086661f77)
- **Problem**
    - 로그인을 통해 접근이 가능한 api는 access_token이 만료될 시 401 에러가 발생하며 ```refresh_token``` 을 통해 ```access_token```을 다시 **재발급 받는 로직이 모든 인증이 필요한 api 요청에 중복되어 작성되었습니다**
- **Solved**
    - **axios interceptor**를 활용 해 인증이 필요한 api 요청이나 응답을 보내기 전/후에 해당 로직을 가로채서 해결하여 코드의 중복을 줄일 수 있었습니다.
- [axios interceptor로 로그인 필요한 api 들 개선하기](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%5BFE%5D-axios-interceptor%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%95%84%EC%9A%94%ED%95%9C-api-%EB%93%A4-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0)

### ⚡API 호출 최적화

#### 차트 무한 스크롤링 쓰로틀링으로 최적화하기
![차트최적화](https://github.com/user-attachments/assets/62481573-0850-469d-a6be-db6ce8c8550d)
- **Problem**
    - 기존 차트 무한스크롤 시 사용자의 모든 스크롤 요청에 api를 호출하여 **429 에러**가 발생하는 문제점이 있었습니다
- **Solved**
    - 위 문제를 해결하기 위해 **쓰로틀링을 도입해 api 호출 최적화**를 진행할 수 있었습니다.
- [차트 무한 스크롤 구현하기](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/TanstackQuery-%EB%A1%9C-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EC%B0%A8%ED%8A%B8)
- [차트 무한 스크롤링 최적화](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%5BFE%5D-%EC%B0%A8%ED%8A%B8-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4%EB%A7%81-%EC%B5%9C%EC%A0%81%ED%99%94)
#### 검색 api 디바운싱으로 최적화하기
![검색 디바운싱](https://github.com/user-attachments/assets/8fcb71fc-9e0c-4d5c-abe8-a7767c005505)
- **Problem**
    - 기존 검색 기능 구현 시 사용자가 키보드를 입력할때 마다 api 요청을 보내 과도한 api 호출이 발생했습니다.
- **Solved**
    - 위 문제를 해결하기 위해 **디바운싱을** 도입해 api 호출 최적화를 진행할 수 있었습니다.
- [검색 구현 및 검색 최적화](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%EA%B2%80%EC%83%89-%EA%B5%AC%ED%98%84-%EB%B0%8F-%EA%B2%80%EC%83%89-%EC%B5%9C%EC%A0%81%ED%99%94)

## 🔎 BE 기술적 도전

### 📊 매수/매도 최적화

<img width="994" alt="스크린샷 2024-12-03 오후 4 33 26" src="https://github.com/user-attachments/assets/6c22be6f-51d7-4e78-a867-ee0ba59ef867">


- **Problem**
    - 실제 거래소와 유사한 환경을 제공하기 위해 호가창 기반의 실시간 매매 시스템이 필요했습니다.
    - DB 기반 처리 방식은 동시 주문이 많아질 경우 쿼리 병목이 발생하고, 빠른 가격 변동으로 인해 원하는 가격에 주문 체결이 어려웠습니다.
- **Solved**
    - 미체결 정보는 Trade DB에 저장하고, 실시간으로 변동되는 호가 정보는 Redis에서 관리하는 이원화된 구조를 설계했습니다.
    - Transaction Lock을 도입하여 주문 체결 시 데이터 정합성을 보장하고, 체결된 거래는 원자적으로 사용자 잔고와 거래 내역에 반영되도록 구현했습니다.
    - Lock 기반의 거래 처리로 동시성 이슈를 해결하고 안정적인 주문 체결이 가능해졌고, Redis 도입으로 호가 정보 조회 및 매칭 처리 속도가 5배 향상되었고, 실시간 거래소와 유사한 사용자 경험을 제공할 수 있게 되었습니다.

[[BE] 매수 매도 로직 구현 및 개선 과정](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%5BBE%5D-%EB%A7%A4%EC%88%98-%EB%A7%A4%EB%8F%84-%EB%A1%9C%EC%A7%81-%EA%B5%AC%ED%98%84-%EB%B0%8F-%EA%B0%9C%EC%84%A0-%EA%B3%BC%EC%A0%95)

### 📈 차트 api 트래픽 조절

![image](https://github.com/user-attachments/assets/1584a5b7-9de2-4a46-8b4d-36bfc96bb2ca)

![image](https://github.com/user-attachments/assets/f4e5e40a-5732-4567-abe5-0e6ec17118c8)

- **Problem**
    
    업비트 API의 초당 요청 제한으로 인해 다수의 요청을 효율적으로 처리할 수 있는 방안이 필요했습니다.
    
- **Solved**
    
    **Queue 활용 (단일 서버)**
    
    - Queue를 통해 API 요청을 순차적으로 제어했으나, 요청이 누적될수록 대기 시간이 길어져 응답 시간이 급격히 증가(50 RPS에서 4초 이상)했습니다.
    
    **로드밸런싱 도입 (4대 서버)**
    
    - 각 서버별로 독립적인 API 인스턴스를 사용해 전체 요청 처리량을 증가시켰습니다.
    - 최소 연결 방식의 로드밸런싱을 적용했으나, 급격한 요청 증가 시 안정적인 성능을 보장하기 어려웠습니다.
    
    **Redis 캐싱 도입 (단일 서버)**
    
    - 특정 알고리즘의 영향을 받지 않는 Redis 캐싱을 적용하여 불필요한 API 호출을 최소화했습니다.
    - 캐시된 데이터를 활용함으로써 API 요청 제한에 효과적으로 대응하고, 응답 시간을 크게 단축했습니다.

[[BE] Queue, Load Balancing, Redis](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%5BBE%5D-Queue,-Load-Balancing,-Redis)

## 🔎 공통 기술적 도전

### 🛠️ 실시간 데이터 송수신 구조 개선

| 구조 개선 아키텍쳐                                                                                                                   | 실시간 데이터 스트림                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
|  <img alt="" src="https://github.com/user-attachments/assets/7cc9ba49-24a1-4c7b-ba4a-58cad4751065" /> | <img alt="" width="500px" src="https://github.com/user-attachments/assets/3d6c71f4-acc5-4538-8f76-55bb8d3078fc" /> |

- **Problem**
    - 클라이언트마다 Upbit api요청시 **CORS**와 **429** **Too Many Requests** 에러가 발생했습니다.
    - 이는 Upbit가 **서비스 안정성 유지**와 **서버 과부하 방지**를 위해 사용자별로 API 요청 수를 제한하는 정책을 적용하고 있기 때문입니다.
    - 이러한 정책으로 인해 다수의 클라이언트가 개별적으로 API를 호출하면 제한에 도달하여 요청이 차단되는 상황이 발생했습니다.
- **Solved**
    - 문제를 해결하기 위해 **API 구조를 서버 중심으로 재설계** 하였습니다.
    - 서버에서만 **Upbit와 단일 웹소켓 연결**을 유지하고, 실시간 데이터를 수신하도록 구현했습니다.
    - 클라이언트는 Upbit와 직접 통신하지 않으며, 대신 서버를 통해 데이터를 전달받습니다.
    - 이를 위해 ```SSE``` 를 도입하여 클라이언트가 원하는 이벤트 타입을 실시간으로 서버로부터 받아올 수 있도록 했습니다.
    - 이러한 구조 변경으로 클라이언트의 API 요청 수를 줄이고, 업비트의 요청 제한 문제와 CORS 문제를 동시에 해결할 수 있었습니다.

[[공통] 배포 환경에서 웹소켓 에러 및 구조 개선](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%5B%EA%B3%B5%ED%86%B5%5D-%EB%B0%B0%ED%8F%AC-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-%EC%9B%B9%EC%86%8C%EC%BC%93-%EC%97%90%EB%9F%AC-%EB%B0%8F-%EA%B5%AC%EC%A1%B0-%EA%B0%9C%EC%84%A0) </br>
[[BE] SSE 구현](https://github.com/boostcampwm-2024/web03-CorinEE/wiki/%5BBE%5D-SSE-%EA%B5%AC%ED%98%84)

# 페이지별 기능 설명

## 📊 홈 페이지
> 모든 코인의 실시간 시세를 한눈에 확인할 수 있는 메인 페이지입니다.<br>
> 다양한 마켓의 정보를 실시간으로 제공하여 빠르게 시장 동향을 파악할 수 있어요!

![chrome_6Zl4TkcwCF](https://github.com/user-attachments/assets/f511c7a5-bd03-4780-b244-6ba091c5e5e1)

<details>
<summary><strong>🔒 로그인</strong></summary>
<img src="https://github.com/user-attachments/assets/176772c7-ba9e-42e6-8934-d51999f224a9" alt="로그인">
🔐 로그인, 이렇게 시작해보세요!

처음이라 망설여지시나요? 걱정 마세요!

다양한 방법으로 쉽고 간편하게 시작할 수 있어요.

✨ 체험용 계정으로 시작하기

- 별도의 가입 없이 즉시 시작할 수 있어요
- 24시간 동안 자유롭게 이용해보세요(24시간 뒤 만료되요)
- 실제 거래소와 동일한 환경에서 연습할 수 있어요
- 만료 후에도 언제든 새로운 체험 계정으로 다시 시작할 수 있어요

🔄 소셜 로그인
- 구글 계정으로 시작하기
    - 구글 계정만 있으면 OK!
    - 클릭 한 번으로 빠른 시작
- 카카오 계정으로 시작하기
    - 카카오톡만 있다면 즉시 시작
    - 추가 정보 입력 없이 간편하게

처음이시라면 체험용 계정으로 시작해보는 건 어떠세요?

24시간 동안 부담 없이 투자 연습을 해보실 수 있답니다!
</details>
<details>
<summary><strong>📱 사이드 바</strong></summary>
<img src="https://github.com/user-attachments/assets/f817f3d9-e286-4d19-af5d-fef55de3e08f" alt="사이드 바 이미지">
📱 사이드바로 더 편리하게!
  
내 모든 투자 정보를 한눈에 확인하고, 관심있는 코인을 바로 찾아보세요.

📊 주요 기능
  
- 내 투자 현황
    - 로그인 후 이용 가능해요
    - 보유 중인 코인에 대한 현재 가격을 실시간으로 확인할 수 있어요!
      
- 관심 코인
    - 로그인 후 이용 가능해요
    - 관심있는 코인을 등록하고 쉽게 모니터링 할 수 있어요
      
- 최근 본 코인
    - 내가 확인했던 코인들을 자동으로 기록해요!
    - 클릭 한 번으로 간편하게 다시 조회 가능해요
      
- 실시간 급등 코인
    - 지금 가장 뜨거운 코인을 실시간으로 확인해요
    - 거래량 Top10 순위로 코인을 제공해요
    - 시장의 트렌드를 놓치지 마세요!
</details>
<details>
<summary><strong>🔍 검색 기능</strong></summary>
<img src="https://github.com/user-attachments/assets/d1e9a6da-96c3-461d-b1ba-492343ab188f" alt="검색기능 이미지">
  
🔍 원하는 코인을 더 쉽고 빠르게 찾아보세요!

검색창에서 코인 이름이나 코드를 입력하면 실시간으로 검색 결과가 나타나요
- 코인 이름으로 검색 (예: 비트코인, 이더리움)
- 심볼로 검색(예: BTC, ETH)
- 한글/영문 모두 가능해요

원하는 코인을 찾아보고, 바로 투자를 시작해보세요! 🚀
</details>



## 📈 비트코인 상세보기 페이지
> 실시간으로 코인의 흐름을 분석하고 거래할 수 있는 페이지입니다.<br>
> 한 화면에서 차트 분석부터 실제 거래까지, 모든 것을 한번에 처리할 수 있어요!

![chrome_i6MmWHhbsI](https://github.com/user-attachments/assets/a30531bc-12cf-407f-93b2-e1ee843e5e08)

<details>
<summary><strong>📈 차트 조회</strong></summary>
<img src="https://github.com/user-attachments/assets/407e7e57-a702-474d-8aa5-5604b326f01e" alt="차트 조회 이미지">

📈 비트코인의 흐름을 한눈에 파악할 수 있어요.

1분부터 1달, 1년까지 다양한 시간대 별 차트를 제공해드려요. 

무한 스크롤로 과거 데이터까지 자유롭게 확인하실 수 있답니다.

관심 있는 코인을 선택하고, 본격적인 차트 분석을 시작해보세요!

✨ 이런 기능들을 활용해보세요:
- 다양한 시간대별 차트 (1분/3분/5분/10분/15분/30분/60분/1일/1주일/1달/1년)
- 무한 스크롤로 과거 데이터 조회
- 실시간 가격 업데이트
</details>
<details>
<summary><strong>📗 호가창 조회</strong></summary>
<img src="https://github.com/user-attachments/assets/7fbb43a3-6a79-4e24-bb30-655479de05c5" alt="호가창 조회 이미지">

📊 실시간으로 움직이는 시장의 심장, 호가창을 만나보세요!

매수/매도 주문이 실시간으로 업데이트되어 시장의 움직임을 놓치지 않고 파악할 수 있어요. 호가창에서는 매도 호가는 빨간색, 매수 호가는 파란색으로 직관적으로 보여드려요. 

각 호가별 거래량도 함께 표시되어 있어 더욱 정확한 시장 분석이 가능하답니다!

✨ 호가창의 특징:
- 실시간 호가 업데이트
- 직관적인 매수/매도 색상 구분
- 호가별 거래량 정보
</details>
<details>
<summary><strong>💰 매수/매도 거래</strong></summary>
<img src="https://github.com/user-attachments/assets/32e3df35-3037-4449-b6e8-2009ad87f1a4" alt="매수/매도 거래 이미지">

💰 매수/매도 거래

원하는 가격과 수량으로 거래를 시작해보세요! 지정가 주문으로 원하는 가격에 주문할 수 있어요.

✨ 원하는 비율로 간단하게 투자할 수 있어요:
- 10% 버튼: 보유 자산의 10% 만큼 거래
- 25% 버튼: 보유 자산의 25% 만큼 거래
- 50% 버튼: 보유 자산의 50% 만큼 거래
- 100% 버튼: 보유 자산 전체 거래

💡 거래 시 이런 점들을 확인해주세요:

- 최소 주문 금액은 5,000원이에요
- 현재는 원화(KRW) 마켓만 지원해요 (BTC, USDT 거래는 준비 중!)

📌 주문이 체결되지 않을 때는?
- 매수 주문: 현재가보다 낮은 가격으로 주문하면 체결을 기다려야 해요
- 매도 주문: 현재가보다 높은 가격으로 주문하면 체결을 기다려야 해요
- 미체결 주문은 '미체결' 탭에서 확인할 수 있어요

🔍 실제 거래처럼 여러 번 나눠서 체결될 수 있어요:
- 실제 거래소의 매물대를 반영하여 거래가 진행돼요
- 다른 투자자의 매수/매도 주문과 만나야 체결되는 실제 거래 원리를 반영했어요
</details>
</details>

## 💰 내 계좌 페이지
> 나의 모든 투자 현황을 한눈에 확인하고 관리할 수 있는 페이지입니다.<br>
> 실시간 자산 현황부터 거래 내역까지, 투자에 필요한 모든 정보를 제공해드려요!

![chrome_2eyp9NM7mw](https://github.com/user-attachments/assets/1459bbba-5703-4b6c-9f31-9da39f68973a)
<details>
<summary><strong>📈 보유 자산</strong></summary>
<img src="https://github.com/user-attachments/assets/1459bbba-5703-4b6c-9f31-9da39f68973a" alt="보유 자산 이미지">

한눈에 보는 나의 투자 현황! 보유한 모든 코인 정보를 실시간으로 확인하세요

✨ 이런 정보들을 확인할 수 있어요

- 보유 코인 별 수량과 현재가
- 평가 금액과 매수 평균가
- 실시간 수익률 업데이트
- 코인 별 보유 비중을 한눈에 보는 도넛 차트

ℹ️ 보유 자산에 존재하는 용어가 어려우면 살펴봐요!

- 💵 보유 KRW & 주문 가능: 현재 사용 가능한 원화 잔액이에요
- 💰 총 보유 자산: 원화와 보유 코인을 모두 포함한 총 자산이에요
- 🛒 총 매수: 지금까지 코인을 구매하는데 사용한 총 금액이에요
- 📊 총 평가: 보유한 코인의 현재 가치예요
- 💳 주문 가능: 새로운 거래에 사용할 수 있는 KRW예요
- 📈 총 평가 손익: 투자 결과로 얻은 실제 수익/손실 금액이에요
- 📊 총 평가 수익률: 전체 투자의 수익률을 %로 보여드려요
</details>
<details>
<summary><strong>📝 거래내역</strong></summary>
<img src="https://github.com/user-attachments/assets/3d06a38d-76d8-4331-a8e5-ad118f82a89a" alt="거래내역 이미지">

나의 모든 투자 기록을 한눈에 확인하세요!

✨ 기간별로 쉽게 조회할 수 있어요:
- 1주일
- 1개월
- 3개월
- 6개월
- 전체 내역
  
💡 거래 유형도 선택할 수 있어요:
- 전체 거래
- 매수 내역만 보기
- 매도 내역만 보기
  
모든 거래 기록이 시간 순으로 정리되어 있어 나의 투자 히스토리를 쉽게 파악할 수 있어요. 각 거래별로 거래 시간, 코인명, 거래 가격, 수량 등 상세 정보를 확인할 수 있답니다!
</details>
<details>
<summary><strong>⏳ 미체결 내역</strong></summary>
<img src="https://github.com/user-attachments/assets/37529de0-6af1-4a30-9370-c38eadb5fc6e" alt="미체결 내역">

아직 체결되지 않은 주문을 확인하고 관리하세요!

✨ 이런 기능들을 활용할 수 있어요:

- 미체결된 매수/매도 주문 확인
- 주문 가격과 수량 조회
- 원하는 주문 즉시 취소
- 부분 체결 현황 확인

주문이 원하는대로 진행되지 않는다면, 언제든지 취소하고 새로운 가격에 재주문할 수 있어요! 시장 상황에 맞춰 유연하게 대응해보세요.

✔️ 주문 취소는 간단해요
취소하고 싶은 주문의 '주문 취소' 버튼을 클릭하면 즉시 취소됩니다!(코인 상세 페이지에서도 가능하답니다😆)
</details>
<details>
<summary><strong>🔄 계좌 초기화 기능</strong></summary>
<img src="https://github.com/user-attachments/assets/27de2315-660c-4e34-b665-4ae3aea37441" alt="계좌 초기화 기능">

거래를 새롭게 시작하고 싶으신가요? 계좌 초기화로 처음부터 다시 시작할 수 있어요!

⚠️ 초기화 시 이런 것들이 모두 리셋돼요:

- 보유 중인 모든 코인
- 계좌 잔액
- 전체 거래 내역
- 미체결 주문

💡 이런 분들에게 추천해요:

- 거래 연습을 처음부터 다시 하고 싶은 분
- 새로운 투자 전략을 시도해보고 싶은 분
- 잔액을 모두 소진한 분

⚠️ 주의하세요!

- 초기화 후에는 이전 데이터를 절대 복구할 수 없어요
- 신중하게 결정해주세요
- 초기화 전 한번 더 확인 창이 뜨니 실수로 초기화될 걱정은 없어요

✨ 새로운 시작을 원하시나요?

내 계좌 페이지에서 초기화 버튼을 눌러보세요!
</details>


## 🏆 모의 투자 랭킹 페이지
> 실력자들의 투자 현황을 확인하고 나의 순위도 체크해보세요!

![chrome_G89tyGQWrI](https://github.com/user-attachments/assets/398cce48-5f3a-47d0-8f64-a5d4a94924ae)

<details>
<summary><strong>모의 투자 랭킹 페이지 살펴보기</strong></summary>
✨ 이런 정보들을 확인할 수 있어요

- 전체 참여자 실시간 순위
- 수익률 랭킹
- 나의 현재 순위
- 각 투자자의 수익률과 자산 현황

📊 랭킹 상세 정보

- 사용자 이름
- 총 자산
- 투자 비율
- 총 손익
- 수익률

다른 투자자들과 실력을 겨루며 더 나은 투자자로 성장해보세요!
  </details>

# ⚙️ 기술 스택

<table>
  <th>구분</th>
  <th>기술 스택</th>
  <tr>
    <td align="center"><b>common</b></td>
    <td>
      <img src="https://img.shields.io/badge/Typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white" />
      <img src="https://img.shields.io/badge/ESLint-4B3263?style=flat&logo=eslint&logoColor=white" />
      <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=Prettier&logoColor=white" />
      <img src="https://img.shields.io/badge/YarnBerry-2C8EBB?style=flat&logo=Yarn&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>frontend</b></td>
    <td>
      <img src="https://img.shields.io/badge/React-%2320232a.svg?style=flat&logo=React&logoColor=%2361DAFB" />
      <img src="https://img.shields.io/badge/TailwindCss-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white" />      <img src="https://img.shields.io/badge/TradingView-131622.svg?style=flat&logo=TradingView&logoColor=white" />
      <img src="https://img.shields.io/badge/Chart.js-FF6384.svg?style=flat&logo=Chart.js&logoColor=white" />
      <img src="https://img.shields.io/badge/Tanstack Query-FF4154.svg?style=flat&logo=React Query&logoColor=white" />
      <img src="https://img.shields.io/badge/Zustand-000000?style=flat&logo=zustand&logoColor=white" />
      <img src="https://img.shields.io/badge/Lodash-3492FF.svg?style=flat&logo=Lodash&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>backend</b></td>
    <td>
      <img src="https://img.shields.io/badge/NestJS-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white" />
      <img src="https://img.shields.io/badge/TypeORM-fe0902.svg?style=flat&logo=typeorm&logoColor=white" />
      <img src="https://img.shields.io/badge/Passport-black.svg?style=flat&logo=passport&logoColor=35df79" />
      <img src="https://img.shields.io/badge/-Swagger-173647.svg?style=flat&logo=swagger" />
      <img src="https://img.shields.io/badge/MySQL-00758f.svg?style=flat&logo=mysql&logoColor=white" />
      <img src="https://img.shields.io/badge/Redis-%23DD0031.svg?style=flat&logo=redis&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>CI/CD</b></td>
    <td>
      <img src="https://img.shields.io/badge/Docker-1D63ED.svg?style=flat&logo=docker&logoColor=white" />
      <img src="https://img.shields.io/badge/GitHub%20Actions-%232671E5.svg?style=flat&logo=githubactions&logoColor=white" />
      <img src="https://img.shields.io/badge/NGINX-%23009639.svg?style=flat&logo=nginx&logoColor=white" />
      <img src="https://img.shields.io/badge/NAVER Cloud Platform-03C75A.svg?style=flat&logo=naver&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>others</b></td>
    <td>
      <img src="https://img.shields.io/badge/Notion-%23000000.svg?style=flat&logo=notion&logoColor=white" />
      <img src="https://img.shields.io/badge/Slack-4A154B?style=flat&logo=slack" />
      <img src="https://img.shields.io/badge/Excalidraw-6965DB?style=flat&logo=Excalidraw&logoColor=white" />
    </td>
  </tr>
</table>

# 🏛️ 시스템 아키텍처
<div align="center">
<img src="https://github.com/user-attachments/assets/5ab91b76-3e52-4c3f-ac76-400ad2efc3a1" width="800px" height="auto"/>
</div>





# 👨‍👩‍👧‍👧 팀원 소개

<table>
<tr>
<td align="center"> FE </td>
<td align="center"> FE </td>
<td align="center"> BE </td>
<td align="center"> BE </td>
</tr>
  <tr>
    <td align="center">
      <a href="https://github.com/junhee1203" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/147376710?v=4" alt="정준희 프로필"  width="200" height="200" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/qwer0114" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/112809788?v=4" alt="정승연 프로필"  width="200" height="200" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/SeongHyeon0409" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/31495131?v=4" alt="유성현 프로필"  width="200" height="200" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/SeungGwan123" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/123438749?v=4" alt="이승관 프로필"  width="200" height="200" />
      </a>
    </td>
    
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/junhee1203" target="_blank">
        J228 정준희
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/qwer0114" target="_blank">
       J224 정승연
      </a>
    </td> 
     <td align="center">
      <a href="https://github.com/SeongHyeon0409" target="_blank">
       J163 유성현
      </a>
       <td align="center">
      <a href="https://github.com/SeungGwan123" target="_blank">
        J186 이승관
      </a>
    </td>
  </tr>
</table>

