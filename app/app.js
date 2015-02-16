'use strict';

/**
 * @ngdoc overview
 * @name angNewsApp
 * @description
 * # angNewsApp
 *
 * Main module of the application.
 */

var app = angular
  .module('angNewsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'textAngular',
  ]);
 // .constant('FIREBASE_URL', 'https://ozzimpact.firebaseio.com/');

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/editor.html',
      controller: 'EditorCtrl'
    }).when('/signup', {
      templateUrl: 'views/signup.html',
      controller: ''
    }).when('/login', {
      templateUrl: 'views/login.html',
      controller: ''
    })
    .otherwise({
      redirectTo: '/'
    });
});

