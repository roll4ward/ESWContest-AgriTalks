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

