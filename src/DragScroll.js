'use strict';
var DragScroll = function dragScroll(rootel) {
	this.friction = .9;

	let state = {
		clicked: false,
		momentum: {
			x: 0,
			y: 0
		},
		time: 0,
		dtime: 0,
		scrollEl: null,
		clickX: null,
		clickY: null
	};
	let root = document;
	let enabled = false;

	let updateScrollPos = e => {
		let now = Date.now();
		state.dtime = now - state.time;
		state.time = now;
		
		if (state.clicked) {
			document.body.parentNode.style.cursor = 'move';
			
			state.momentum = {
				x: state.clickX - e.pageX,
				y: state.clickY - e.pageY
			}

			state.scrollEl.scrollLeft += state.momentum.x;
			state.scrollEl.scrollTop += state.momentum.y;

			//console.log('setting momentum', state.momentum);
		} else {
			state.momentum.x *= this.friction;
			state.momentum.y *= this.friction;

			if (state.momentum.x*state.momentum.x + state.momentum.y*state.momentum.y < 100) {
				state.momentum = {
					x: 0,
					y: 0
				};
				//console.log('stopped');
			} else {
				state.scrollEl.scrollLeft += state.momentum.x * state.dtime/100;
				state.scrollEl.scrollTop += state.momentum.y * state.dtime/100;

				//console.log('wheee!', state.momentum, state.momentum.x*state.momentum.x + state.momentum.y*state.momentum.y);
				
				if (e === true && enabled) {
					requestAnimationFrame(updateScrollPos.bind(this, true));
				}
			}
		}
	};

	let mousemove = e => {
		if (state.clicked) {
			e.preventDefault();
			e.stopPropagation();
			updateScrollPos(e);
			state.clickX = e.pageX;
			state.clickY = e.pageY;
		}
	};
	let mousedown = e => {
		if (e.button === 1) {	// middle button
			state.scrollEl = findScroll(e.target);
			if (state.scrollEl !== null) {
				e.preventDefault();
				e.stopPropagation();
				state.time = Date.now();
				state.clicked = true;
				state.momentum = {x: 0, y: 0};
				//updateScrollPos(e);
				state.clickX = e.pageX;
				state.clickY = e.pageY;
			} else {
				console.log('didn\'t find a scroll element for', e.target);
			}
		}
	};
	let mouseup = e => {
		if (state.clicked) {
			e.preventDefault();
			e.stopPropagation();
			state.clicked = false;
			state.momentum.x *= 100/state.dtime;
			state.momentum.y *= 100/state.dtime;
			requestAnimationFrame(updateScrollPos.bind(this, true));
		}
		document.body.parentNode.style.cursor = 'auto';
	};
	let wheel = e => {
		if (state.clicked) {
			e.preventDefault();
			e.stopPropagation();
		} else {
			state.momentum = {x: 0, y: 0};
		}
	};


	let isValid = el => {
		while (el && el !== root) {
			if (el === root || el === document.documentElement || el === document.body) {
				return true;
			} else if ((el.localName === "a" && el.href) || (el.localName === "input") || (el.localName === "textarea") || el.isContentEditable) {
				return false;
			}
			el = el.parentNode;
		}
		return false;
	};

	let findScroll = el => {
		while(el !== root.parentNode && el !== null) {
			let style = getComputedStyle(el);
			let scrollableInX = (style.overflowX === 'auto' || style.overflowX === 'scroll') && el.scrollWidth > el.clientWidth;
			let scrollableInY = (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;

			if (scrollableInX || scrollableInY || el === document.body.parentNode) {
				return el;
			}
			el = el.parentNode;
		}
		return null;
	};


	this.activate = (rootel) => {
		if (enabled) {
			this.deactivate();
		}
		root = !rootel ? root : (rootel instanceof Node ? rootel : document);

		root.addEventListener('mousemove', mousemove, true);
		root.addEventListener('mousedown', mousedown, true);
		root.addEventListener('mouseup', mouseup, true);
		root.addEventListener('wheel', wheel, true);
		
		return enabled = true;
	};
	this.deactivate = () => {
		enabled = false;

		root.removeEventListener('mousemove', mousemove, true);
		root.removeEventListener('mousedown', mousedown, true);
		root.removeEventListener('mouseup', mouseup, true);
		root.removeEventListener('wheel', wheel, true);

		return true;
	};
	this.isActivated = () => {
		return enabled;
	};

	if (rootel !== false) {
		this.activate(rootel);
	}

	return this;
};
