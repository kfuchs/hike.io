"use strict";

angular.module("hikeio").
	directive("photoStream", ["$document", "$rootScope", "$timeout", "config", function($document, $rootScope, $timeout, config) {

		var normalImage = "small";
		var biggerImage = "medium";
		var template = "<div class='preview-list'>" +
			"<a href='/hikes/{{hike.string_id}}' data-ng-repeat='hike in hikes'>" +
				"<div class='preview' >" +
					"<div data-ng-class='{\"featured-box\": $first}' >" +
						"<img data-ng-src='" + config.hikeImagesPath + "/{{hike.photo_preview.string_id}}{{ $first && \"-" + biggerImage + "\" || \"-" + normalImage + "\" }}.jpg' alt='{{hike.photo_preview.alt}}'></img>" +
						"<div class='preview-footer'>" +
							"<div>" +
								"<h4 class='preview-title'>{{hike.name}}</h4>" +
								"<h4 class='preview-location'>{{hike.locality}}</h4>" +
							"</div>" +
							"<div>" +
								"<h4 class='preview-distance'>{{hike.distance | distance:\"kilometers\":\"miles\":1}} mi.</h4>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</a>";

		return {
			replace: true,
			scope: {
				hikes: "="
			},
			template: template,
			link: function (scope, element) {
				var gutterWidth = 2;
				var maxColumnWidth = 400;

				scope.$watch("hikes", function(newValue, oldValue) {
					if (newValue.length === 0) return;
					$document.ready(function() {
						$timeout(function() {
							element.imagesLoaded(function(images, proper, broken) {
								element.css("opacity", "1");
								element.masonry({
									itemSelector: ".preview",
									gutterWidth: gutterWidth,
									isAnimated: true,
									columnWidth: function(containerWidth) {
										var boxes = Math.ceil(containerWidth / maxColumnWidth);
										var boxWidth = Math.floor((containerWidth - (boxes - 1) * gutterWidth) / boxes);
										element.find(".preview > div").width(boxWidth);
										if (boxes !== 1) {
											element.find(".preview > .featured-box").width(boxWidth * 2 + gutterWidth);
										}
										return boxWidth;
									}
								});
							});
						});
					});
				}, true);
			}
		};
	}]);