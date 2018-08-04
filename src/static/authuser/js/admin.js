 var app = angular.module('share',['myhead','ngSanitize']);
		app.config(function($interpolateProvider) {
		  $interpolateProvider.startSymbol('[[');
		  $interpolateProvider.endSymbol(']]');
		});
		app.run(function ($rootScope) {
			$rootScope.page="dog";
		});
		app.factory('app2fac',function () {
			return {
				say:function (name) {
				alert('her name is '+name);
			     }}
		});
		app.directive("autoHide",function ($timeout) {
			return {
			     restrict: 'A',
			     replace: true,
			     scope: {
			       data: '=',
			     },
			     template:"<div ng-bind='data'></div>",
			     link:function (scope, ele, attr) {
				    var timer='';
			     	scope.$watch('data',function (nv,ov) {
						if (nv=='')return
						ele.show();
						if(timer){
							$timeout.cancel(timer);
						}
						timer =$timeout(function () {
							ele.fadeOut(1000,function () {
								scope.data='';
					});
				},6000)
			})
			     }
		     }
		});
		app.directive("leftNavi",function () {
			return {
			     restrict: 'A',
			     replace: true,
			     scope: {
			       items: '=',
			       //click:'&' click='say(name)' click({name:item.link})
			     },
			     template:"<div><div hello></div>"
					 +"<ui><li ng-repeat='item in items' ><a href='' ng-click='item.link(item.name)' >[[item.name]]</a></li></ui>"
			     +"</div>",
		     }
		});

		app.directive('bigTable',function () {
			return {
				restrict:'A',
				replace:false,
				scope:{
					items:'=',
					heads:'=',
				},
				template:'<div> \
<table class="table table-hover">\
<tr><th ng-repeat="head in heads">[[head]]</th></tr>\
<tr ng-repeat="item in items"><td ng-repeat="data in item">[[data]]</td><tr>\
</table>\
				</div>',
			}
		});
		app.directive('formLabel',function ($interpolate) {
			
			return {
				restrict:'EA',
				replace:false,
				transclude:true,
				scope:{
					verbose:'@'
				},
				template:'<div class="form-group"  ng-class="{true:\'has-error\',false:\'has-success\'}[form[name].$invalid]">'+
				'<label class="control-label" >[[verbose]]</label>'+
				'<div ng-transclude></div>'+
				'<span ng-show="form[name].$error.required" style="color:red">*[[verbose]]不能为空</span>'+
				'</div>',
				link:function (scope, ele, attr) {
					scope.form=ele.controller('form');
					input=ele.find('input');
					name = input.attr('name');
					p = scope.$parent;
					tmp = $interpolate(name)
					scope.name=tmp(p);
					label=ele.find('label');
					label.attr('for',name);
					
				},
				
			}
		});

		app.directive('heInput',function ($compile) {
			//<ng-model>
			//[name],[type],[required],[verbose]
			var cont=0;
			return {
				restrict:'EA',
				replace:true,
				require: "ngModel",
				scope:{
					name:'@',
					verbose:'@',
					//type:'@',
					//form:'=',
					//model:'=',
				},
				template:'<div class="form-group"  ng-class="{true:\'has-error\',false:\'has-success\'}[form[name].$invalid]">'+
				'<label class="control-label" for="[[name]]">[[verbose]]</label>'+
				'<span ng-show="form[name].$error.required" style="color:red">*[[verbose]]不能为空</span>'+
				'<input name="[[name]]" class="form-control" >'+
				'</div>',
				link: function (scope, ele, attr,ngModelCtr) {
					
		    //          var formController = elm.controller('form') || {
		    //            $addControl: angular.noop
		    //          };
		    //          formController.$addControl(ngModelCtr);
						//scope.form= ngModelCtr
		    //          scope.$on('$destroy', function() {
		    //            formController.$removeControl(ngModelCtr);
		    		scope.form=ele.controller('form');
		    		input = ele.find('input');
		    		if('required' in attr){
			    		input.attr("required",'');
		    		};
		    		if ('type' in attr){
			    		input.attr('type',attr.type);
		    		}else{
			    		input.attr('type','text');
		    		}
		    		//if('name' in attr){
			    	//	scope.name=attr.name;
		    		//}else{
			    	//	scope.name='name'+cont;
			    	//	cont+=1;
		    		//}
		    		input.attr("ng-model",attr.ngModel)
		    		form= input.closest('form');
		    		//$compile(form.contents())(scope);
		    		//scope.form.$addControl(ngModelCtr);
		    		//scope.invalid=scope.form[scope.name].$invalid;
		    		$compile(ele.contents())(scope);
              },
				
			}
		});
		
		app.directive('myform',function () {
			
			return {
				
				restrict:'A',
				replace:true,
				scope:{
					items:'='
				},
				template:'<form name="myform" novalidate>'
				        +'<div ng-repeat="item in items" class="form-group linespace">'
				        +'<label class="col-md-3" for="[[item.name]]">[[item.label]]</label>'
				        +'<input ng-class="{\'col-md-9\': item.type!=\'radio\'}" style="text-align:left" type="[[item.type]]" name="[[item.name]]"/>'
				        +'</div>'
				        //+'<button type="submit" class="btn btn-default">提交</button>'
				        +'</form>'
			}
		});

		
angular.module('myhead',[])
.factory('app2fac',function () {
	return {
		say:function (name) {
		alert('my name is '+name);
	     }}
})
.directive("bootstrap",function () {
			return {
			     restrict: 'E',
			     replace: true,

			     template:'\t<div><!-- 新 Bootstrap 核心 CSS 文件 -->\
		<link rel=\"stylesheet\" href=\"//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css\">\
		<script src=\"//cdn.bootcss.com/jquery/1.11.3/jquery.min.js\"></script>\
		<script src=\"//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js\"></script>   \
				 </div>'

		     }
		});