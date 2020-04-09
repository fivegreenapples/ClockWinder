App = angular.module('myApp', [])


App.controller("mainCtrl", [
    "$scope",
	"$http",
	"$interval",
    function($scope, $http, $interval) {

		var timeOrigin = null;
		var speedfactor=50;
		var run = false;

		var lastTS = null;

		function tick(timestamp) {
			window.requestAnimationFrame(tick);
			if (timeOrigin === null) timeOrigin = timestamp;
			if (lastTS === null) {
				lastTS = timestamp;
				return;
			}

			var timeDiffMilliseconds = timestamp - lastTS;
			var timeDiffSeconds = timeDiffMilliseconds/1000;

			// Calculate weight
			if ($scope.weight.blocked) {
				// weight drop doesn't change.
				// vel goes to zero
				$scope.weight.velocity = 0;
			} else {
				// calc force on weight
				var forceG = $scope.weight.mass * 9.8;
				var forceFriction = $scope.weight.frictionConst + ($scope.weight.velocity * $scope.weight.velocity * $scope.weight.friction);

				var overallForce = forceG - forceFriction; // acts down
				var accel = overallForce / $scope.weight.mass;
				var velDelta = accel * timeDiffSeconds;
				var posDelta = ($scope.weight.velocity * timeDiffSeconds) + (0.5 * accel * timeDiffSeconds * timeDiffSeconds); //ut +0.5at^s
				$scope.weight.velocity += velDelta;
				// posDelta is in metres
				// ben's screen is roughly 0.18m per 800 logical pixels == 800/0.18 pixels per m == 4444ppm
				deltaAngle("weightDrop", posDelta * 1);
				// deltaAngle("weightDrop", posDelta );
				// if ($scope.angles.weightDrop > 4000) {
				// 	$scope.weight.blocked = true;
				// }
			}

			// calculate deadbeat
			var timeSince = timestamp - timeOrigin;
			var swing = 15;
			var beatPortion = (timeSince % 2000) / 2000;
			var angle;
			if (beatPortion < 0.5) {
				angle = 2 * beatPortion * swing;
			} else {
				angle = 2 * (1-beatPortion) * swing;
			}
			var angleProportion = angle/swing
			angleProportion2 = (-Math.cos(angleProportion *  Math.PI) + 1)/2
			angle = angleProportion2 * swing
			angle = angle-(swing/2);
			setAngle("deadbeat", angle);
			if (angle < -3) {
				$scope.weight.shouldBlock = "l"; /// TRY SHOULD BLOCK
			} else if (angle > 3.5 ) {
				$scope.weight.shouldBlock = "r"; /// TRY SHOULD BLOCK
			} else {
				$scope.weight.shouldBlock = false;
				$scope.weight.blocked = false;
			}



			// // setAngle("second", 3 * Math.round((6 * speedfactor * timeSince/1000) / 3));
			// // setAngle("second", (6 * speedfactor * timeSince/1000));

			lastTS = timestamp;
			$scope.$digest();
		}

		$scope.seethrough = false
		$scope.showSeconds = 1;
		$scope.weight = {
			frictionConst: 500, 
			friction: 10, 
			mass:100,
			blocked:true,
			velocity:0,
			shouldBlock:false
		}
		$scope.angles = {
			second:0,//(now.getSeconds()/60) * 360,
			minute:0,//((now.getMinutes() + now.getSeconds()/60)/60) * 360,
			hour:0,//(now.getHours() + (now.getMinutes()/60) + (now.getSeconds()/3600)) * 360/12,
			cog1:0,
			cog2:0,//((now.getMinutes() + now.getSeconds()/60)/60) * 360,
			cog3:0,
			cog4:0,//(now.getHours() + (now.getMinutes()/60) + (now.getSeconds()/3600)) * 360/12,
			cog5:0,
			cog6:0,
			bobbin:0,
			deadbeat:0,

			weightDrop:0,
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

		onAngleChange("weightDrop", function(drop, delta) {
			deltaAngle("bobbin", -delta * 360 / (2*Math.PI*86))
		});
		onAngleChange("bobbin", function(drop, delta) {
			deltaAngle("cog2", delta * -50/90)
		});
		onAngleChange("cog2", function(angle, delta) {
			setAngle("minute", angle)
			deltaAngle("cog3", delta * -10/30)
			deltaAngle("cog1", delta * -90/8)
		})
		onAngleChange("cog3", function(angle, delta) {
			deltaAngle("cog4", delta * -8/32)
		})
		onAngleChange("cog4", function(angle, delta) {
			setAngle("hour", angle)
		})
		onAngleChange("cog1", function(angle, delta) {
			var secondDelta = delta * -64/12
			if ($scope.weight.shouldBlock) {
				var offset = $scope.weight.shouldBlock == "l" ? 0 : 3
				var currentStep = Math.floor((($scope.angles.second)) / 6);
				var result = $scope.angles.second + secondDelta;
				var nowStep = Math.floor(((result)) / 6);
				if (nowStep != currentStep) {
					var actualAngle = (nowStep * 6);
					var actualDelta = actualAngle - $scope.angles.second;
					var diff = secondDelta - actualDelta;
					setAngle("second", actualAngle%360)


					// Fix/fudge gear train
					$scope.angles.cog1 += -diff * -12/64
					$scope.angles.cog2 += -diff * -12/64 * -8/90
					$scope.angles.minute += -diff * -12/64 * -8/90
					$scope.angles.cog3 += -diff * -12/64 * -8/90 * -10/30
					$scope.angles.cog4 += -diff * -12/64 * -8/90 * -10/30 * -8/32
					$scope.angles.hour += -diff * -12/64 * -8/90 * -10/30 * -8/32


					$scope.weight.blocked = true;
				} else {
					deltaAngle("second", secondDelta)
					
				}
				
			} else {
				deltaAngle("second", secondDelta)
			}
		})
		onAngleChange("second", function(angle, delta) {
			deltaAngle("cog5", delta * -50/70)
		})
		onAngleChange("cog5", function(angle, delta) {
			deltaAngle("cog6", delta * -70/50)
		})
		var now = new Date();
		// calc deltaminute angle? bobbin? is deadbeat blocked.

		window.requestAnimationFrame(tick);

	}
])



