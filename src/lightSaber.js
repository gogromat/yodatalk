// Light Saber
(function ($) {
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
        //document.querySelectorAll(".color_laser").each ... style["color"]="red"
        this.delay = delay || 5000;
        this.element = element;
        this.start(element, delay || 5000);
    };
    
    LightSaber.prototype.start = function () {
        setTimeout(function () {
            requestAnimationFrame(start);
            var length = colors.length,
                currentColor = $(element).css("color"),
                index = 0;
            for (var i = 0; i < length; i++) {
                if (colors[i] === currentColor) index = i;
            }
            if (index == length-1) index = -1;
            $(element).css("color", colors[index+1]);
        }, delay);
    }
    
    // Run LightSaber in noConflict mode, 
    // returning the LightSaber variable to its previous owner. 
    // Returns a reference to the LightSaber object.
    LightSaber.prototype.noConflict = function () {
        root.LightSaber = oldLightSaber;
        return this;
    };
    
    
    root.LightSaber = LightSaber;
}).call(this, jQuery);