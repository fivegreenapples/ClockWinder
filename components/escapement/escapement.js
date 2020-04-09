App.component("escapement:", {

	bindings: {
    teeth: "<",
    left: "<",
    top: "<",
    angle: "<",
    startAngle: "<",
    col: "<",
	},

  templateUrl: "components/escapement/escapement.html",
  
  controller: [
    function() {
      var $ctrl = this;

      var toothHeight = 50;
      var toothSlopeFraction = 0.2;
      var toothFlatFraction = (1 - (2*toothSlopeFraction))/2;
      var radiusPerTooth = 6;

      function cartesianFromRadial(radius, angle) {
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

        return [ l*lSign, t*tSign ];
      }

      $ctrl.toothPath = "";

      $ctrl.$onInit = function() {
        var toothRadius = $ctrl.teeth * radiusPerTooth;
        var outerRadius = toothRadius + toothHeight;
        var innerInnerRadius = toothRadius - (toothHeight/2.5);
        $ctrl.innerInnerRadius = innerInnerRadius;

        var anglePerTooth = 360 / $ctrl.teeth;


        var startPos = cartesianFromRadial(toothRadius, 0);
        $ctrl.toothPath = "M"+startPos[0]+","+startPos[1]+" ";

        for(t=0; t<$ctrl.teeth; t++) {

          var startToothAngle = t * anglePerTooth;
          var topAngle = startToothAngle + (anglePerTooth * 0.65)
          var rightAngle = startToothAngle + (anglePerTooth * 0.45)
          var farBottomRightAngle = startToothAngle + (anglePerTooth * 1)

          var pos;
          pos = cartesianFromRadial(outerRadius, topAngle);
          $ctrl.toothPath += "L"+pos[0]+","+pos[1]+" ";
          pos = cartesianFromRadial(toothRadius, rightAngle);
          $ctrl.toothPath += "L"+pos[0]+","+pos[1]+" ";
          pos = cartesianFromRadial(toothRadius, farBottomRightAngle);
          $ctrl.toothPath += "L"+pos[0]+","+pos[1]+" ";

        }
        $ctrl.toothPath += " z"

        $ctrl.toothPath += " M0,"+innerInnerRadius+" ";
        $ctrl.toothPath += " a"+innerInnerRadius+","+innerInnerRadius+",0,1,0,-0.0001,0 "
        $ctrl.toothPath += " z"

        $ctrl.radius = outerRadius;


      };


    }
  ]
});