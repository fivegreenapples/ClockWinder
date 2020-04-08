App = angular.module('myApp', [])


App.controller("mainCtrl", [
    "$scope",
	"$http",
	"$interval",
    function($scope, $http, $interval) {

		var timeOrigin = null;
		var speedfactor=1000;
		var run = false;

		function tick(timestamp) {
			if (timeOrigin === null) timeOrigin = timestamp;

			var timeSince = timestamp - timeOrigin;

			setAngle("second", 3 * Math.round((6 * speedfactor * timeSince/1000) / 3));
			// setAngle("second", (6 * speedfactor * timeSince/1000));

			if (run) {
				window.requestAnimationFrame(tick);
			}
			$scope.$digest();
		}

		$scope.toggleRun = function() {
			run = !run;
			if (run) {
				window.requestAnimationFrame(tick);
			}
		}


		$scope.angles = {
			second:0,
			minute:0,
			hour:0,
			cog1:0,
			cog2:0,
			cog3:0,
			cog4:0,
			cog5:0,
			cog6:0,
		};

		var handlers = {};
		function onAngleChange(what, callback) {
			if (!handlers[what]) {
				handlers[what] = [];
			}
			handlers[what].push(callback);
		}

		function setAngle(what, toAngle) {
			var delta = toAngle - $scope.angles[what];
			$scope.angles[what] = toAngle;
			if (handlers[what]) {
				handlers[what].forEach(function(cb) {
					cb(toAngle, delta);
				})
			}
		}
		function deltaAngle(what, delta) {
			$scope.angles[what] += delta;
			var toAngle = $scope.angles[what]
			if (handlers[what]) {
				handlers[what].forEach(function(cb) {
					cb(toAngle, delta);
				})
			}
		}

		onAngleChange("second", function(angle, delta) {
			deltaAngle("cog1", delta * -12/64)
			deltaAngle("cog5", delta * -50/70)
		})
		onAngleChange("cog5", function(angle, delta) {
			deltaAngle("cog6", delta * -70/50)
		})
		onAngleChange("cog1", function(angle, delta) {
			deltaAngle("cog2", delta * -8/90)
		})
		onAngleChange("cog2", function(angle, delta) {
			setAngle("minute", angle)
			deltaAngle("cog3", delta * -10/30)
		})
		onAngleChange("cog3", function(angle, delta) {
			deltaAngle("cog4", delta * -8/32)
		})
		onAngleChange("cog4", function(angle, delta) {
			setAngle("hour", angle)
		})

	}
])



