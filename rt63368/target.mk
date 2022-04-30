#
# Copyright (C) 2011 OpenWrt.org
#

SUBTARGET:=rt63368
BOARDNAME:=R63368 based boards
FEATURES+=usb pci small_flash
CPU_TYPE:=34kc

DEFAULT_PACKAGES += kmod-rt2800-pci kmod-rt2800-soc wpad-basic-wolfssl swconfig

define Target/Description
	Build firmware images for Ralink RT3662/RT3883 based boards.
endef

