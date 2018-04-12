# DragScroll

*Chrome extension and Firefox AddOn for scrolling the page and sub elements by dragging with the middle mouse button.*

## Build

Building the `.zip`s for the Chrome Webstore and AMO is automated by a small Makefile. From the repositories root directory, run `make` to build both `.zip`s as `build/chrome.zip` and `build/firefox.zip`.

These can be built individually building only the targets `make chrome` and `make ff`. Building these takes the respective manifest and copies it to `manifest.json` before packing it as `.zip`. This file is not deleted afterwards (which can be done with `make clean`, which also deletes `build/*`). This way one can quickly test and use the Extension/AddOn, without uploading individual builds or manually loading a built `.zip` with the browser, which might also be rejected for security reasons. Instead, the `src/` directory itself can be used to "debug" the Extension/AddOn. In Chrome, look for the *Load unpacked extension...* button on `chrome://extensions`, in Firefox open the tools menu (gear next to search bar on `about:addons`), go to *Debug Add-Ons*, check *Enable add-on debugging* and use *Load Temporary Add-on*. You might need to *Reload (Ctrl+R)* sometimes the Extension to notice some changes though (I am not at all sure).
