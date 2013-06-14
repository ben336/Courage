/**
# Extensions to Knockout to provide additional behavior
**/


 ko.revertibleObservable = function(initialValue) {
    //private variables
    var result = ko.observable(initialValue);

    result.forEditing = ko.observable(initialValue);

    //if different, commit edit value
    result.commit = function() {
        var editValue = result.forEditing();

        if (editValue !== result()) {
            result(editValue);
        }
    };

    //force subscribers to take original
    result.reset = function() {
        result.forEditing(result());
    };

    return result;
};