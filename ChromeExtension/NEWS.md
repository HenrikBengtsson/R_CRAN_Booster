# Chrome Extension: R_CRAN_Booster

## Version 0.2.1 [2026-09-15]

### New Features

 * Add a settings icon to the upper, right corner of the CRAN package
   page.  Clicking it opens a settings popup, where the color mode can
   be set to 'System' (default), 'Light', or 'Dark'.  The 'System' mode
   works as before, i.e. it follows the operating-system preference.
   The chosen mode is remembered by the browser, so it survives also a
   browser restart, and it applies to all CRAN package pages, also on
   other CRAN mirrors.

 * The settings popup has an option for turning off all injections into
   the CRAN package pages.  When turned off, only the settings icon is
   injected, so that they can be turned back on.  The color mode still
   applies, i.e. CRAN pages stay in dark mode.  Toggling reloads the page.


## Version 0.2.0 [2024-09-08]

### New Features

 * Now linking to CRANhaven, if is an issue deadline.

### Cleanup

 * Drop link to MRAN documentation; it was shutdown on 2023-07-01.

 * Drop link to Rdocumentation.org and Libraries.io documentation.


## Version 0.1.1 [2024-08-31]

### New Features

 * Add link to 'https://diffify.com/R/<pkg>/'.

### Bug Fixes

 * The R Logo image files are now truly square. Required for Firefox
   Add-ons.
 

## Version 0.1.0 [2023-01-15]

### New Features

 * Moved the `install.packages()` command to the 'Downloads' section.

 * Use a monospace font for the `install.packages()` command.

 * Add link to package documentation on rdrr.io.

### Cleanup

 * Removed 'Solaris' badge, since CRAN no longer checks on that
   platform.

### Bug Fixes

 * The 'crancheck.info' badges were broken, because their URLs was
   changed during November 2022.


## Version 0.0.2-9002 [2021-05-14]

### New Features

 * Inject `install.packages()` instructions together with a 'Copy'
   button.

 * STYLE: Use a Dark mode theme if set in the operating system.

 * STYLE: Use secondary color for injected text, e.g. count, age, etc.

 * STYLE: Injected counts are now appended to the section/entry label,
   instead of at the end of the value.
 
 * Above features was added by Chung-hong Chan (@chainsawriot) and
   originates from his https://github.com/chainsawriot/cranitup.
 

## Version 0.0.2 [2019-10-29]

### Bug Fixes

 * The macOS badge did no longer work because the URL was changed to
   use 'macos' instead of legacy 'osx'.


## Version 0.0.1 [2019-05-26]

### Significant Changes

 * First public release.
 

## Version 0.0.0.9005 [2019-05-26]

### Bug Fixes

 * Now applies to CRAN package page URLs ending with either
   `packages/<pkg>/` or `packages/<pkg>/index.html`.


## Version 0.0.0.9004 [2019-05-22]

### Bug Fixes

 * The extension applied itself also to some CRAN package page
   vignettes.
 

## Version 0.0.0.9003 [2019-05-19]

### New Features

 * Add badges to 'CRAN checks' section.
 
 * Add download badges to 'Downloads' section.
 

## Version 0.0.0.9002 [2019-05-19]

### New Features

 * Add 'Materials' link to Git CRAN mirror commits.


## Version 0.0.0.9001 [2017-04-01]

### New Features

 * Annotation direct and reverse dependency with package counts.
 
 * Annotation with number of authors.
 
 * Annotation with days since published.
 
 * Annotation vignettes with file types.


## Version 0.0.0.9000 [2017-03-26]

 * Created stub.
