# R CRAN Booster

[![Firefox Add-ons version](https://img.shields.io/amo/v/r-cran-booster)](https://addons.mozilla.org/en-US/firefox/addon/r-cran-booster/)
[![Firefox Add-ons users](https://img.shields.io/amo/users/r-cran-booster)](https://addons.mozilla.org/en-US/firefox/addon/r-cran-booster/)
[![Firefox Add-ons rating](https://img.shields.io/amo/stars/r-cran-booster)](https://addons.mozilla.org/en-US/firefox/addon/r-cran-booster/reviews/)
[![License: LGPL (>= 3)](https://img.shields.io/badge/license-LGPL%20(%3E%3D%203)-blue)](https://www.gnu.org/licenses/lgpl.txt)

'R CRAN Booster' is a Firefox browser extension that enhances the browsing experience on [The R Project](https://www.r-project.org)'s [CRAN](https://cran.r-project.org/) package pages.  It runs on Firefox 140 or later on the desktop, and on Firefox 142 or later on Android.  It does _not_ work on Google Chrome.

<img src="screenshot-with.png" style="border: solid 1px black" alt="Screenshot showing the CRAN page for the 'KernSmooth' package with 'R CMD check' status badges injected next to the 'CRAN checks' entry, download statistics badges injected at the top of the 'Downloads' section, an 'install.packages()' field with a 'copy' button, author, dependency, and reverse-dependency counts, long reverse-dependency lists collapsed behind a 'show all' toggle, the number of days since the version was published, and a settings icon in the upper, right corner"/>

## Settings

Clicking the settings icon in the upper, right corner opens a popup, where the injections can be turned off, canonical URLs can be turned on, the collapsing of long reverse-dependency lists can be turned off, each group of badges ('CRAN checks', 'Downloads', and 'GitHub/GitLab') can be turned on and off, and the color mode can be set to 'System' (default), 'Light', or 'Dark'.  The settings are remembered by the browser, and they apply to all CRAN package pages, also on other CRAN mirrors.

<img src="screenshot-settings.png" style="border: solid 1px black" alt="Screenshot showing the top of the CRAN page for the 'KernSmooth' package with the settings popup opened, holding 'Enhance CRAN pages', 'Use canonical URLs', and 'Collapse long lists' checkboxes, a 'Badges' group with 'CRAN checks', 'Downloads', and 'GitHub/GitLab' checkboxes, and a 'Color mode' group with 'System', 'Light', and 'Dark' options"/>

## Installation

Install the extension from Firefox Add-ons:

* <https://addons.mozilla.org/en-US/firefox/addon/r-cran-booster/>

To instead try out the development version, go to `about:debugging#/runtime/this-firefox` in Firefox, click 'Load Temporary Add-on...', and select the 'R_CRAN_Booster/WebExtension/manifest.json' file.  Note that a temporarily installed extension is uninstalled when Firefox terminates.

## License

This extension is licensed under [LGPL (>= 3)](https://www.gnu.org/licenses/lgpl.txt).



## Contributions

This Git repository uses the [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/) branching model (the [`git flow`](https://github.com/petervanderdoes/gitflow-avh) extension is useful for this).  The [`develop`](https://github.com/HenrikBengtsson/R_CRAN_Booster/tree/develop) branch contains the latest contributions and other code that will appear in the next release, and the [`master`](https://github.com/HenrikBengtsson/R_CRAN_Booster) branch contains the latest, stable release.  Contributing to this package is easy.  Just send a [pull request](https://help.github.com/articles/using-pull-requests/).  When you send your PR, make sure `develop` is the destination branch on the [R_CRAN_Booster repository](https://github.com/HenrikBengtsson/R_CRAN_Booster).


## Authors

* Henrik Bengtsson (https://github.com/HenrikBengtsson)
* Chung-hong Chan (https://github.com/chainsawriot)

