// Light Saber
(function () {
    
    var colors =  [
        "rgb(255, 255, 255)",   //white
        "rgb(0, 0, 255)",       //blue 
        "rgb(0, 255, 255)",     //cyan - light blue
        "rgb(255, 165, 0)",     //orange
        "rgb(255, 255, 0)",     //jaune - gold
        "rgb(255, 0, 0)",       //rouge - red
        "rgb(0, 128, 0)",       //vert - green
        "rgb(143, 0, 255)",     //violet
        "rgb(64, 130, 109)"     //viridien - green
    ], LightSaber,
    
        root = this,
        
        oldLightSaber = root.LightSaber;
    
    LightSaber = function (element, delay) {
        
        delay = delay || 5000;
        
        function Saber() {
            setTimeout(function () {
                requestAnimationFrame(Saber);
                var length = colors.length,
                    currentColor = document.querySelector(element).style.color,
                    index = 0;
                for (var i = 0; i < length; i++) {
                    if (colors[i] === currentColor) index = i;
                }
                if (index == length-1) index = -1;
                document.querySelector(element).style.color = colors[index + 1];
            }, delay);
        }
        
        Saber();
    };
    
    // Run LightSaber in noConflict mode, 
    // returning the LightSaber variable to its previous owner. 
    // Returns a reference to the LightSaber object.
    LightSaber.prototype.noConflict = function () {
        root.LightSaber = oldLightSaber;
        return this;
    };
    
	// Register as a named AMD module, since LightSaber can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and LightSaber is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of LightSaber, it will work.
	if (typeof define === "function" && define.amd ) {
		define( "lightSaber", [], function () { 
		    return LightSaber; 
		});
	}
    
    root.LightSaber = LightSaber;
}).call(this);