"use strict";

var studentListModel = function () {
    this.items = ko.observableArray([]),
    this.callback = function (data) {
        ko.mapping.fromJS(data, {}, this.items);
        var x = 1;
    }.bind(this),
    this.func = function(callback) {
        $.ajax({
            url: 'http://localhost:9998/service/students',
            headers: {          
                 Accept : "application/json"        
            },    
            error: function(xhr, status, error) {
                  var err = eval("(" + xhr.responseText + ")");
                  alert(err.Message);
            },
           dataType: 'json',
           success: function(data) {
               callback(data);
           },
            fail : function() {
                alert('FAIL');
            },
        });
    },
    this.loadItems = function () {
        this.func(this.callback);
    }
};

ko.applyBindings(new studentListModel());