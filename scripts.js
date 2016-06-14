"use strict";

var Student = function(data) {
    var self = this;
    self.index = data.index;
    self.name = ko.observable(data.name);
    self.surname = ko.observable(data.surname);
    self.date = ko.observable(data.date);    
    self.name.subscribe(function(newValue) {
        $.ajax({
            url: 'http://localhost:9998/service/students/' + self.index,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                "name":self.newValue,
                "surname":self.surname(),
                "date":self.date()
                })
        })
    });  
    self.surname.subscribe(function(newValue) {
        $.ajax({
            url: 'http://localhost:9998/service/students/' + self.index,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                "name":self.name(),
                "surname":newValue,
                "date":self.date()
                })
        })
    }); 
    self.date.subscribe(function(newValue) {
        $.ajax({
            url: 'http://localhost:9998/service/students/' + self.index,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                "name":self.name(),
                "surname":self.surname(),
                "date":newValue
                })
        })
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
    var self = this;
    
    self.items = ko.observableArray([]);
    self.items.subscribe(function(changes) {
        changes.forEach(function(change) {
            if (change.status === 'deleted') {
                console.log("Added or removed! The added/removed element is:", change.value);
                $.ajax({
                    url: 'http://localhost:9998/service/students/' + change.value.index,
                    method: 'DELETE'
                })
            }
        });
    }, null, "arrayChange");
    self.callback = function (data) {
        for(var i=0; i<data.length; i++) {
            var studentObj = ko.mapping.fromJS(data[i], dataMappingOptions);
            self.items.push(studentObj);
            var x = 1;
        }
    };
    self.func = function(callback) {
        $.ajax({
            url: 'http://localhost:9998/service/students',
            headers: {          
                 Accept : "application/json"        
            },    
           dataType: 'json',
           success: function(data) {
               callback(data);
           }
        });
    };
    self.loadItems = function () {
        if(self.items().length === 0) {
            self.func(self.callback);
        }
    };
    self.registerNewStudent = function() {   
        var name = $('#new_student_name').val();
        var surname = $('#new_student_surname').val();
        var date = $('#new_student_date').val();
        var formData = JSON.stringify({"name":name, "surname":surname, "date":date});
        $.ajax({
            url: 'http://localhost:9998/service/students',
            method: 'POST',
            contentType: 'application/json',
            data: formDatathis
        })
    };
    self.deleteStudent = function() {
        self.items.remove(this);
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