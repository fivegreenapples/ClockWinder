App.component("hand:", {

	bindings: {
		left: "<",
		styl: "<",
		angle: "<",
	},

  templateUrl: "components/hand/hand.html",
  
  controller: [
    function() {
      var $ctrl = this;
      $ctrl.radius = 400;
    }
  ]
});