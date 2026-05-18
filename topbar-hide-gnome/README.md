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

## Notes

This extension intentionally supports maximize-only hide behavior.
