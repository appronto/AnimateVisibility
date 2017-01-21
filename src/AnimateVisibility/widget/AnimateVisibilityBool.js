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

    "AnimateVisibility/widget/AnimateVisibilityEnum",
    "dojo/NodeList-traverse"

], function(declare, _WidgetBase, _TemplatedMixin,
    dom, dojoDom, dojoProp, dojoGeometry, dojoClass,
    dojoStyle, dojoConstruct,dojoQuery, dojoArray, dojoLang,
    dojoText, dojoHtml, dojoEvent,
    animateEnum) {
    "use strict";

    // Declare widget's prototype.
    return declare("AnimateVisibility.widget.AnimateVisibilityBool", [animateEnum], {

        // Parameters configured in the Modeler.
        bool: "",
        visibleOnMatch: "",


        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            console.log(this.id + ".postCreate");

			this._setUpNodes();

            // this._updateRendering();
            this._setupEvents();
        },

        _isMatch: function() {
            console.log(this.id + "._isMatch");
            // console.log(this._contextObj);

            var match;

            if (this._contextObj !== null) {
                // console.log("Attribute: " + this.enum);
                var value = this._contextObj.get(this.bool);

                if (value) {
                    return true;
                } else {
                    return false;
                }

            } else {
                return false;
            }

        },

        // Reset subscriptions.
        _resetSubscriptions: function() {
            console.log(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            this._unsubscribe();

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                // var objectHandle = mx.data.subscribe({
                //     guid: this._contextObj.getGuid(),
                //     callback: dojoLang.hitch(this, function (guid) {
                //         this._updateRendering();
                //     })
                // });

                var attrHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.bool,
                    callback: dojoLang.hitch(this, function(guid, attr, attrValue) {
                        this._updateRendering();
                    })
                });

                this._handles = [attrHandle];
            }
        }
    });
});

require(["AnimateVisibility/widget/AnimateVisibilityBool"]);