"use strict";

var Student = function(data) {
    this.index = data.index;
    this.name = ko.observable(data.name);
    this.surname = ko.observable(data.surname);
    this.date = ko.observable(data.date);
    
    this.surname.subscribe(function() {
        alert("Surname changed");
    });
};

var dataMappingOptions = {
    key: function(data) {
        return data.index;        
    },
    create: function(options) {
        return new Student(options.data);
    }        
};

var studentListModel = function () {
    this.items = ko.observableArray([]);
    this.callback = function (data) {
        for(var i=0; i<data.length; i++) {
            var studentObj = ko.mapping.fromJS(data[i], dataMappingOptions);
            this.items.push(studentObj);
            var x = 1;
        }
    }.bind(this);
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
    };
    this.loadItems = function () {
        if(this.items().length === 0) {
            this.func(this.callback);
        }
    }
};

ko.applyBindings(new studentListModel());

$(document).ready(function() {
    $('#students_link').click(function() {
    $('#art1').show('slow');
    $('#art2').hide();
    $('#art3').hide();
    });
    
    $('#courses_link').click(function() {
    $('#art1').hide();
    $('#art2').show('slow');
    $('#art3').hide();
    });
    
    $('#grades_link').click(function() {
    $('#art1').hide();
    $('#art2').hide();
    $('#art3').show('slow');
    });
})