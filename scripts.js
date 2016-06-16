"use strict";

var Student = function(data) {
    var self = this;
    self.index = data.index;
    self.name = ko.observable(data.name);
    self.surname = ko.observable(data.surname);
    self.date = ko.observable(data.date);    
    self.fullName = function() {
      return self.name() + ' ' + self.surname();  
    };
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

var Course = function(data) {
    var self = this;
    self.id = data.id;
    self.name = ko.observable(data.name);
    self.professor = ko.observable(data.professor);
    self.name.subscribe(function(newValue) {
        $.ajax({
            url: 'http://localhost:9998/service/courses/' + self.id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                "name":self.newValue,
                "professor":self.professor()
                })
        })
    });  
    self.professor.subscribe(function(newValue) {
        $.ajax({
            url: 'http://localhost:9998/service/courses/' + self.id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                "name":self.name(),
                "professor":newValue
                })
        })
    }); 
}

var Grade = function(date) {
    var self = this;
    self.id = data.id;
    self.mark = ko.observable(data.mark);
    self.date = ko.observable(data.date);
    self.student = data.student.index;
}

var dataMappingOptions = {
    key: function(data) {
        return data.index;        
    },
    create: function(options) {
        return new Student(options.data);
    }        
};

var dataMappingOptions2 = {
    key: function(data) {
        return data.id;        
    },
    create: function(options) {
        return new Course(options.data);
    }        
};

var dataMappingOptions3 = {
    key: function(data) {
        return data.id;        
    },
    create: function(options) {
        return new Grade(options.data);
    }        
};

var studentListModel = function () {
    var self = this;
    
    self.items = ko.observableArray([]);
    self.items2 = ko.observableArray([]);
    self.items3 = ko.observableArray([]);
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
    self.items2.subscribe(function(changes) {
        changes.forEach(function(change) {
            if (change.status === 'deleted') {
                console.log("Added or removed! The added/removed element is:", change.value);
                $.ajax({
                    url: 'http://localhost:9998/service/courses/' + change.value.id,
                    method: 'DELETE'
                })
            }
        });
    }, null, "arrayChange");
    self.callback = function (data, collection) {
        if(collection.startsWith('students')) {
            if(data instanceof Array) {
                for(var i=0; i<data.length; i++) {
                    var obj = ko.mapping.fromJS(data[i], dataMappingOptions);
                    self.items.push(obj);
                }
            }
            else {
                var obj = ko.mapping.fromJS(data, dataMappingOptions);
                self.items.push(obj);
            }
        }
        else if(collection.startsWith('courses')) {
            if(data instanceof Array) {
                for(var i=0; i<data.length; i++) {
                    var obj = ko.mapping.fromJS(data[i], dataMappingOptions2);
                    self.items2.push(obj);
                }
            }
            else {
                var obj = ko.mapping.fromJS(data, dataMappingOptions2);
                self.items2.push(obj);
            }
        }
        else if(collection.startsWith('grades')) {
            if(data instanceof Array) {
                for(var i=0; i<data.length; i++) {
                    var obj = ko.mapping.fromJS(data[i], dataMappingOptions3);
                    self.items3.push(obj);
                }
            }
            else {
                var obj = ko.mapping.fromJS(data, dataMappingOptions3);
                self.items3.push(obj);
            }
        }
    };
    self.func = function(callback, collection) {
        $.ajax({
            url: 'http://localhost:9998/service/' + collection,
            headers: {          
                 Accept : "application/json"        
            },    
           dataType: 'json',
           success: function(data) {
               callback(data, collection);
           }
        });
    };
    self.loadItems = function () {
        if(self.items().length === 0) {
            self.func(self.callback, 'students');
        }
    };
    self.loadItems2 = function () {
        if(self.items2().length === 0) {
            self.func(self.callback, 'courses');
        }
    };
    self.loadItems3 = function () {
        self.items3 = ko.observableArray([]);
        self.func(self.callback, 'grades' + self.currentCourseId);
    }
    self.registerNewStudent = function() {   
        var name = $('#new_student_name').val();
        var surname = $('#new_student_surname').val();
        var date = $('#new_student_date').val();
        $('#new_student_name').val('');
        $('#new_student_surname').val('');
        $('#new_student_date').val('');
        var formData = JSON.stringify({"name":name, "surname":surname, "date":date});
        $.ajax({
            url: 'http://localhost:9998/service/students',
            method: 'POST',
            contentType: 'application/json',
            data: formData
        })
        .done( function(data, textStatus, jqXHR) { 
                var location = jqXHR.getResponseHeader('Location');
                self.addNewItemToArray(location, 'students');
        });
    };
    self.registerNewCourse = function() {   
        var name = $('#new_course_name').val();
        var professor = $('#new_course_professor').val();
        $('#new_course_name').val('');
        $('#new_course_professor').val('');
        var formData = JSON.stringify({"name":name, "professor":professor});
        $.ajax({
            url: 'http://localhost:9998/service/courses',
            method: 'POST',
            contentType: 'application/json',
            data: formData
        })
        .done( function(data, textStatus, jqXHR) { 
                var location = jqXHR.getResponseHeader('Location');
                self.addNewItemToArray(location, 'courses');
        });
    };
    self.registerNewGrade = function() {   
        var mark = $('#new_grade_mark').val();
        var date = $('#new_grade_date').val();
        var student  = self.selectedStudent().index;
        $('#new_grade_mark').val('');
        $('#new_grade_date').val('');
        var formData = JSON.stringify({"mark":mark, "date":date});
        $.ajax({
            url: 'http://localhost:9998/service/grades/' + self.currentCourseId + '/' + student,
            method: 'POST',
            contentType: 'application/json',
            data: formData
        })
        .done( function(data, textStatus, jqXHR) { 
                var location = jqXHR.getResponseHeader('Location');
                self.addNewItemToArray(location, 'grades');
        });
    };
    self.addNewItemToArray = function(location, collection) {
        $.ajax({
            url: location,
            headers: {          
                 Accept : "application/json"        
            },    
           dataType: 'json',
           success: function(data) {
               self.callback(data, collection);
           }
        });
    };
    self.deleteStudent = function() {
        self.items.remove(this);
    }
    self.deleteCourse = function() {
        self.items2.remove(this);
    };
    self.currentCourseName = '';
    self.currentCourseId = '';
    self.seeGrades = function() {
        self.currentCourseId = this.id;
        self.currentCourseName = this.name();
        $('#art1').hide();
        $('#art2').hide();
        $('#art3').show('slow');
    }
    self.selectedStudent = ko.observable();
};

ko.applyBindings(new studentListModel() );

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