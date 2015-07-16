/// <reference path="../typings/angularjs/angular.d.ts" />

import {core} from "./core/core";



angular.module('app',[])
	.controller(AppCtrl)


core();

class AppCtrl {
	constructor($http: ng.IHttpService) {

		$http

	}
}
