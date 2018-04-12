FILES_ALL = DragScroll.js dsapp.js popup.html popup.js icons/*
FILES_CHROME = 
FILES_FIREFOX = 
FILES_EXCLUDE = icons/icon.xcf icons/icon-webstore.png

all: ff chrome
	

chrome: prep
	cd ./src; cp manifest_chrome.json manifest.json; zip -rvu ../build/chrome.zip . -i $(FILES_ALL) $(FILES_CHROME) manifest.json -x $(FILES_EXCLUDE)

ff: prep
	cd ./src; cp manifest_firefox.json manifest.json; zip -rvu ../build/firefox.zip . -i $(FILES_ALL) $(FILES_FIREFOX) manifest.json -x $(FILES_EXCLUDE)

prep:
	mkdir -p ./build

clean:
	rm -rf ./build ./src/manifest.json
