/*global define:false*/
(function (window, undefined) {
"use strict";
(function (factory) {
    if (typeof define === "function" && define.amd) { // AMD
        define("ko.linq", ["knockout", "linqjs"], factory);
    }
    else {
        window.ko.linq = factory(window.ko, window.Enumerable);
    }
}(function (ko, Enumerable) {

    /**
    * Creates a new instance of LinqBuilder
    *
    * @constructor
    * @param {ko.observableArray} source The source observableArray
    * @return A new instance of LinqBuilder
    */
    function LinqBuilder(source) {
        this.source = source;
        this.enumerable = new Enumerable(function () {
            return Enumerable.From(source()).GetEnumerator();
        });
    }

    /**
    * Creates an instance of ko.computed that will return the observable
    * results of the built LINQ query.
    *
    * @return {ko.computed} An observable result of the query.
    */
    LinqBuilder.prototype.toComputed = function () {
        var self = this;
        return ko.computed(function () {
            return self.enumerable.ToArray();
        });
    };

    function createMediator(property) {
        LinqBuilder.prototype[toCamelCase(property)] = function () {
            this.enumerable = Enumerable.prototype[property].apply(this.enumerable, arguments);
            return this;
        };
    }

    for (var property in Enumerable.prototype) {
        if (!Enumerable.prototype[property].apply) { continue; }

        createMediator(property);
    }

    var firstCharacter = /^.{1}/;
    function toCamelCase(property) {
        return property.replace(firstCharacter, function (char) {
            return char.toLowerCase();
        });
    }

    /**
    * Start a new linq query based on the observablearray
    *
    * @return {LinqBuilder} A new LinqBuilder instance
    */
    ko.observableArray.fn.linq = function () {
        return new LinqBuilder(this);
    };
}));
}(window));