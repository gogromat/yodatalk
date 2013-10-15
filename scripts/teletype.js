// Chrome, Firefox, Opera 12+, IE 8+ (7 has no querySelector)
(function () {
    
    var root = this,
    
        oldTeletype = root.Teletype,
        
        // Will type in 'element' the 'text' with 'fps'.
        // Will 'redraw' the div by default as well as call
        // 'userFunction' on every iteration (status update)
        
        // The 0..100% status can be found with  parseFloat((index + 1) / length).toFixed(2) in 'userDefined'
        // function that accepts arguments 'index' and 'length'
        
        Teletype = function (element, text, fps, redraw, userFunction, undefined) {
        
            var el = (typeof element === "object" ? element : document.querySelector(element)),
                div = document.createElement('div'),
                innerText = document.body.textContent ? "textContent" : "innerText",
                letter = 0, 
                startAt = 0,
                length = text.length;
                
            fps = 1000 / (fps || 10);
            redraw = (redraw !== undefined ? redraw : true);
            
            function typeLetter() {
                
                if (letter < length) {
                    
                    setTimeout(function () {
                    
                        requestAnimationFrame(typeLetter);
                        div[innerText] += text[letter];
                        el.appendChild(div);
                        if (redraw && letter == length-1) el[innerText] = div[innerText];
                        if (userFunction) userFunction.call(undefined, letter, length);
                        letter++;
                        
                    }, fps);
                }
            }
            
            typeLetter();
        
        };
    
    // Run Teletype in noConflict mode, 
    // returning the Teletype variable to its previous owner. 
    // Returns a reference to the Teletype object.
    Teletype.prototype.noConflict = function () {
        root.Teletype = oldTeletype;
        return this;
    };
    
	// Register as a named AMD module, since Teletype can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and Teletype is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of Teletype, it will work.
	if ( typeof define === "function" && define.amd ) {
		define("teletype", [], function () { 
		    return Teletype; 
		});
	}
    
    root.Teletype = Teletype;
    
}).call(this);