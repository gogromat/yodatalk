// Simple wrapper for languages
(function () {
    
    var root = this;
    
    var YodaLanguageSet = function () {
        this.languages = root.Languages;
        this.current;
        this.currentFormat;
        this.currentTranslator;
        return this;
    };
    
    YodaLanguageSet.prototype.setLanguageSet = function (abbreviation) {
        var lang_abbr = abbreviation;
        
        if (abbreviation === "bing") {
            lang_abbr = "bt";
            this.currentFormat = function (el) {
                return {
                    name: el.name,
                    value: el.abbreviation.bt
                };
            };
            this.currentTranslator = new root.BingTranslator();
        } else if (abbreviation === "google" || abbreviation === "sangdol") {
            lang_abbr = "gt";
            this.currentFormat = function (el) {
                return {
                    name: el.name,
                    value: el.abbreviation.gt
                };
            };
            this.currentTranslator = new root.SangdolTranslator(); 
        }
        
        if (this[abbreviation] == null) this[abbreviation] = this.languages.getByAbbreviation(lang_abbr);
        this.current = this[abbreviation];
        return this.current;
    };
    
    YodaLanguageSet.prototype.getCurrentTranslator = function () {
        return this.currentTranslator;  
    };
    
    
    var YodaCurrentLanguageSet = new YodaLanguageSet();
    // Set bing for now
    YodaCurrentLanguageSet.setLanguageSet("bing");
    
    root.YodaCurrentLanguageSet = YodaCurrentLanguageSet;
    
}).call(this);
