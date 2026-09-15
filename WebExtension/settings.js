/**
 * R CRAN Booster settings
 *
 * Injects a settings icon in the upper, right corner of the CRAN package
 * page.  Clicking it opens a popup, where one can control whether the
 * page should be enhanced at all, whether the URL bar should show the
 * canonical package URL, whether long reverse-dependency lists should
 * be collapsed, and which color mode ('system', 'light', or 'dark') to
 * use.  The color mode applies also when not enhancing.
 *
 * The settings are stored with the extension, i.e. they apply to all
 * CRAN package pages, also on other CRAN mirrors.  Because reading the
 * extension storage is asynchronous, the settings are also mirrored to
 * the page-local 'localStorage', which can be read synchronously.  That
 * allows us to apply them before the page is rendered, which avoids a
 * flash of the previous settings.
 *
 * This script runs before 'content-script.js', which asks
 * 'rcb_on_settings()' whether it may inject anything at all.
 */

var RCB_DEFAULTS = {
    theme: "system",   /* 'system', 'light', or 'dark' */
    enabled: true,     /* should CRAN pages be enhanced? */
    canonical: false,  /* show the canonical URL in the URL bar? */
    collapse: true,    /* collapse long reverse-dependency lists? */
    github: false      /* show badges for the GitHub repository? */
};
var RCB_THEMES = ["system", "light", "dark"];
var RCB_CACHE_PREFIX = "R_CRAN_Booster.";

/* The settings, once known, and the callbacks waiting for them */
var rcb_settings = null;
var rcb_settings_queue = [];


function rcb_valid(key, value) {
    if (key === "theme") {
        if (RCB_THEMES.indexOf(value) < 0) return RCB_DEFAULTS.theme;
        return value;
    }
    if (typeof RCB_DEFAULTS[key] === "boolean") {
        if (value === true || value === "true") return true;
        if (value === false || value === "false") return false;
        return RCB_DEFAULTS[key];
    }
    return value;
}

/* The extension storage, if available, otherwise null */
function rcb_storage() {
    /* Note: Firefox supports the callback-based 'chrome.*' API too */
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        return chrome.storage.local;
    }
    return null;
}

function rcb_cached_settings() {
    var settings = {};
    for (var key in RCB_DEFAULTS) {
        var value = null;
        try {
            value = window.localStorage.getItem(RCB_CACHE_PREFIX + key);
        } catch (error) {
            /* 'localStorage' may be disabled; ignore */
        }
        settings[key] = rcb_valid(key, value);
    }
    return settings;
}

function rcb_cache_setting(key, value) {
    try {
        window.localStorage.setItem(RCB_CACHE_PREFIX + key, String(value));
    } catch (error) {
        /* 'localStorage' may be disabled; ignore */
    }
}

function rcb_save_setting(key, value) {
    rcb_cache_setting(key, value);
    var storage = rcb_storage();
    if (storage === null) return;
    var values = {};
    values[key] = value;
    storage.set(values);
}

function rcb_resolve_settings(settings) {
    if (rcb_settings !== null) return;
    rcb_settings = settings;
    rcb_apply_settings(settings);
    while (rcb_settings_queue.length > 0) {
        (rcb_settings_queue.shift())(settings);
    }
}

function rcb_load_settings() {
    var storage = rcb_storage();
    if (storage === null) {
        rcb_resolve_settings(rcb_cached_settings());
        return;
    }
    storage.get(RCB_DEFAULTS, function(items) {
        var settings = {};
        for (var key in RCB_DEFAULTS) {
            settings[key] = rcb_valid(key, items ? items[key] : null);
            rcb_cache_setting(key, settings[key]);
        }
        rcb_resolve_settings(settings);
    });

    /* Fall back on the cached settings, if the storage never answers,
       e.g. because the extension was reloaded while this page was open */
    window.setTimeout(function() {
        rcb_resolve_settings(rcb_cached_settings());
    }, 2000);
}

/* Call 'callback(settings)' as soon as the settings are known */
function rcb_on_settings(callback) {
    if (rcb_settings !== null) {
        callback(rcb_settings);
    } else {
        rcb_settings_queue.push(callback);
    }
}

/**
 * Record the color mode on the <html> element, where the style sheet
 * picks it up.  Mode 'system' means follow the operating system.  The
 * color mode applies also when the injections are disabled, so that
 * CRAN pages stay in dark mode.
 */
function rcb_apply_settings(settings) {
    var root = document.documentElement;
    if (settings.theme === "system") {
        root.removeAttribute("data-rcb-theme");
    } else {
        root.setAttribute("data-rcb-theme", settings.theme);
    }
}

/* Injections cannot be undone, so the page has to be reloaded */
function rcb_reload() {
    window.location.reload();
}


function rcb_create_gear_icon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    /* Gear teeth */
    var angles = [0, 45, 90, 135];
    for (var i = 0; i < angles.length; i++) {
        var tooth = document.createElementNS(ns, "rect");
        tooth.setAttribute("x", "10.4");
        tooth.setAttribute("y", "1.5");
        tooth.setAttribute("width", "3.2");
        tooth.setAttribute("height", "21");
        tooth.setAttribute("rx", "1");
        tooth.setAttribute("transform", "rotate(" + angles[i] + " 12 12)");
        tooth.setAttribute("class", "rcb-gear");
        svg.appendChild(tooth);
    }

    /* Gear body */
    var body = document.createElementNS(ns, "circle");
    body.setAttribute("cx", "12");
    body.setAttribute("cy", "12");
    body.setAttribute("r", "8");
    body.setAttribute("class", "rcb-gear");
    svg.appendChild(body);

    /* Gear hole */
    var hole = document.createElementNS(ns, "circle");
    hole.setAttribute("cx", "12");
    hole.setAttribute("cy", "12");
    hole.setAttribute("r", "3.2");
    hole.setAttribute("class", "rcb-gear-hole");
    svg.appendChild(hole);

    return svg;
}

function rcb_create_switch(key, label, title, checked) {
    var option = document.createElement("label");
    option.className = "rcb-option";
    option.title = title;
    var input = document.createElement("input");
    input.type = "checkbox";
    input.name = "rcb-" + key;
    input.checked = checked;
    input.onchange = function() {
        rcb_save_setting(key, input.checked);
        /* Without extension storage, there is no change event to react to */
        if (rcb_storage() === null) rcb_reload();
    };
    option.appendChild(input);
    option.appendChild(document.createTextNode(" " + label));
    return option;
}

function rcb_create_theme_option(theme, label, checked) {
    var option = document.createElement("label");
    option.className = "rcb-option";
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "rcb-theme";
    input.value = theme;
    input.checked = checked;
    input.onchange = function() {
        if (!input.checked) return;
        rcb_settings.theme = theme;
        rcb_apply_settings(rcb_settings);
        rcb_save_setting("theme", theme);
    };
    option.appendChild(input);
    option.appendChild(document.createTextNode(" " + label));
    return option;
}

function rcb_inject_settings(settings) {
    var container = document.createElement("div");
    container.id = "rcb-settings";

    var toggle = document.createElement("button");
    toggle.id = "rcb-settings-toggle";
    toggle.type = "button";
    toggle.title = "R CRAN Booster settings";
    toggle.setAttribute("aria-label", "R CRAN Booster settings");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "rcb-settings-panel");
    toggle.appendChild(rcb_create_gear_icon());
    container.appendChild(toggle);

    var panel = document.createElement("div");
    panel.id = "rcb-settings-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "R CRAN Booster settings");
    panel.hidden = true;
    container.appendChild(panel);

    var title = document.createElement("div");
    title.className = "rcb-title";
    title.innerText = "R CRAN Booster";
    panel.appendChild(title);

    panel.appendChild(rcb_create_switch(
        "enabled", "Enhance CRAN pages",
        "Inject extra information and styling into CRAN package pages",
        settings.enabled));
    panel.appendChild(rcb_create_switch(
        "canonical", "Use canonical URLs",
        "Show the short, canonical package URL in the URL bar, e.g. " +
        "'https://cran.r-project.org/package=KernSmooth', and link to " +
        "Bioconductor packages by their canonical URL",
        settings.canonical));
    panel.appendChild(rcb_create_switch(
        "collapse", "Collapse long lists",
        "Show only the first few entries of a long reverse-dependency " +
        "list, with a toggle for showing all of them",
        settings.collapse));
    panel.appendChild(rcb_create_switch(
        "github", "Show GitHub badges",
        "Show the last commit and the number of open issues of the " +
        "package's GitHub repository.  These badges are requested " +
        "from shields.io, which then learns which package page you " +
        "visit",
        settings.github));

    /* These are injections themselves, so they require the injections */
    if (!settings.enabled) {
        var keys = ["canonical", "collapse", "github"];
        for (var i = 0; i < keys.length; i++) {
            var input = panel.querySelector('input[name="rcb-' + keys[i] + '"]');
            input.disabled = true;
            input.parentNode.className += " rcb-disabled";
        }
    }

    var group = document.createElement("fieldset");
    group.className = "rcb-group";
    var legend = document.createElement("legend");
    legend.innerText = "Color mode";
    group.appendChild(legend);
    group.appendChild(rcb_create_theme_option("system", "System", settings.theme === "system"));
    group.appendChild(rcb_create_theme_option("light", "Light", settings.theme === "light"));
    group.appendChild(rcb_create_theme_option("dark", "Dark", settings.theme === "dark"));
    panel.appendChild(group);

    function open_panel(open) {
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.onclick = function(event) {
        event.preventDefault();
        open_panel(panel.hidden);
    };

    /* Close when clicking outside of the settings, or pressing Escape */
    document.addEventListener("click", function(event) {
        if (panel.hidden) return;
        if (!container.contains(event.target)) open_panel(false);
    });
    document.addEventListener("keydown", function(event) {
        if (panel.hidden) return;
        if (event.key !== "Escape") return;
        open_panel(false);
        toggle.focus();
    });

    document.body.appendChild(container);
}

/* Keep already open CRAN pages in sync with the settings */
function rcb_watch_settings() {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.onChanged) return;
    chrome.storage.onChanged.addListener(function(changes, area) {
        if (area !== "local") return;

        /* Injections cannot be added or removed after the fact */
        var reload = false;
        for (var key in RCB_DEFAULTS) {
            if (key === "theme" || !changes[key]) continue;
            rcb_cache_setting(key, rcb_valid(key, changes[key].newValue));
            reload = true;
        }
        if (reload) {
            rcb_reload();
            return;
        }

        if (!changes.theme) return;
        var theme = rcb_valid("theme", changes.theme.newValue);
        rcb_cache_setting("theme", theme);
        if (rcb_settings !== null) rcb_settings.theme = theme;
        rcb_apply_settings(rcb_settings || {theme: theme, enabled: true});
        var inputs = document.getElementsByName("rcb-theme");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].checked = (inputs[i].value === theme);
        }
    });
}

function rcb_when_body_exists(callback) {
    if (document.body !== null) {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}


/* Apply the most recently known settings before the page is rendered */
rcb_apply_settings(rcb_cached_settings());

rcb_load_settings();
rcb_watch_settings();

rcb_on_settings(function(settings) {
    rcb_when_body_exists(function() { rcb_inject_settings(settings); });
});
