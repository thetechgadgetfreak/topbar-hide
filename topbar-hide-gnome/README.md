# Topbar Hide GNOME

A GNOME Shell extension that auto-hides the top bar only when the focused
window is maximized, with adjustable opacity and animation settings.

## Maintainer

- Creator: TheTechGadgetFreak
- URL: https://github.com/thetechgadgetfreak

## Compatibility

- GNOME Shell: 50 / 50.1
- Ubuntu: 26.04 LTS

## Repository Layout

- `metadata.json`
- `extension.js`
- `prefs.js`
- `schemas/org.gnome.shell.extensions.topbar-hide.gschema.xml`
- `.github/workflows/ci.yml`

## Local Install (Developer)

```bash
UUID="topbar-hide@thetechgadgetfreak"
EXT_DIR="$HOME/.local/share/gnome-shell/extensions/$UUID"
mkdir -p "$EXT_DIR"
cp -r . "$EXT_DIR"
glib-compile-schemas "$EXT_DIR/schemas"
gnome-extensions enable "$UUID"
```

Log out/in if the shell does not reload extension metadata immediately.

## Build Install ZIP

```bash
make pack
```

Output:

- `dist/topbar-hide-gnome_5.x-v1.0.shell-extension.zip`


## Install From GitHub Release

1. Open the latest release page:
   - https://github.com/thetechgadgetfreak/topbar-hide/releases/latest
2. Download the `.shell-extension.zip` asset.
3. Open Extension Manager.
4. Use “Install from file” and select the downloaded ZIP.
5. Enable the extension:
   - `topbar-hide@thetechgadgetfreak`

If the extension does not appear immediately, log out and log back in once.

## Notes

This extension intentionally supports maximize-only hide behavior.
