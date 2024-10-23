# 1. 개발 환경 설정
## 1. webOS OSE 소스 코드 다운로드
webOS OSE 소스 코드 클론
```bash
git clone https://github.com/webosose/build-webos.git
cd build-webos
```

## 2. Yocto 빌드 환경 설정
Yocto의 빌드 환경을 초기화
```bash
source oe-init-build-env
```

# 2. wpantund Yocto 레시피 작성
`wpantund`를 빌드하기 위해 Yocto 레시피를 작성

## 1. 커스텀 메타 레이어 생성

`wpantund`에 대한 커스텀 meta-layer를 생성:

```bash
bitbake-layers create-layer meta-wpantund
```
\
생성된 layer 디렉토리로 이동
```bash
cd meta-wpantund
```
## 2. wpantund 레시피 작성

레시피 파일을 적절한 경로에 생성
```bash
mkdir -p recipes-connectivity/wpantund
cd recipes-connectivity/wpantund
touch wpantund_%.bb
```

`wpantund_%.bb` 파일 작성
```bash
SUMMARY = "NCP to host-side translator for Thread"
DESCRIPTION = "wpantund is a user-space network interface driver/daemon that provides a network interface to a Network Co-Processor (NCP) that speaks the Thread protocol."
LICENSE = "Apache-2.0"
LIC_FILES_CHKSUM = "file://LICENSE;md5=7f2a12e20b4b9ad40ab73c23812e324a"

SRC_URI = "git://github.com/openthread/wpantund.git;branch=master"
SRCREV = "d75d233973fbbdfbd7f3bb373cc59a8cb1c68e4b"

DEPENDS = "autoconf automake libtool"

S = "${WORKDIR}/git"

inherit autotools

do_compile() {
    oe_runmake
}

do_install() {
    install -d ${D}${sbindir}
    install -m 0755 wpantund ${D}${sbindir}/wpantund
}
```

## 3. 레이어 추가
Yocto 빌드 시스템에 새로운 레이어를 추가
```bash
bitbake-layers add-layer ../meta-wpantund
```

# 3. webOS OSE 이미지에 wpantund 포함
## 1. local.conf 파일 수정
`conf/local.conf` 파일을 열어 `wpantund` 패키지가 webOS 이미지에 포함되도록 설정
```bash
nano conf/local.conf
```
파일에 다음 줄을 추가:
```bash
IMAGE_INSTALL:append = " wpantund"
```

## 2. bblayers.conf 파일 수정
`conf/bblayers.conf` 파일을 열어 `wpantund` 패키지가 webOS 이미지에 포함되도록 설정
```bash
nano conf/bblayers.conf
```
파일에 다음 내용을 적절히 추가:
```bash
...
META_WPANTUND_LAYER ?= "${TOPDIR}/meta-wpantund"

BBLAYERS ?= " \
    기존과 동일...
    ${META_WPANTUND_LAYER} \
"
...
BBFILE_PRIORITY_wpantund-layer:forcevariable = "6"
```

## 3. webOS 이미지 빌드
전체 webOS OSE 이미지를 빌드
```bash
bitbake webos-image
```