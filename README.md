# DragScroll

*Tiny JS library to scroll the page and/or sub elements by dragging with the middle mouse button.*

## How to use

You can use an instance of `DragScroll` on any DOM element, or just on `document` directly. It will then intercept clicks with the middle mouse button and `mousemove` and `mouseup` events following it and scroll the nearest scollable container as the cursor is dragged:

```js
var scroller = new DragScroll(target);
```

where `target` is a DOM element or `document`. If target is not a DOM element, `document` is used as the default. Exception: If `false` is passed, DragScroll will not immediately bind to the mouse events.

```js
// boolean, returns whether DragScroll is listening to events
scroller.isActivated();

// starts listening to events, calls deactivate() first if already activated to restart
scroller.activate(target);

// stops listening to events, stops scroll momentum
scroller.deactivate();
```

If `target` is specified on `activate()`, it will be used as the new most outer scroll element (or `document`, if it is not a DOM Node).

DragScroll also keeps a momentum to keep scrolling when the mouse has already been released. Without it, scrolling feels very weird. You can adjust how fast the scrolling stops by adjusting `friction` to a value between `0` and `1`. The default is `0.9`.

```js
scroller.friction = 0.9;
```

Keep in mind that `friction` is the *factor* the momentum gets `scaled` by each update. As such, `0` will result in an immediate stop while `1` will make the element scroll infinitely at a constant speed. Because the factor is applied several times a second, a factor below `0.8` will already feel very sudden.
