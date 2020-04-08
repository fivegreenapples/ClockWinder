App.component("hand:", {

	bindings: {
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