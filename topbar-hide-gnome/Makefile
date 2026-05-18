UUID=topbar-hide@thetechgadgetfreak
DIST=dist
ZIP=$(DIST)/topbar-hide-gnome_5.x-v1.0.shell-extension.zip

.PHONY: validate pack clean

validate:
	glib-compile-schemas schemas

pack: validate
	mkdir -p $(DIST)
	gnome-extensions pack --force \
		--extra-source=prefs.js \
		--extra-source=schemas/org.gnome.shell.extensions.topbar-hide.gschema.xml
	mv -f $(UUID).shell-extension.zip $(ZIP)

clean:
	rm -rf $(DIST)
