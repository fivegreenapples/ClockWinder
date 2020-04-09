App.component("deadbeat:", {

	bindings: {
    radius: "<",
    col: "<",
    left: "<",
    top: "<",
    angle: "<",
    startAngle: "<",
	},

  templateUrl: "components/deadbeat/deadbeat.html",
  
  controller: [
    function() {
      function cartesianFromRadial(radius, angle, biasX, biasY) {
        angle = angle % 360
        if (angle < 0) {
          angle = 360 + angle;
        }

        var l,t;
        var lSign=1,tSign=1;
        if (angle <= 90) {
          tSign = -1;
        } else if (angle <= 180) {
          angle = 180 - angle;
        } else if (angle <= 270) {
          angle = angle - 180;
          lSign = -1;
        } else {
          angle = 360 - angle;
          lSign = -1;
          tSign = -1;
        }

        angle = angle * Math.PI / 180;

        l = radius * Math.sin(angle);
        t = radius * Math.cos(angle);

        return [ l*lSign + biasX, t*tSign + biasY ];
      }

      var $ctrl = this;

      $ctrl.$onInit = function() {

        var outerR = $ctrl.radius;
        var checkR = $ctrl.radius-10;
        var innerR = $ctrl.radius-20;

        var angleA = 100;
        var angleB = 132.4;
        var angleC = 137.9;
        var angleD = 110;
        var angleCR = 132.0;
        var angleBR = 137.5;
        var angleCheck = 135;

        $ctrl.leftA = cartesianFromRadial(outerR, 360-angleA, $ctrl.radius, $ctrl.radius)
        $ctrl.leftB = cartesianFromRadial(outerR, 360-angleB, $ctrl.radius, $ctrl.radius)
        $ctrl.leftC = cartesianFromRadial(innerR, 360-angleC, $ctrl.radius, $ctrl.radius)
        $ctrl.leftD = cartesianFromRadial(innerR, 360-angleD, $ctrl.radius, $ctrl.radius)
        $ctrl.leftCheck = cartesianFromRadial(checkR, 360-angleCheck, $ctrl.radius, $ctrl.radius)

        $ctrl.rightA = cartesianFromRadial(outerR, angleA, $ctrl.radius, $ctrl.radius)
        $ctrl.rightB = cartesianFromRadial(outerR, angleBR, $ctrl.radius, $ctrl.radius)
        $ctrl.rightC = cartesianFromRadial(innerR, angleCR, $ctrl.radius, $ctrl.radius)
        $ctrl.rightD = cartesianFromRadial(innerR, angleD, $ctrl.radius, $ctrl.radius)
        $ctrl.rightCheck = cartesianFromRadial(checkR, angleCheck, $ctrl.radius, $ctrl.radius)

        var data = "M"+$ctrl.radius+","+($ctrl.radius-15);
        data += " L"+$ctrl.leftA[0]+","+$ctrl.leftA[1];
        data += " A"+outerR+","+outerR+",0,0,0,"+$ctrl.leftB[0]+","+$ctrl.leftB[1];
        data += " L"+$ctrl.leftCheck[0]+","+$ctrl.leftCheck[1];
        data += " L"+$ctrl.leftC[0]+","+$ctrl.leftC[1];
        data += " A"+innerR+","+innerR+",0,0,1,"+$ctrl.leftD[0]+","+$ctrl.leftD[1];
        data += " L"+$ctrl.radius+","+($ctrl.radius+15);

        data += " L"+$ctrl.rightD[0]+","+$ctrl.rightD[1];
        data += " A"+innerR+","+innerR+",0,0,1,"+$ctrl.rightC[0]+","+$ctrl.rightC[1];
        data += " L"+$ctrl.rightCheck[0]+","+$ctrl.rightCheck[1];
        data += " L"+$ctrl.rightB[0]+","+$ctrl.rightB[1];
        data += " A"+outerR+","+outerR+",0,0,0,"+$ctrl.rightA[0]+","+$ctrl.rightA[1];

        data += " z";

        $ctrl.data = data;
      }
    }
  ]
});