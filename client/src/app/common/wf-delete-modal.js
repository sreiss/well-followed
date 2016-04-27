/**
 * A generic confirmation modal to show before deleting an item.
 */
angular.module('wellFollowed').directive('wfDeleteModal', function() {
    return {
        restrict: 'E',
        templateUrl: 'common/wf-delete-modal.html',
        scope: {
            close: '=',
            cancel: '&'
        },
        link: function(scope, element, attributes) {

        }
    };
});