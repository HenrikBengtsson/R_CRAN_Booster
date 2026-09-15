R CRAN Booster enhances package pages on the Comprehensive R Archive Network (CRAN) at **cran.r-project.org** by injecting information that otherwise requires visiting several other sites.

On each package page you get:

- `R CMD check` status badges for Linux, macOS, and Windows, next to the 'CRAN checks' entry
- Download statistics: total, last month, and last week
- A ready-to-copy `install.packages()` command in the 'Downloads' section
- Counts of authors, dependencies, and reverse dependencies, appended to their labels
- The number of days since the current version was published
- A collapsed view of long reverse-dependency lists, with a toggle for showing all of them
- A highlighted 'ORPHANED' maintainer field, when the package has no maintainer
- The file type of each vignette
- Links to the package on [METACRAN](https://www.r-pkg.org/) and [R-universe](https://r-universe.dev/), to its NAMESPACE and DESCRIPTION files, to its commit history on the CRAN Git mirror, and to its version differences on [diffify](https://diffify.com/)
- A link to [CRANhaven](https://www.cranhaven.org/) when the package is at risk of being archived

A settings icon in the upper, right corner of the page opens a popup, where you can:

- set the color mode to 'System' (default), 'Light', or 'Dark' - 'System' follows the operating-system preference
- turn off the collapsing of long reverse-dependency lists, which is on by default
- turn each group of badges on and off: 'CRAN checks' and 'Downloads', which are on by default, and 'GitHub/GitLab', which is off by default
- turn off all injections, which leaves only the settings icon, so that they can be turned back on
- turn on canonical URLs, which is off by default, so that the URL bar shows the short package URL, e.g. `https://cran.r-project.org/package=KernSmooth`, and that is then what you copy and bookmark

The settings are remembered by the browser, so they survive a browser restart, and they apply to all CRAN package pages, also on other CRAN mirrors.

The extension runs on Firefox 140 or later on the desktop, and on Firefox 142 or later on Android.

The extension reads only the CRAN page you are already viewing. To display the badges, your browser requests images from badges.cranchecks.info and cranlogs.r-pkg.org, which means those services see the package name and your Internet Protocol (IP) address. If you turn on the GitHub/GitLab badges, which are off by default, images are requested from img.shields.io as well, and it sees the name of the package's source repository and your IP address.

Source code, changelog, and issue tracker: <https://github.com/HenrikBengtsson/R_CRAN_Booster>.

