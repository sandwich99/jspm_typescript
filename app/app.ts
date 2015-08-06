import core from "./core/core";
import angular from "angular";

import {Table} from "component";


angular.module('app',[])
	.controller(AppCtrl)


core();

class AppCtrl {
	constructor($http: ng.IHttpService) {


	}
}

console.debug(+ new Date() + "");
console.debug("32423");


Table()
