
var DS;
(() => {
	let app = typeof browser !== 'undefined' ? browser : chrome;
	let storage = app.storage.sync;

	let settings = {
		extactive: true,
		friction: 0.9
	};

	let update = () => {
		if (settings.extactive) {
			if (!DS.isActivated()) {
				DS.activate();
			}
			DS.friction = settings.friction;
		} else {
			DS.deactivate();
		}
	};

	storage.get(['settings'], items => {
		if (!items) {
			items = {};
		}
		if (items.settings) {
			settings = items.settings;
		} else {
			storage.set({'settings': settings}, function() {});
		}

		update();
	});
	
	DS = DS || new DragScroll(false);

	app.storage.onChanged.addListener(changes => {
		if (changes.settings) {
			settings = changes.settings.newValue;
		}

		update();
	});
})();
