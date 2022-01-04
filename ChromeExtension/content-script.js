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

function cran_url() {
    var element = null;
    var elements = document.head.getElementsByTagName("meta");
    for (var i=0; i < elements.length; i++) {
        element = elements[i];
        if (element.getAttribute("name") == "citation_public_url") { 
            return(element.getAttribute("content"));
        }
    }

    // Fallback: some package pages don't have the above meta tag.
    elements = document.getElementsByTagName("title");
    if (elements.length == 0) return null;
    
    element = elements[0];
    return element.innerText.replace(/CRAN - Package /, '');
}

function cran_package() {
    return(cran_url().replace(/.*package=/, ''));
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
    var url = "https://github.com/cran/" + pkg + "/commits/master";
    cran_append_a(element, '(', 'commits', ') ', url);
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
    url = "https://www.rdocumentation.org/packages/" + pkg;
    a.innerText = url;
    a.href = url;
    a.title = "Package page on RDocumentation";
    td.appendChild(a);
    
    td.appendChild(document.createElement("br"));
    a = document.createElement("a");
    url = "https://libraries.io/cran/" + pkg;
    a.innerText = url;
    a.href = url;
    a.title = "Package page on Libraries.io";
    td.appendChild(a);

    td.appendChild(document.createElement("br"));
    a = document.createElement("a");
    url = "https://mran.microsoft.com/package/" + pkg;
    a.innerText = url;
    a.href = url;
    a.title = "Package page on Microsoft MRAN";
    td.appendChild(a);

    tr2.appendChild(td);
    table.appendChild(tr2);
}

function cran_inject_cran_checks() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "CRAN.*checks");
    var element = elements[i+1];
    var pkg = cran_package();
    
//    element.appendChild(document.createTextNode(" "));
//    img = document.createElement("img");
//    img.src = "https://cranchecks.info/badges/summary/" + pkg;
//    img.alt = "CRAN check summary";
//    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" "));
    img = document.createElement("img");
    img.src = "https://cranchecks.info/badges/worst/" + pkg;
    img.alt = "CRAN check worst result";
    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" (Linux: "));
    img = document.createElement("img");
    img.src = "https://cranchecks.info/badges/flavor/linux/" + pkg;
    img.alt = "CRAN check Linux results";
    element.appendChild(img);
    
//    element.appendChild(document.createTextNode(" Solaris: "));
//    img = document.createElement("img");
//    img.src = "https://cranchecks.info/badges/flavor/solaris/" + pkg;
//    img.alt = "CRAN check Solaris results";
//    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" macOS: "));
    img = document.createElement("img");
    img.src = "https://cranchecks.info/badges/flavor/macos/" + pkg;
    img.alt = "CRAN check macOS results";
    element.appendChild(img);
    
    element.appendChild(document.createTextNode(" Windows: "));
    img = document.createElement("img");
    img.src = "https://cranchecks.info/badges/flavor/windows/" + pkg;
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


function cran_add_age() {
  var elements = document.body.getElementsByTagName("td");
  var i = cran_index_of_first_element(elements, "Published");
  if (i < 0) return;
  var element = elements[i+1];
  var today = new Date();
  var date = Date.parse(element.innerText);
  var days = Math.floor((today - date) / (24 * 60 * 60 * 1000));
  var unit = "days";
  if (days == 1) unit = "day";
  cran_append_text(element, " (" + days + " " + unit + " ago)");
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

function copy_install () {
    // ref: https://stackoverflow.com/a/18455088
    var cmd = "install.packages(\"" + cran_package()  + "\", dependencies = TRUE)";
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = cmd;
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
    input_box.value = "install.packages(\"" + cran_package() + "\", dependencies = TRUE)";
    input_box.size = 80;
    document.body.querySelector('p').append(br, br, input_box, copy_button);
    copy_button.focus()
}

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
