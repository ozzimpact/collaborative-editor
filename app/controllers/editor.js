'use strict';

app.controller('EditorCtrl', function ($scope) {
  $scope.orightml = '';
  $scope.htmlcontent = $scope.orightml;
  $scope.disabled = false;
});
