/**
 * Filter to show the full name of a given user.
 */
angular.module('wellFollowed').filter('wfFullContactFilter', function() {
    return function(input) {
        var fullContact = '';
        if (input.firstName && input.lastName) {
            fullContact += input.firstName + ' ' + input.lastName;
        } else {
            fullContact += input.username;
        }
        fullContact += ' <' + input.email + '>';

        return fullContact;
    };
});