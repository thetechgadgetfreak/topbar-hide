import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Meta from 'gi://Meta';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class IntelligentTopBarExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._panelBox = Main.layoutManager.panelBox;
        this._panel = Main.panel;

        this._signals = [];
        this._monitorId = 0;
        this._stateHidden = false;

        this._connect(this._settings, 'changed', () => this._sync());
        this._connect(global.display, 'notify::focus-window', () => this._sync());
        this._connect(Main.overview, 'showing', () => this._sync());
        this._connect(Main.overview, 'hidden', () => this._sync());

        this._startPointerMonitor();
        this._sync();
    }

    disable() {
        if (this._monitorId) {
            GLib.source_remove(this._monitorId);
            this._monitorId = 0;
        }

        for (const [obj, id] of this._signals || []) {
            try {
                obj.disconnect(id);
            } catch (_) {
                // no-op
            }
        }
        this._signals = [];

        this._showImmediately();

        this._settings = null;
        this._panelBox = null;
        this._panel = null;
    }

    _connect(obj, signalName, callback) {
        const id = obj.connect(signalName, callback);
        this._signals.push([obj, id]);
    }

    _startPointerMonitor() {
        const intervalMs = Math.max(50, this._settings.get_int('pointer-poll-interval-ms'));
        this._monitorId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, intervalMs, () => {
            this._sync();
            return GLib.SOURCE_CONTINUE;
        });
    }

    _sync() {
        if (!this._panelBox || !this._panel)
            return;

        const hidden = this._shouldHide();
        const opacityVisible = this._settings.get_int('visible-opacity');
        const opacityHidden = this._settings.get_int('hidden-opacity');

        if (hidden) {
            this._animatePanel({
                opacity: opacityHidden,
                translationY: -this._panelBox.height,
            });
            this._stateHidden = true;
        } else {
            this._animatePanel({
                opacity: opacityVisible,
                translationY: 0,
            });
            this._stateHidden = false;
        }
    }

    _shouldHide() {
        if (!this._settings.get_boolean('intelligent-hide-enabled'))
            return false;

        if (Main.overview.visible)
            return false;

        const [, y] = global.get_pointer();
        const revealThreshold = Math.max(1, this._settings.get_int('reveal-edge-threshold-px'));

        if (y <= revealThreshold)
            return false;

        const focused = global.display.get_focus_window();
        if (!focused)
            return false;

        if (focused.get_window_type() !== Meta.WindowType.NORMAL)
            return false;

        return this._isWindowMaximized(focused);
    }

    _isWindowMaximized(win) {
        // GNOME/Mutter API compatibility:
        // - older builds expose get_maximized()
        // - newer builds expose maximized_horizontally/vertically flags
        if (typeof win.get_maximized === 'function')
            return win.get_maximized() !== Meta.MaximizeFlags.NONE;

        if (Boolean(win.maximized_horizontally && win.maximized_vertically))
            return true;

        // Fallback: treat a window as maximized when its frame matches
        // monitor work-area bounds (within a tiny tolerance).
        try {
            const monitor = win.get_monitor();
            const workspace = global.workspace_manager.get_active_workspace();
            const workArea = workspace.get_work_area_for_monitor(monitor);
            const rect = win.get_frame_rect();
            const tol = 2;

            const xMatch = Math.abs(rect.x - workArea.x) <= tol;
            const yMatch = Math.abs(rect.y - workArea.y) <= tol;
            const wMatch = Math.abs(rect.width - workArea.width) <= tol;
            const hMatch = Math.abs(rect.height - workArea.height) <= tol;

            return xMatch && yMatch && wMatch && hMatch;
        } catch (_) {
            return false;
        }
    }

    _animatePanel({opacity, translationY}) {
        const duration = Math.max(0, this._settings.get_int('animation-duration-ms'));

        this._panelBox.remove_all_transitions();
        this._panelBox.ease({
            opacity,
            translation_y: translationY,
            duration,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });

        // Keep actual panel content opacity in sync in case other themes
        // style the box and panel differently.
        this._panel.opacity = opacity;
    }

    _showImmediately() {
        if (!this._panelBox || !this._panel)
            return;

        this._panelBox.remove_all_transitions();
        this._panelBox.opacity = 255;
        this._panelBox.translation_y = 0;
        this._panel.opacity = 255;
    }
}
