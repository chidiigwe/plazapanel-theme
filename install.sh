#!/usr/bin/env bash
set -Eeuo pipefail

ISP_ROOT="${ISP_ROOT:-/usr/local/ispconfig}"
THEMES="$ISP_ROOT/interface/web/themes"
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/theme"
TARGET="$THEMES/plazapanel"
DEFAULT="$THEMES/default"

echo "======================================"
echo " PlazaPanel Theme Installer"
echo "======================================"

if [[ "$EUID" -ne 0 ]]; then
    echo "ERROR: Run as root."
    exit 1
fi

if [[ ! -d "$DEFAULT" ||
      ! -f "$ISP_ROOT/interface/lib/config.inc.php" ]]; then
    echo "ERROR: ISPConfig installation not found."
    exit 1
fi

if [[ ! -f "$SOURCE/templates/main.tpl.htm" ||
      ! -f "$SOURCE/ispconfig_version" ]]; then
    echo "ERROR: Incomplete PlazaPanel theme package."
    exit 1
fi

if [[ -e "$TARGET" || -L "$TARGET" ]]; then
    echo "ERROR: PlazaPanel theme already exists."
    echo "No files were replaced."
    exit 1
fi

if find "$SOURCE" -type l -print -quit | grep -q .; then
    echo "ERROR: Symbolic links are not supported in the package."
    exit 1
fi

SOURCE_VERSION="$(tr -d '[:space:]' < "$SOURCE/ispconfig_version")"

if [[ -f "$DEFAULT/ispconfig_version" ]]; then
    TARGET_VERSION="$(tr -d '[:space:]' < "$DEFAULT/ispconfig_version")"

    if [[ "$SOURCE_VERSION" != "$TARGET_VERSION" ]]; then
        echo "ERROR: ISPConfig theme version mismatch."
        echo "Package: $SOURCE_VERSION"
        echo "Installed: $TARGET_VERSION"
        echo "Review theme compatibility before installation."
        exit 1
    fi
fi

OWNER="$(stat -c '%u:%g' "$DEFAULT")"

TMP="$(mktemp -d "$THEMES/.plazapanel-install.XXXXXXXX")"

cleanup() {
    if [[ -n "${TMP:-}" && -d "$TMP" ]]; then
        rm -rf -- "$TMP"
    fi
}
trap cleanup EXIT

cp -a "$SOURCE/." "$TMP/"

cat > "$TMP/.plazapanel-installed" <<EOF
Package: plazapanel-theme
Theme-Version: $SOURCE_VERSION
Installed: $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

chown -R "$OWNER" "$TMP"

find "$TMP" -type d -exec chmod 755 {} +
find "$TMP" -type f -exec chmod 644 {} +

mv -T "$TMP" "$TARGET"
TMP=""

echo
echo "SUCCESS: PlazaPanel theme installed."
echo "Location: $TARGET"
echo
echo "The existing ISPConfig theme has not been changed."
echo "Select PlazaPanel from the ISPConfig Design settings."
