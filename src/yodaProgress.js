(function () {

    var root = this;
    
    var getElementId = (function () {
        var incrementingId = 0;
        return function (element) {
            if (!element.id) {
                element.id = "progress_id_" + incrementingId++;
            }
            return element.id;
        };
    }());
      
    var hashCode = function (string) {
        var hash = 0, 
            length = string.length,
            char;
        if (length == 0) return hash;
        for (var i = 0; i < length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    };
      
      
    var getElementUniqueId = function(element) {
        return hashCode(getElementId(element));  
    };
          
    var YodaProgress = function (element) {
    
        if ($.isEmptyObject(element)) return;
        
        var elementId = getElementUniqueId(element);
        
        if (YodaProgress[elementId]) {
            return YodaProgress[elementId];
        } else {
            YodaProgress[elementId] = new ElementProgress($(element));
            return YodaProgress[elementId];
        }
    
    };
          
    var ElementProgress = function (element, options) {
        this.options = {
            element : element,
            progress : 0,
            doneValue : 1,
            isDone : false,
            width: element.parent().width(),
            extraWidth: 120,
            doneCSSRule: {
              "background-image": "url('libs/img/yoda_flipped.png')"
            }
        };
        $.extend(this.options, options);
    };
    
    ElementProgress.prototype.progress = function (progress) {
        var self = this;
        
        if (progress > self.options.progress) {
            // First time, show
            if (self.options.progress == 0) {
                self.options.element.show();
            }
            self.options.progress = progress;
            if (progress >= self.options.doneValue) {
                self.options.progress = self.options.doneValue;
                self.options.isDone = true;
                self.options.element.css(self.options.doneCSSRule);
            }
            self.updateCSSPosition();
        }
    };
    ElementProgress.prototype.updateCSSPosition = function () {
        var self = this;
        self.options.element.css({
            "background-position": self.getPosition() + "px"
        });
    };
    
    ElementProgress.prototype.getPosition = function () {
        return ((this.options.width * this.options.progress)-this.options.extraWidth);
    };
    
    ElementProgress.prototype.reset = function () {
        var self = this;
        self = new ElementProgress(self.options.element);
    };
    
    ElementProgress.prototype.isDone = function () {
        return this.options.isDone;  
    };
    ElementProgress.prototype.toggle = function (action) {
        var action = action || "hide";
        if (action === "hide") {
            this.options.element.hide();
        } else {
            this.options.element.show();
        }
    };
    
    root.YodaProgress = YodaProgress;
})();