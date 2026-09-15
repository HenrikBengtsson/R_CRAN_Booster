spelling:
	Rscript -e "spelling::spell_check_files('NEWS.md', ignore=readLines('WORDLIST'))"

build: spelling
	npx --yes web-ext build --overwrite-dest

lint: build
	npx --yes addons-linter web-ext-artifacts/*.zip

# Run the extension in the local Firefox installation.  This launches a
# separate Firefox instance on a temporary profile, with the extension
# installed temporarily, and reinstalls it whenever a file here changes.
# It opens a CRAN package page, which can be set via 'START_URL', e.g.
#
#  $ make run START_URL=https://cran.r-project.org/package=future
#
# Alternatively, install it by hand in an already running Firefox: go to
# 'about:debugging#/runtime/this-firefox', click 'Load Temporary Add-on...',
# and select this folder's 'manifest.json'.  Note that a temporarily
# installed extension is uninstalled when Firefox terminates.
#
# Note: A Firefox installed as a Snap, e.g. on Ubuntu, has its own,
# private '/tmp', so it cannot load the temporary profile that 'web-ext'
# creates there.  It fails with "Your Firefox profile cannot be loaded.
# It may be missing or inaccessible."  To work around this, we create the
# temporary profile below the home directory instead, which the Snap can
# access.  It has to be a non-hidden folder; the Snap cannot read folders
# with a name that starts with a period.
WEB_EXT_TMPDIR ?= $(HOME)/web-ext-tmp
START_URL ?= https://cran.r-project.org/package=KernSmooth

run:
	mkdir -p "$(WEB_EXT_TMPDIR)"
	TMPDIR="$(WEB_EXT_TMPDIR)" npx --yes web-ext run --start-url "$(START_URL)"

# Run the extension in Firefox for Android on a USB-attached device.
#
# One-off setup:
#  1. Install the Android platform tools, so that 'adb' is on the PATH.
#  2. On the device, enable 'USB debugging' under Developer options, and
#     'Remote debugging via USB' under Firefox's Settings.
#  3. Attach the device over USB and approve the debugging prompt.
#
# Then:
#  $ make adb-devices                 # list attached devices
#  $ make adb-firefox ADB_DEVICE=<id> # list Firefox editions on device <id>
#  $ make run-android ADB_DEVICE=<id> # install and run on device <id>
#
# Set FIREFOX_APK to the edition reported by 'make adb-firefox', e.g.
# org.mozilla.firefox_beta (Beta) or org.mozilla.fenix (Nightly).
ADB_DEVICE ?=
FIREFOX_APK ?= org.mozilla.firefox

adb-devices:
	adb devices -l

require-adb-device:
	@if [ -z "$(ADB_DEVICE)" ]; then \
	  echo "ERROR: ADB_DEVICE is not set."; \
	  echo "Usage: make <target> ADB_DEVICE=<id>   ('make adb-devices' lists them)"; \
	  exit 1; \
	fi

adb-firefox: require-adb-device
	adb -s "$(ADB_DEVICE)" shell pm list packages | grep -iE "mozilla|firefox" \
	  || echo "(no Mozilla packages installed on $(ADB_DEVICE))"

run-android: require-adb-device
	npx --yes web-ext run --target firefox-android \
	  --adb-device "$(ADB_DEVICE)" --firefox-apk "$(FIREFOX_APK)"

Rlogo.svg:
	wget https://www.r-project.org/logo/Rlogo.svg

Rlogo_724x724.png: Rlogo.svg
	convert "$<" -background white -gravity center -extent 724x724 "$@"
	identify "$@" 

Rlogo_128x128.png: Rlogo_724x724.png
	convert "$<" -resize 128x128 "$@"
	identify "$@" 

Rlogo_48x48.png: Rlogo_724x724.png
	convert "$<" -resize 48x48 "$@"
	identify "$@" 

Rlogo_16x16.png: Rlogo_724x724.png
	convert "$<" -resize 16x16 "$@"
	identify "$@" 

r-logos: Rlogo_16x16.png Rlogo_48x48.png Rlogo_128x128.png
