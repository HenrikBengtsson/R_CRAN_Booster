function trimString(s) {
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function trimUrl(s) {
    return s.replace(/([^:])[/][/]/g, '$1/');
}

function cran_index_of_first_element(elements, pattern) {
    var element = null;
    for (var i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.innerText.search(pattern) != -1) {
            return(i);
        }
    }
    return(-1);
}

function cran_append_a(dom, prefix, text, suffix, url) {
    var t = null;
    var a = document.createElement("a");
    a.innerText = text;
    a.href = trimUrl(url);
    a.title = "Added by the R_CRAN extension";
    t = document.createTextNode(prefix);
    dom.appendChild(t);
    dom.appendChild(a);
    t = document.createTextNode(suffix);
    dom.appendChild(t);
    return dom;
}

// Memoization cache
var cache = {};

function cran_url() {
    var url;
    url = cache.cran_url;
    if (url !== undefined) return(url);
    
    url = window.location.href;
    
    var element = null;
    var elements = document.head.getElementsByTagName("meta");

    for (var i=0; i < elements.length; i++) {
        element = elements[i];
        if (element.getAttribute("name") == "DC.identifier") {
            url = element.getAttribute("content");
            break;
        } else if (element.getAttribute("name") == "og:url") { 
            url = element.getAttribute("content");
            break;
        } else if (element.getAttribute("name") == "citation_public_url") { 
            url = element.getAttribute("content");
            break;
        }
    }

    // Return cannonical CRAN URL
    url = url.replace(/\/web\/packages\//, '/package=');
    url = url.replace(/index.html$/, '');
    url = url.replace(/\/$/, '');

    cache.cran_url = url;
    
    return(url);
}

function cran_package() {
    var name;

    name = cache.cran_package;
    if (name !== undefined) return(name);
    
    let url = cran_url();

    if (url !== null) {
        name = url.replace(/.*package=/, '');
    } else {
        // Fallback; infer from page title, if URL cannot be identified
        elements = document.getElementsByTagName("title");
        element = elements[0];
        name = element.innerText;
        name = name.replace(/CRAN\s*(:|-)\s*Package\s*/, '')
    }

    cache.cran_package = name;
    
    return(name);
}

function cran_find_h4(pattern) {
    var elements = document.body.getElementsByTagName("h4");
    var i = cran_index_of_first_element(elements, pattern);
    if (i < 0) return null;
    return(elements[i]);
}

function cran_inject_materials() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "Materials");
    if (i < 0) {
        i = cran_index_of_first_element(elements, "NeedsCompilation");
        if (i < 0) return;
        var td = elements[i];
        var tr = td.parentNode;
        var table = tr.parentNode;
        var tr2 = document.createElement('tr');
        var td2 = document.createElement('td');
        td2.innerText = "Materials:";
        tr2.appendChild(td2);
        td2 = document.createElement('td');
        tr2.appendChild(td2);
        tr.parentNode.insertBefore(tr2, tr.nextSibling);
        i = cran_index_of_first_element(elements, "Materials");
    }
    var element = elements[i+1];
    cran_append_a(element, '', 'NAMESPACE', ' ', 'NAMESPACE');
    cran_append_a(element, '', 'DESCRIPTION', ' ', 'DESCRIPTION');
    //     cran_append_a(element, '', 'LICENSE', ' ', 'LICENSE');
    var pkg = cran_package();
    element.appendChild(document.createTextNode("("));
    var url = "https://github.com/cran/" + pkg + "/commits/master";
    cran_append_a(element, '', 'commits', '', url);
    element.appendChild(document.createTextNode(", "));
    url = "https://diffify.com/R/" + pkg;
    cran_append_a(element, '', 'diffify', '', url);
    element.appendChild(document.createTextNode(")"));
}


function cran_inject_maintainer() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "Maintainer");
    if (i < 0) return;
    var element = elements[i+1];
    var t = element.innerText;
    var name = t.replace(/<.*/, '');
    var email = t.replace(/.*</, '').replace(/>.*/, '').replace(/ at /, '@');
    element.innerText = name;
    cran_append_a(element, '<', email, '>', 'https://r-pkg.org/maint/' + email);
}

function cran_inject_other_urls() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "CRAN.*checks");
    var td = elements[i];
    var tr = td.parentNode;
    var table = tr.parentNode;
    var tr2 = document.createElement('tr');
    td = document.createElement('td');
    td.innerText = "Other URLs:";
    tr2.appendChild(td);
    td = document.createElement('td');

    var pkg = cran_package();
    var a;
    var url;

    a = document.createElement("a");
    url = "https://www.r-pkg.org/pkg/" + pkg;
    a.innerText = url;
    a.href = url;
    a.title = "Package page on METACRAN";
    td.appendChild(a);

    td.appendChild(document.createElement("br"));
    a = document.createElement("a");
    url = "https://rdrr.io/cran/" + pkg;
    a.innerText = url;
    a.href = url;
    a.title = "Package page on rdrr.io";
    td.appendChild(a);

    tr2.appendChild(td);
    table.appendChild(tr2);
}

function cran_inject_cran_checks() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "CRAN.*checks");
    var element = elements[i+1];
    let pkg = cran_package();
    
    // Link to CRANhaven, if package has issues
    let pattern = /issues need fixing before/;
    var spans = element.querySelectorAll("span");
    var span = Array.from(spans).find(x => pattern.test(x.textContent));
    if (span !== undefined) {
        var text = span.textContent.replace(/^\[|\]$/g, '');
        let pattern = /\d{4}-\d{2}-\d{2}/;
        var match = span.textContent.match(pattern);
        if (match) {
            var datestr = match[0];
            var age = calculate_age(datestr);
            text = text + " (" + age + ")";
        }
        let anchor = document.createElement("a");
        anchor.href = "https://www.cranhaven.org/dashboard-at-risk.html";
        anchor.textContent = "[" + text + "]";
        span.parentNode.replaceChild(anchor, span);        
    }   

    element.appendChild(document.createTextNode(" "));
    element.appendChild(document.createElement("br"));

//    element.appendChild(document.createTextNode(" "));
//    img = document.createElement("img");
//    img.src = "https://badges.cranchecks.info/summary/" + pkg + ".svg";
//    img.alt = "CRAN check summary";
//    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" "));
    img = document.createElement("img");
    img.src = "https://badges.cranchecks.info/worst/" + pkg + ".svg";
    img.alt = "CRAN check worst result";
    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" (Linux: "));
    img = document.createElement("img");
    img.src = "https://badges.cranchecks.info/flavor/linux/" + pkg + ".svg";
    img.alt = "CRAN check Linux results";
    element.appendChild(img);
    
//    element.appendChild(document.createTextNode(" Solaris: "));
//    img = document.createElement("img");
//    img.src = "https://badges.cranchecks.info/flavor/solaris/" + pkg + ".svg";
//    img.alt = "CRAN check Solaris results";
//    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" macOS: "));
    img = document.createElement("img");
    img.src = "https://badges.cranchecks.info/flavor/macos/" + pkg + ".svg";
    img.alt = "CRAN check macOS results";
    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" Windows: "));
    img = document.createElement("img");
    img.src = "https://badges.cranchecks.info/flavor/windows/" + pkg + ".svg";
    img.alt = "CRAN check Windows results";
    element.appendChild(img);
    
    element.appendChild(document.createTextNode(")"));
}

function cran_inject_download_badges() {
    var element = cran_find_h4("Downloads");
    var pkg = cran_package();
    var img;
    var text;

    var div = document.createElement("div");
    element.after(div);    
    
    img = document.createElement("img");
    img.src = "https://cranlogs.r-pkg.org/badges/grand-total/" + pkg;
    img.alt = "Total number of downloads";
    div.appendChild(img);

    div.appendChild(document.createTextNode(" "));
    img = document.createElement("img");
    img.src = "https://cranlogs.r-pkg.org/badges/last-month/" + pkg;
    img.alt = "Number of downloads during the last month";
    div.appendChild(img);

    div.appendChild(document.createTextNode(" "));
    img = document.createElement("img");
    img.src = "https://cranlogs.r-pkg.org/badges/last-week/" + pkg;
    img.alt = "Number of downloads during the last week";
    div.appendChild(img);
}

function cran_append_text(element, text) {
    //    var t = document.createTextNode(text);
    var t = document.createElement("span");
    t.className = "aux";
    t.innerText = text;
    element.appendChild(t);
}

function cran_count(pattern) {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, pattern);
    if (i < 0) return(0);
    var element_col1 = elements[i];
    var element = elements[i+1];
    var t = element.innerText;
    t = t.replace(/\[[^\]]*\]/g, '');
    t = t.replace(/\([^\)]*\)/g, '');
    var count = (t.match(/,/g) || []).length + 1;
    cran_append_text(element_col1, " (" + count + ")");
    return(count);
}

function cran_add_count(pattern, count) {
    var element = cran_find_h4(pattern);
    if (element == null) return;
    cran_append_text(element, " (" + count + ")");
}


function calculate_age(datestr) {
    var date = Date.parse(datestr);
    var today = new Date();
    var days = Math.floor((today - date) / (24 * 60 * 60 * 1000));
    var age = "today";
    if (days > 0) {
        if (days == +1) {
            age = "1 day ago";
        } else {
            age = days + " days ago";
        }
    } else if (days < 0) {
        if (days == -1) {
            age = "in 1 day";
        } else {
            age = "in " + -days + " days";
        }
    }
    return age;
}

function cran_add_age() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "Published");
    if (i < 0) return;
    var element = elements[i+1];
    var age = calculate_age(element.innerText);
    cran_append_text(element, " (" + age + ")");
}

function cran_add_vignette_exts() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "Vignettes");
    if (i < 0) return;
    var element = elements[i+1];
    var as = element.getElementsByTagName("a");
    var ext, t; 
    for (i = 0; i < as.length; i++) {
	a = as[i];
	ext = a.href.split('.').pop();
        t = document.createElement("span");
	t.className = "aux";
	t.innerText = " (" + ext + ")";
	a.parentNode.insertBefore(t, a.nextSibling);
    }
}

function install_cmd() {
    return "install.packages(\"" + cran_package()  + "\", dependencies = TRUE)";
}

function copy_install() {
    // ref: https://stackoverflow.com/a/18455088
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = install_cmd();
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    document.body.removeChild(copyFrom);
}

function cran_inject_install_section() {
    var copy_button = document.createElement("button");
    copy_button.innerText = "copy";
    var br = document.createElement("br");
    copy_button.onclick = copy_install;
    var input_box = document.createElement("input");
    input_box.type = 'text';
    input_box.value = install_cmd();
    input_box.size = 60;
    input_box.style = "font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace;"
    
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "Old.*sources");
    var td = elements[i];
    var tr = td.parentNode;
    var tbody = tr.parentNode;
    var table = tbody.parentNode;
    var div = document.createElement("div");
    table.after(div);    
    div.appendChild(br);
    div.appendChild(input_box);
    div.appendChild(copy_button);
    copy_button.focus();
}

/**
 * Link to packages by their canonical URL, both on CRAN and on
 * Bioconductor.  CRAN spells its own package links out as
 * '<cran>/web/packages/<pkg>/index.html', and the Bioconductor ones as
 * 'https://www.bioconductor.org/packages/release/bioc/html/<pkg>.html'.
 * The canonical forms, '<cran>/package=<pkg>' and
 * 'https://www.bioconductor.org/packages/<pkg>/', are what one wants to
 * copy.  The Bioconductor one is, unlike the spelled-out one, also
 * independent of the Bioconductor release and of which tree the package
 * lives in, e.g. 'data/annotation' rather than 'bioc'.
 *
 * Only links to package pages are rewritten.  Everything else is left
 * alone, e.g. '<cran>/web/packages/<pkg>/<pkg>.pdf' and
 * '<cran>/web/checks/check_results_<pkg>.html'.  Note that following a
 * canonical URL costs one extra redirect.
 */
function cran_canonical_package_urls() {
    var cran = new RegExp("^(https?://[^/]+)/web/packages/([^/]+)/(index[.]html)?$");
    var bioc = new RegExp("^https?://(www[.])?bioconductor[.]org/packages/"
                          + "[^/]+/(bioc|data/annotation|data/experiment|workflows)"
                          + "/html/(.+)[.]html$");
    var as = document.getElementsByTagName("a");
    for (var i = 0; i < as.length; i++) {
        var match = as[i].href.match(cran);
        if (match !== null) {
            as[i].href = match[1] + "/package=" + match[2];
            continue;
        }
        match = as[i].href.match(bioc);
        if (match !== null) {
            as[i].href = "https://www.bioconductor.org/packages/" + match[3] + "/";
        }
    }
}


/**
 * Show the canonical package URL in the URL bar, i.e.
 * 'https://cran.r-project.org/package=KernSmooth' instead of
 * '.../web/packages/KernSmooth/index.html', so that it is what one
 * copies and bookmarks.  CRAN redirects (303) the canonical URL, and
 * everything below it, to the real one, so reloading works.
 *
 * Note that 'history.replaceState()' also moves the base URL that the
 * page's relative links resolve against.  That would break all of them,
 * e.g. '../AER/index.html' would become '/AER/index.html'.  A <base>
 * element pins them to the original folder.
 *
 * Note also that we must not use cran_url() here, because it reports
 * 'https://CRAN.R-project.org/package=<pkg>' also when we are on a CRAN
 * mirror, and rewriting to another host is not allowed.
 */
function cran_show_canonical_url() {
    var here = window.location.origin + window.location.pathname;
    var url = here;
    url = url.replace(/\/web\/packages\//, '/package=');
    url = url.replace(/index.html$/, '');
    url = url.replace(/\/$/, '');
    if (url == here) return;

    // Keep the page's relative links resolving against the real folder
    var base = document.createElement("base");
    base.href = here.replace(/[^/]*$/, '');
    document.head.insertBefore(base, document.head.firstChild);

    window.history.replaceState(null, "", url);
}


function cran_inject_all() {
    cran_inject_materials();
    cran_inject_cran_checks();
    cran_inject_maintainer();
    cran_inject_download_badges();
    cran_add_vignette_exts();
    cran_add_age();

    cran_count("Author");

    var count = 0;
    count = count + cran_count("Depends");
    count = count + cran_count("Imports");
    count = count + cran_count("Suggests");
    count = count + cran_count("Enhances");
    count = count + cran_count("LinkingTo");

    count = 0;
    count = count + cran_count("Reverse.*depends");
    count = count + cran_count("Reverse.*imports");
    count = count + cran_count("Reverse.*linking.*to");
    count = count + cran_count("Reverse.*suggests");
    count = count + cran_count("Reverse.*enhances");
    cran_add_count("Reverse.*dependencies", count);

    cran_inject_other_urls();
    cran_inject_install_section();
}


/* Inject, unless disabled in the settings (see 'settings.js', which runs
   first and shares the same scope).  The settings icon is injected there,
   so that it remains available also when everything else is disabled. */
if (typeof rcb_on_settings === "function") {
    rcb_on_settings(function(settings) {
        if (!settings.enabled) return;
        cran_inject_all();
        if (settings.canonical) {
            cran_canonical_package_urls();
            /* Last, so that cran_url() has already seen the original URL */
            cran_show_canonical_url();
        }
    });
} else {
    cran_inject_all();
}
