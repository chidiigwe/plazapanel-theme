#!/usr/bin/env bash
set -Eeuo pipefail

ISP_ROOT="${ISP_ROOT:-/usr/local/ispconfig}"
TARGET="$ISP_ROOT/interface/web/themes/plazapanel"

echo "======================================"
echo " PlazaPanel Theme Uninstaller"
echo "======================================"

if [[ "$EUID" -ne 0 ]]; then
    echo "ERROR: Run as root."
    exit 1
fi

if [[ ! -d "$TARGET" ||
      -L "$TARGET" ||
      ! -f "$TARGET/.plazapanel-installed" ]]; then
    echo "ERROR: No package-managed PlazaPanel theme found."
    exit 1
fi

echo "Before removal, switch all users to the default theme."
echo "This operation will remove the installed theme files."
echo

read -r -p "Type REMOVE to continue: " CONFIRM

if [[ "$CONFIRM" != "REMOVE" ]]; then
    echo "Cancelled."
    exit 0
fi

BACKUP="/root/plazapanel-theme-backup-$(date -u +%Y%m%d-%H%M%S).tar.gz"

tar -czf "$BACKUP" \
    -C "$ISP_ROOT/interface/web/themes" \
    plazapanel

rm -rf -- "$TARGET"

echo "Theme removed."
echo "Backup saved: $BACKUP"
echo "ISPConfig core files were not modified."
