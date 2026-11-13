"use client";

export function CookiePreferencesButton() {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("openCookiePreferences"))}
            className="text-xs text-surface-variant hover:text-white underline underline-offset-2 transition-colors"
        >
            Cookie Preferences
        </button>
    );
}
