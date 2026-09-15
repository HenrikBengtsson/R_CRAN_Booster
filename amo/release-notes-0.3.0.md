**Version 0.3.0 (2026-09-15)**

This version brings the extension to Firefox for Android, and it puts the injections under your control through a settings popup.

**New**

- The extension now runs on Firefox for Android 142 or later, in addition to Firefox 140 or later on the desktop.

- A settings icon in the upper, right corner of the CRAN package page opens a popup, where the color mode can be set to 'System' (default), 'Light', or 'Dark'. The 'System' mode works as before, i.e. it follows the operating-system preference. The settings are remembered by the browser, so they survive a browser restart, and they apply to all CRAN package pages, also on other CRAN mirrors.

- The popup has a 'Badges' group, where the 'CRAN checks', 'Downloads', and 'GitHub/GitLab' badges can be turned on and off, one by one. The badges, and only they, are fetched from other sites.

- The popup has an option for turning off all injections. When turned off, only the settings icon is injected, so that you can turn them back on. The color mode still applies, so CRAN pages stay in dark mode.

- The popup has an option for using canonical URLs, which is off by default. When turned on, the URL bar shows the canonical package URL, e.g. `https://cran.r-project.org/package=KernSmooth`, and that is then what you copy and bookmark. The CRAN and Bioconductor package links on the page are rewritten to their canonical form as well.

- A reverse-dependency list with more than ten packages is now collapsed to its first ten, with a 'show all' toggle that reveals the rest. The collapsing can be turned off in the settings popup.

- New badges for the package's source repository show the last commit and the number of open issues. GitHub and GitLab are recognized, the latter including self-hosted instances. The badges come from [shields.io](https://shields.io/), which is why they are off by default.

- 'ORPHANED' is highlighted for a package that has no maintainer.

- New link to the package page on [R-universe](https://r-universe.dev/), which reports the package build status and system requirements per platform.

**Fixed**

- The injected `install.packages()` field was missing for a package that has never been updated, e.g. a newly published one. It was positioned relative to the 'Old sources' row, which such a package does not have.

- The injected `install.packages()` field was 60 characters wide also when the screen was narrower than that, which made the whole page wider than the screen, e.g. on Firefox for Android. The field now shrinks to fit, and the 'copy' button moves below it when there is no room beside it.

**Removed**

- The link to the package documentation on rdrr.io; the site now shows ads.

For the full changelog, including earlier versions, see `NEWS.md` at <https://github.com/HenrikBengtsson/R_CRAN_Booster>.

