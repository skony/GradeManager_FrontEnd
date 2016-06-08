"use strict";

//function MyObservableArray() {
//    
//}
//
//var myArray = new MyObservableArray();
//myArray.prototype = ko.observableArray();

var studentListModel = function () {
    this.items = ko.observableArray();
    this.loadItems = function () {
        $.ajax("http://localhost:8889/service/students", {
            accepts: 'application/json',
            type: 'GET',
        })
        .done(function (data) {
            alert("SUCCESS");
        })
        .fail(function () {
            alert("FAIL");
        })
    };
};

ko.applyBindings(new studentListModel());