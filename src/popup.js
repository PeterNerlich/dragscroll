
var application = typeof browser !== 'undefined' ? 'Firefox' : typeof chrome !== 'undefined' ? 'Chrome' : null;
var app = typeof browser !== 'undefined' ? browser : chrome;

var loadflags = {
	storage: false,
	window: false
};

var settings = {
	extactive: true,
	friction: 0.9
};

let fric = {
	scale: 2,
	toInput: x => {
		return Math.pow(x, fric.scale);
	},
	fromInput: y => {
		return Math.pow(y, 1/fric.scale);
	}
};

var storage = app.storage.sync;

var qs = document.querySelector.bind(document);
var btn = {};

window.addEventListener('load', () => {
	btn = {
		extactive: qs('input#extactive'),
		friction: qs('input#friction')
	};

	document.body.setAttribute('data-app-show', application);

	if (application == 'Chrome') {
		document.getElementById('webstore_support').addEventListener('click', () => {
			app.tabs.create({
				url: 'https://chrome.google.com/webstore/detail/drag-scroll/ohebmbefnbokjgdjlppkeibiobnhcgan/support'
			});
		});
	} else if (application == 'Firefox') {
		// does open new tab anyways
		/*document.getElementById('addon_review').addEventListener('click', () => {
			app.tabs.create({
				url: 'https://addons.mozilla.org/en-US/firefox/addon/nightreader/#reviews'
			});
			return false;
		});*/
	}

	loadflags.window = true;
	if (loadflags.storage) {
		load();
	}
});

storage.get(['settings'], items => {
	if (!items) {
		items = {};
	}
	if (items.settings) {
		settings = items.settings;
	}

	loadflags.storage = true;
	if (loadflags.window) {
		load();
	}
});


function load() {
	btn.extactive.checked = settings.extactive;
	btn.friction.value = fric.toInput(settings.friction);
	btn.friction.nextElementSibling.querySelector('i').innerText = settings.friction;

	btn.extactive.addEventListener('click', e => {
		settings.extactive = this.checked;
		storage.set({'settings': settings}, () => {
			//console.log('saved: '+JSON.stringify(settings));
		});
		signalupdate({settings: settings});
	});
	btn.friction.addEventListener('input', function(e) {
		// WHILE input is being modified
		settings.friction = fric.fromInput(Math.round(parseFloat(this.value) * 100) / 100);
		this.nextElementSibling.querySelector('i').innerText = settings.friction;
	});
	btn.friction.addEventListener('change', e => {
		// AFTER input was modified
		storage.set({'settings': settings}, () => {});
		signalupdate({settings: settings});
	});
}

function signalupdate(obj) {
	obj.update = true;
	app.tabs.query({/*active: true, currentWindow: true*/}, tabs => {
		for (var t in tabs) {
			app.tabs.sendMessage(tabs[t].id,obj);
		}
	});
}


function dumpdata() {
	return new Promise((resolve, reject) => {
		storage.get(['settings'], items => {
			resolve(JSON.stringify(items));
		});
	});
}
