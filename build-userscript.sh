#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
EXTENSION_DIR="$ROOT_DIR/extension"
EXTENSION_SHARED="$ROOT_DIR/extension/shared/download-utils.js"
WELCOME_HTML="$ROOT_DIR/extension/shared/welcome.html"
CHROME_MANIFEST_TEMPLATE="$EXTENSION_DIR/manifest.chrome.json"
FIREFOX_MANIFEST_TEMPLATE="$EXTENSION_DIR/manifest.firefox.json"
EXTENSION_MANIFEST="$EXTENSION_DIR/manifest.json"
TEMPLATE="$ROOT_DIR/userscript/qishui-download.user.template.js"
OUTPUT="$ROOT_DIR/userscript/qishui-download.user.js"
DIST_DIR="$ROOT_DIR/dist"
VERSION=$(date +%Y.%-m%d.1%H%M)
CHROME_EXTENSION_ZIP="$DIST_DIR/soda-music-download-chrome-v$VERSION.zip"
CHROME_EXTENSION_DIR="$DIST_DIR/chrome-extension"
FIREFOX_EXTENSION_DIR="$DIST_DIR/firefox-extension"
FIREFOX_EXTENSION_ZIP="$DIST_DIR/soda-music-download-firefox-v$VERSION.zip"

write_manifest() {
  sed "s|\"version\"[[:space:]]*:[[:space:]]*\"[^\"]*\"|\"version\": \"$VERSION\"|" \
    "$1" > "$2"
}

cleanup_manifest() {
  rm -f "$EXTENSION_MANIFEST"
}

trap cleanup_manifest EXIT

VERSION="$VERSION" EXTENSION_SHARED="$EXTENSION_SHARED" WELCOME_HTML="$WELCOME_HTML" perl -0pe '
  BEGIN {
    local $/;
    open my $utils_fh, "<", $ENV{EXTENSION_SHARED} or die $!;
    $utils = <$utils_fh>;
    open my $welcome_fh, "<", $ENV{WELCOME_HTML} or die $!;
    $welcome = <$welcome_fh>;
    $welcome =~ s/\\/\\\\/g;
    $welcome =~ s/`/\\`/g;
    $welcome = "`$welcome`";
  }
  s|^// \@version\s+.*$|"// \@version      " . $ENV{VERSION}|me;
  s/^  __DOWNLOAD_UTILS__$/$utils/m;
  s/__INSTALL_NOTICE_HTML__/$welcome/g;
' "$TEMPLATE" > "$OUTPUT"

printf "Generated %s\n" "$OUTPUT"
printf "Version %s\n" "$VERSION"
printf "Used shared code from %s\n" "$EXTENSION_SHARED"

mkdir -p "$DIST_DIR"

rm -rf "$CHROME_EXTENSION_DIR"
mkdir -p "$CHROME_EXTENSION_DIR"
cp -R "$EXTENSION_DIR/." "$CHROME_EXTENSION_DIR/"
write_manifest "$CHROME_MANIFEST_TEMPLATE" "$EXTENSION_MANIFEST"
write_manifest "$CHROME_MANIFEST_TEMPLATE" "$CHROME_EXTENSION_DIR/manifest.json"
rm -f "$CHROME_EXTENSION_DIR/manifest.chrome.json" "$CHROME_EXTENSION_DIR/manifest.firefox.json"

(
  cd "$EXTENSION_DIR"
  zip -qr "$CHROME_EXTENSION_ZIP" . \
    -x manifest.chrome.json \
    -x manifest.firefox.json
)
cleanup_manifest

rm -rf "$FIREFOX_EXTENSION_DIR"
mkdir -p "$FIREFOX_EXTENSION_DIR"
cp -R "$EXTENSION_DIR/." "$FIREFOX_EXTENSION_DIR/"
write_manifest "$FIREFOX_MANIFEST_TEMPLATE" "$FIREFOX_EXTENSION_DIR/manifest.json"
rm -f "$FIREFOX_EXTENSION_DIR/manifest.chrome.json" "$FIREFOX_EXTENSION_DIR/manifest.firefox.json"

(
  cd "$FIREFOX_EXTENSION_DIR"
  zip -qr "$FIREFOX_EXTENSION_ZIP" .
)

printf "Packaged %s\n" "$CHROME_EXTENSION_ZIP"
printf "Packaged %s\n" "$FIREFOX_EXTENSION_ZIP"
printf "Generated Chrome temporary extension %s\n" "$CHROME_EXTENSION_DIR"
printf "Generated Firefox temporary extension %s\n" "$FIREFOX_EXTENSION_DIR"
