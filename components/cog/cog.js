App.component("cog:", {

	bindings: {
    teeth: "<",
    left: "<",
    top: "<",
    angle: "<",
    startAngle: "<",
    col: "<",
	},

  templateUrl: "components/cog/cog.html",
  
  controller: [
    function() {
      var $ctrl = this;

      var toothHeight = 10;
      var toothSlopeFraction = 0.2;
      var toothFlatFraction = (1 - (2*toothSlopeFraction))/2;
      var radiusPerTooth = 2;

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
        var innerRadius = toothRadius - (toothHeight/2);
        var outerRadius = toothRadius + (toothHeight/2);
        var innerInnerRadius = innerRadius - toothHeight;
        $ctrl.innerInnerRadius = innerInnerRadius;

        var anglePerTooth = 360 / $ctrl.teeth;


        var startPos = cartesianFromRadial(innerRadius, 0);
        $ctrl.toothPath = "M"+startPos[0]+","+startPos[1]+" ";

        for(t=0; t<$ctrl.teeth; t++) {

          var startToothAngle = t * anglePerTooth;
          var topLeftAngle = startToothAngle + (anglePerTooth * toothSlopeFraction)
          var topRightAngle = startToothAngle + (anglePerTooth * (toothSlopeFraction + toothFlatFraction))
          var bottomRightAngle = startToothAngle + (anglePerTooth * (toothSlopeFraction + toothFlatFraction + toothSlopeFraction))
          var farBottomRightAngle = startToothAngle + (anglePerTooth * 1)

          var pos;
          pos = cartesianFromRadial(outerRadius, topLeftAngle);
          $ctrl.toothPath += "L"+pos[0]+","+pos[1]+" ";
          pos = cartesianFromRadial(outerRadius, topRightAngle);
          $ctrl.toothPath += "L"+pos[0]+","+pos[1]+" ";
          pos = cartesianFromRadial(innerRadius, bottomRightAngle);
          $ctrl.toothPath += "L"+pos[0]+","+pos[1]+" ";
          pos = cartesianFromRadial(innerRadius, farBottomRightAngle);
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