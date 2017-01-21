/*global logger*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "dojo/NodeList-traverse"

], function(declare, _WidgetBase, _TemplatedMixin,
    dom, dojoDom, dojoProp, dojoGeometry, dojoClass,
    dojoStyle, dojoConstruct, dojoQuery, dojoArray, dojoLang,
    dojoText, dojoHtml, dojoEvent) {
    "use strict";

    // Declare widget's prototype.
    return declare("AnimateVisibility.widget.AnimateVisibilityEnum", [_WidgetBase], {



        // Parameters configured in the Modeler.
        effect: "fade",
        enum: "",
        matchOnEmpty: "",
        visibleOnMatch: "",
        keysToMatch: [],
        elementName: "",
        duration: 500,
        easing: "easeOutQuad",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,

        _keys: [],
        _element: null,
        _spacerNode: null,
        _containerNode: null,


        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function() {
            console.log(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            console.log(this.id + ".postCreate");

            this._getKeys();

            // this._setUpNodes();

            // this._updateRendering();
            this._setupEvents();
        },

        _setUpNodes: function() {

            if (this._element) {
                // Height of element
                var h = dojoStyle.get(this._element, "height") + "px";

                // Setup container
                this._containerNode = dojoQuery(this._element).parent()[0];
                dojoStyle.set(this._containerNode, "height", h);
                dojoStyle.set(this._containerNode, "overflow-y", "hidden");

                if (!this._isVisible()) {
                    dojoStyle.set(this._element, "transition", "");
                    dojoStyle.set(this._element, "margin-top", h);
                }
                var duration = this.duration / 1000;
                dojoStyle.set(this._element, "transition", "margin " + duration + "s ease");


            }


        },

        _getKeys: function() {

            dojoArray.forEach(this.keysToMatch, function(key) {
                this._keys.push(key.key);
            }, this);

        },

        _getElement: function() {
            console.log(this.id + "._getElement");
            var domList = document.getElementsByClassName("mx-name-" + this.elementName);

            if (domList.length > 0)
                this._element = domList[domList.length - 1];

            if (this._element === null) {
                console.log("Error: unable to find element with name " + this.elementName);
                //this.loaded();
                return;
            }


        },

        _isMatch: function() {
            console.log(this.id + "._isMatch");
            // console.log(this._contextObj);

            var match = false;

            if (this._contextObj !== null) {
                // console.log("Attribute: " + this.enum);
                var value = this._contextObj.get(this.enum);


                console.log(value);

                if (value === "" && this.matchOnEmpty) {
                    match = true;
                } else if (dojoArray.indexOf(this._keys, value) !== -1) {
                    match = true;
                }
            }



            return match;
        },

        _isVisible: function() {
            if (this._element !== null) {
                console.log(this.id + " Match: " + this._isMatch());
                console.log(this.id + " Visible On Match: " + this.visibleOnMatch);

                if (this._isMatch()) {
                    // Match
                    if (this.visibleOnMatch) {
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    // No match
                    if (this.visibleOnMatch) {
                        return false;
                    } else {
                        return true;
                    }

                }
            } else {
                // No Element
                return false;
            }
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            console.log(this.id + ".update");

            this._contextObj = obj;
            this._getElement();
            this._setUpNodes();
            this._resetSubscriptions();
            this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function() {
            console.log(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function() {
            console.log(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function(box) {
            console.log(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function() {
            console.log(this.id + ".uninitialize");

            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function(e) {
            console.log(this.id + "._stopBubblingEventOnMobile");
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function() {
            // console.log(this.id + "._setupEvents");


        },

        // Rerender the interface.
        _updateRendering: function(callback) {
            console.log(this.id + "._updateRendering");

            if (this._element !== null) {
                if (this._isVisible()) {
                    this._show();
                } else {
                    this._hide();
                }

            }

            // The callback, coming from update, needs to be executed, to let the page know it finished rendering
            mendix.lang.nullExec(callback);
        },

        _slideOptions: function() {
            var options = {
                duration: this.duration,
                easing: "swing"
            };

            console.log(options);

            return options;
        },

        _show: function() {
            if (this._element !== null) {
                dojoStyle.set(this._element, "margin-top", "0");
            }

        },

        _hide: function() {
            if (this._element !== null) {

                var h = dojoStyle.get(this._element, "height") + "px";

                dojoStyle.set(this._element, "margin-top", h);
            }

        },

        // Handle validations.
        _handleValidation: function(validations) {

        },

        // Clear validations.
        _clearValidations: function() {

        },

        _unsubscribe: function() {
            if (this._handles) {
                dojoArray.forEach(this._handles, function(handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }
        },

        // Reset subscriptions.
        _resetSubscriptions: function() {
            console.log(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            this._unsubscribe();

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                var objectHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function(guid) {
                        this._updateRendering();
                    })
                });

                var attrHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.enum,
                    callback: dojoLang.hitch(this, function(guid, attr, attrValue) {
                        this._updateRendering();
                    })
                });

                this._handles = [objectHandle, attrHandle];
            }
        }
    });
});

require(["AnimateVisibility/widget/AnimateVisibilityEnum"]);