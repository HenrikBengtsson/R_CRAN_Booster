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

function cran_inject_materials() {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, "Materials");
    if (i < 0) return;
    var element = elements[i+1];
    cran_append_a(element, '', 'NAMESPACE', ' ', 'NAMESPACE');
    cran_append_a(element, '', 'DESCRIPTION', ' ', 'DESCRIPTION');
//     cran_append_a(element, '', 'LICENSE', ' ', 'LICENSE');
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

function cran_append_text(element, text) {
    var t = document.createTextNode(text);
    element.appendChild(t);
}

function cran_count(pattern) {
    var elements = document.body.getElementsByTagName("td");
    var i = cran_index_of_first_element(elements, pattern);
    if (i < 0) return(0);
    var element = elements[i+1];
    var t = element.innerText;
    t = t.replace(/\[[^\]]*\]/g, '');
    t = t.replace(/\([^\)]*\)/g, '');
    var count = (t.match(/,/g) || []).length + 1;
    cran_append_text(element, " (n = " + count + ")");
    return(count);
}

function cran_add_count(pattern, count) {
    var elements = document.body.getElementsByTagName("h4");
    var i = cran_index_of_first_element(elements, pattern);
    if (i < 0) return;
    var element = elements[i];
    cran_append_text(element, " (n = " + count + ")");
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

function cran_inject_vignette_exts() {
  var elements = document.body.getElementsByTagName("td");
  var i = cran_index_of_first_element(elements, "Vignettes");
  if (i < 0) return;
  var element = elements[i+1];
  var as = element.getElementsByTagName("a");
  var ext, t; 
  for (i = 0; i < as.length; i++) {
    a = as[i];
    ext = a.href.split('.').pop();
    t = document.createTextNode(" (" + ext + ")");
    a.parentNode.insertBefore(t, a.nextSibling);
  }
}
    
cran_inject_materials();
cran_inject_maintainer();
cran_inject_vignette_exts();

/* FIXME: Don't count, e.g. [aut, cre, cph] */
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
cran_add_count("Reverse.*dependencies", count);
