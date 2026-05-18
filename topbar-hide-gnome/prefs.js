import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class IntelligentTopBarPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Intelligent Top Bar',
            icon_name: 'preferences-system-symbolic',
        });

        const behavior = new Adw.PreferencesGroup({title: 'Behavior'});
        behavior.add(this._createSwitchRow(settings,
            'intelligent-hide-enabled',
            'Enable Intelligent Hide',
            'Auto-hide top bar based on focus and pointer position.'));
        behavior.add(this._createSwitchRow(settings,
            'hide-when-maximized-only',
            'Hide On Maximized Window',
            'Hide the top bar when the focused app window is maximized.'));
        behavior.add(this._createSpinRow(settings,
            'reveal-edge-threshold-px',
            'Reveal Edge Threshold (px)',
            1, 40, 1));

        const appearance = new Adw.PreferencesGroup({title: 'Appearance'});
        appearance.add(this._createSpinRow(settings,
            'visible-opacity',
            'Visible Opacity (0-255)',
            0, 255, 1));
        appearance.add(this._createSpinRow(settings,
            'hidden-opacity',
            'Hidden Opacity (0-255)',
            0, 255, 1));

        const animation = new Adw.PreferencesGroup({title: 'Animation'});
        animation.add(this._createSpinRow(settings,
            'animation-duration-ms',
            'Animation Duration (ms)',
            0, 1000, 10));
        animation.add(this._createSpinRow(settings,
            'pointer-poll-interval-ms',
            'Pointer Poll Interval (ms)',
            50, 1000, 10));

        page.add(behavior);
        page.add(appearance);
        page.add(animation);
        window.add(page);
    }

    _createSwitchRow(settings, key, title, subtitle) {
        const row = new Adw.SwitchRow({title, subtitle});
        settings.bind(key, row, 'active', Gio.SettingsBindFlags.DEFAULT);
        return row;
    }

    _createSpinRow(settings, key, title, lower, upper, step) {
        const row = new Adw.ActionRow({title});
        const adjustment = new Gtk.Adjustment({
            lower,
            upper,
            step_increment: step,
            page_increment: step * 10,
            value: settings.get_int(key),
        });
        const spin = new Gtk.SpinButton({adjustment, digits: 0, numeric: true});
        spin.connect('value-changed', () => settings.set_int(key, spin.get_value_as_int()));

        settings.connect(`changed::${key}`, () => {
            const v = settings.get_int(key);
            if (spin.get_value_as_int() !== v)
                spin.set_value(v);
        });

        row.add_suffix(spin);
        row.activatable_widget = spin;
        return row;
    }
}
