

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

# 목차
- [프로젝트 소개](#프로젝트-소개)
- [서비스 개요](#서비스-개요)
- [주요 기능](#주요-기능)
- [개발 일정](#개발-일정)
- [기술 스택](#기술-스택)
- [팀 소개](#팀-소개)

---

# 프로젝트 소개

<!-- 2x2 그리드로 이미지 추가 -->
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
   <img src="https://github.com/user-attachments/assets/967ec898-0610-4150-8ea7-35010ed90e0b" alt="image1" style="width:100%">
   <img src="https://github.com/user-attachments/assets/8ef329b7-83bf-4b86-9006-40651feb4ab8" alt="image2" style="width:100%">
   <img src="https://github.com/user-attachments/assets/9163539b-26bd-459f-b31d-f4b09d6ee481" alt="image3" style="width:100%">
   <img src="https://github.com/user-attachments/assets/dc93bc3d-d5de-4e8d-840d-85e11fcd1197" alt="image4" style="width:100%">
</div>

농담(AgriTalk) 프로젝트는 2024 임베디드 소프트웨어 경진대회의 일환으로 개발되었습니다. 
이 프로젝트는 webOS를 기반으로 한 스마트 농업 시스템을 구축하는 것을 목표로 하고 있습니다. 
시스템은 webOS, GPT-4o, OpenThread 프로토콜 및 다양한 JS 서비스를 통합하여 농부들이 원격으로 농업 장비를 모니터링하고 제어할 수 있도록 지원합니다.
AI와 고급 통신 프로토콜을 활용하여 사용자와 농업 장비 간의 실시간 상호작용을 가능하게 하며, 이를 통해 자동화와 운영 효율성을 크게 향상시킵니다.

---

## 서비스 개요
이 프로젝트는 농부들이 농업 장비를 원격으로 관리할 수 있도록 돕는 인터랙티브 서비스를 제공합니다. 시스템은 음성 상호작용, GPT-4o 기반 AI 프롬프트, OpenThread를 통한 센서 및 액추에이터와의 통합 기능을 포함하고 있습니다. webOS 기반의 메인 인터페이스는 사용자가 React로 개발된 애플리케이션을 통해 농장을 쉽게 관리할 수 있도록 하며, 주요 기능은 다음과 같습니다:

- **AI 서비스**: GPT-4o를 통해 지능형 프롬프트와 응답을 제공하여 음성으로 농업 작업을 수행할 수 있습니다.
- **Thread 프로토콜 통합**: 실시간 데이터 모니터링 및 장비 제어를 위해 농업 센서 및 액추에이터와 연결됩니다.
- **JS 서비스**: aitalk, Infomanage, CoAP 서비스 등 다양한 JavaScript 기반 서비스와 통합하여 더욱 효율적인 농장 운영을 지원합니다.

---


## 주요 기능
- **음성 인식 및 제어**: 음성을 통해 농업 장비를 제어하고 다양한 작업을 수행할 수 있습니다.
- **실시간 데이터 모니터링**: 센서를 통해 실시간으로 농업 데이터를 모니터링하고 분석합니다.
- **스마트 농업 자동화**: AI를 통해 농업 장비를 자동으로 제어하고 최적화된 작업을 수행합니다.

---
## 개발 일정

![image](https://github.com/user-attachments/assets/0ae64a3a-19fa-44d0-9dff-c8fe0553b0f1)


---

# 기술 스택
- **언어**: JavaScript, HTML, CSS , Python, C++
- **프레임워크**: webOS, React.js
- **라이브러리**: Node.js, OpenAI API
- **도구**: Git, DB8


# 팀 소개

| 구분   | 성명    | 소속        | 역                    |
|--------|---------|-------------|-----------------------------|
| 팀장   | 이준희  | 한양대학교  | Firmware                    |
| 팀원   | 김준호  | 상명대학교  | AI Backend                  |
| 팀원   | 황건하  | 상명대학교  | Thread Protocol Development |
| 팀원   | 유승혜  | 브로제이    | Web App Development         |
| 팀원   | 이수민  | 인하대학교  | Web App Development         |

