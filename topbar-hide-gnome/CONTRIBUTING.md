# Contributing

## Development Rules

1. Keep UUID stable unless intentionally forking release identity.
2. Update `metadata.json` version per release.
3. Rebuild schema and package before submitting PRs.
4. Test on GNOME Shell 50+ before merge.

## Validation

```bash
make validate
make pack
```
