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
        root = this;
    
    LightSaber = function (element) {
        //document.querySelectorAll(".color_laser").each ... style["color"]="red"
        setInterval(function () {
            var length = colors.length,
                currentColor = $(element).css("color"),
                index = 0;
            for (var i = 0; i < length; i++) {
                if (colors[i] === currentColor) index = i;
            }
            if (index == length-1) index = -1;
            $(element).css("color", colors[index+1]);
        }, 5000);            
    }
    
    root.LightSaber = LightSaber;
})();