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
        $.ajax({
            url: 'http://localhost:9998/service/students',
            data: {
                format: 'json'
            },
            error: function() {
                alert('ERROR');
            },
           dataType: 'jsonp',
           success: function(data) {
              alert('SUCCESS');
           },
            fail : function() {
                alert('FAIL');
            },
           type: 'GET'
        });
    };
};

ko.applyBindings(new studentListModel());