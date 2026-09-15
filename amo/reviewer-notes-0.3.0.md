**Version 0.3.0 - notes for reviewers**

This version now declares `data_collection_permissions.required: ["browsingActivity"]`. The extension itself neither collects nor transmits anything, but it injects badge images whose URLs carry the name of the CRAN package page being viewed, e.g. `https://badges.cranchecks.info/flavor/linux/KernSmooth.svg`. The badge hosts therefore see which CRAN package page is being visited, etc.

Support was added for Firefox for Android, which was tested locally over Android Debug Bridge (ADB).

PS. Thank you for review work.
