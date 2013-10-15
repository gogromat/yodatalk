require.config({
    paths: {
        // AMD
        
        //  Vendor
        jquery: [
            "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
            "//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.1.min",
            "//code.jquery.com/jquery-1.10.1.min",
            "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min",
            "vendor/jquery_1.10.0_min"
        ],
        //RequestAnimationFrame shim
        "requestAnimFrame": [ "vendor/requestAnimFrameShim" ],
        //A++ spec-compliant library "Q"
        q: [
            "vendor/q/q",
            "//cdnjs.cloudflare.com/ajax/libs/q.js/0.9.6/q.min" //wait until 0.9.7
        ],
        
        //  App
        lightSaber:     [ "lightSaber"  ],
        //Teletype - mimics human typing of text
        teletype:       [ "teletype"    ],
        //Progress Bar. Yoda Progress Bar
        yodaProgress:   ["yodaProgress" ],

        // Non-AMD
        //  Vendor
        trip:       [ "vendor/trip.min" ],
        togetherjs: [
            "https://togetherjs.com/togetherjs-min",
            "vendor/together"
        ],
        //Selectoid - JS select box
        selectoid: "vendor/selectoid/lib/selectoid.min",
        
        //  App
        
        //  Language sets
        languages:    "languages",
        
        //  Translators
        //Free google's translator using spreadsheets (author: Stichoza) 
        stichoza: "StichozaTranslator",
        //Free Bing Translator 
        bing:     "BingTranslator",
        //Free MyMemory Translator 
        mymemory: "MyMemoryTranslator",
        //Free google's translator using spreadsheets (author: Sangdol) 
        sangdol:  "SangdolTranslator",
        
        // Object that holds language sets
        yodaLang:     "yodaLanguageSet",
        // HTML Stack
        yodaStack:    "yodaStack",
        //Main SRC file
        yodaTalk:     "yodaTalk",
    },
    shim: {
        
        togetherjs:     { exports: "TogetherJS"                             },
        trip:           { exports: "Trip"              , deps: ["jquery"]   },
        selectoid:      { exports: "Selectoid"         , deps: ["jquery"]   },
        
        stichoza:       { exports: "StichozaTranslator", deps: ["jquery"]   },
        bing:           { exports: "BingTranslator"    , deps: ["jquery"]   },
        mymemory:       { exports: "MyMemoryTranslator", deps: ["jquery"]   },
        sangdol:        { exports: "SangdolTranslator" , deps: ["jquery"]   },
        
        // All languages
        languages:      { exports: "languages"                              },
        yodaLang:       { 
            exports: "YodaLanguageSet", 
            deps:   ["languages", "stichoza", "bing", "mymemory", "sangdol"] 
        },
       
        
        yodaStack:      { 
            exports: "YodaStack",
            deps:   ["jquery", "q", "yodaLang", "teletype", "selectoid"]
        },
        yodaTalk:       {
            deps:   ["jquery", "q", "yodaLang", "yodaStack"]
        },
            
    }
});

// Load Translators
require(["stichoza", "bing", "mymemory", "sangdol"]);

// Load main Yoda Files & Q library
require(["q", "yodaProgress", "yodaLang", "yodaStack", "yodaTalk"]);

require(["teletype", "requestAnimFrame"], function (Teletype) {
    // Activate Teletype and type in Star Wars opening
    Teletype("#preBrand", "A long time ago in a galaxy far, far away....", 10);            
});

// Activate Light Saber
require(["lightSaber", "requestAnimFrame"], function (LightSaber) {
    LightSaber(".color_laser");
});

require(["jquery"], function ($) {
    $(document).ready(function () {
        var TogetherJSConfig_siteName = "YodaSlang",
            TogetherJSConfig_toolName = "Help me out",
            TogetherJSConfig_cloneClicks = $(".change_translation, .translate_button, .add_element, .remove, .selectoid"),
            TogetherJSConfig_findRoom = "yodaslang";
        
        $(".togetherJS").click(function () {
            var self = this;
            // I only need it here
            require(["togetherjs"], function (TogetherJS) {
                $(self).toggleClass("selectedTogether")
                    .children().toggleClass("hidden");
                TogetherJS(self);
            });
            return false;
        });         
    });
});


require(["jquery"], function (Trip) {
    
    $(document).ready(function () {
        
        $(".websiteTour").click(function () {
            // And here, but that's it! :p
            require(["trip"], function (Trip) {
                var trip = trip || new Trip([
                    {
                        sel: $(".websiteTour"),
                        content: 'Welcome to YodaSlang! <br><br> This tour will guide you through the website. <br> Whenever you are ready to proceed on your own, <br> click on the "<b>Esc</b>" key on your keyboard. <br><br> Have a great time!<br><br>',
                        delay: 12000,
                        position: "s",
                        expose: true,
                        nextLabel: "Let's go!"
                    },
                    {
                        sel: $(".togetherJS"),
                        content: 'If you will still have problems after going through this tour, <br> you can ask for assistance by clicking <br> on "Help me out!" button',
                        delay: 9000,
                        position: "s",
                        expose: true
                    },
                    {
                        sel: $(".mainTour"),
                        content: "YodaSlang translates different languages. <br> Because it is a difficult task, the results are not usually very precise. <br> Now it is your time to see why.",
                        delay: 9000,
                        position: "s",
                        expose: true
                    },
                    {
                        sel: $(".languagesTour"),
                        content: "To begin, we start with translations",
                        delay: 5000,
                        position: "n",
                        expose: true
                    },
                    {
                        sel: $(".languagesTour"),
                        content: 'This panel shows a number of translation tools you can use. <br>',
                        position: "n",
                        expose: true,
                        delay: 8000
                    },
                    {
                        sel: $(".change_translation[data-value=stichoza]"),
                        content : 'By default the "Google" is selected for translation,',
                        expose: true,
                        delay: 5000
                    },
                    {
                        sel : $(".change_translation[data-value=bing]"),
                        content : 'but you can always switch to "Bing",',
                        expose: true,
                        delay: 4000
                    },
                    {
                        sel : $(".change_translation[data-value=mymem]"),
                        content : 'or "MyMemory".',
                        expose: true,
                        delay: 4000
                    },
                    {
                        sel: $("#selectoid_0_button"),
                        content: "Just keep in mind to check on the languages as you switch translation tools!",
                        expose: true,
                        position: "e",
                        delay: 5000,
                    },
                    {
                        sel: $("#selectoid_1_button"),
                        content: "Just keep in mind to check on the languages as you switch translation tools!",
                        expose: true,
                        position: "e",
                        delay: 5000,
                    },
                    {
                        sel: $("#selectoid_2_button"),
                        content: "Just keep in mind to check on the languages as you switch translation tools!",
                        expose: true,
                        position: "e",
                        delay: 5000,
                    },
                    {
                        sel: $("#selectoid_0_button"),
                        content: 'Make sure that both input and output languages are the ones you want! <br> In this case we have "English" as input,',
                        position : 'e',
                        expose: true,
                        delay: 8000
                    },
                    {
                        sel: $("#selectoid_3_button"),
                        content: 'and "English" as output.',
                        position : 'e',
                        expose: true,
                        delay: 5500
                    },
                    {
                        sel: $("#selectoid_1_button"),
                        content: "And in the middle the languages should be <br> different from input languages. <br> (<i>otherwise what's the point, right?</i>).",
                        position: "e",
                        expose: true,
                        delay: 10000
                    },
                    {
                        sel: $($(".add_element")[1]),
                        content: 'You can add more translations by clicking on "<span style="color:green;">Add Another</span>" button.',
                        position: 'n',
                        expose: true,
                        delay: 8000
                    },
                    {
                        sel: $($(".remove")[1]),
                        content: 'You can remove translations by clicking on "<span style="color:red;">Remove</span>" button <br> next to the language you want to remove.',
                        position: 'e',
                        expose: true,
                        delay: 9000
                    },
                    {
                        sel: $("#input_text"),
                        content: "Here is where you input your text that is going to be translated.<br> You can change it in any way you like.",
                        position: 'n',
                        expose: true,
                        delay: 8000
                    },
                    {
                        sel: $($(".translate_button")[0]),
                        content: "Whenever you are ready click this button to start translating!",
                        position: "s",
                        expose: true,
                        delay: 8000
                    },
                    {
                        sel: $($(".translate_button")[1]),
                        content: "Or this one at the bottom (<i>they do the same thing</i>).",
                        position: "n",
                        expose: true,
                        delay: 8000
                    },
                    {
                        sel: $($(".social_links")[0]),
                        content: "This was developed by me, GogromaT.",
                        position: "n",
                        expose: true,
                        delay: 5000
                    },
                    {
                        sel: $($(".social_links")[1]),
                        content: "You can check me out on google plus,",
                        expose: true,
                        position: 'n',
                        delay: 6000
                    },
                    {
                        sel: $($(".social_links")[2]),
                        content: "my github page, ",
                        expose: true,
                        position: 'n',
                        delay: 4000
                    },
                    {
                        sel: $($(".social_links")[3]),
                        content: "tweet me, ",
                        expose: true,
                        position: 'n',
                        delay: 3500
                    },
                    {
                        sel: $(".gittip-widget"),
                        content: "or donate to a hungry coder through the GitTip :)",
                        expose: true,
                        position: "n",
                        delay: 7000
                    },
                    {
                        sel: $(".websiteTour"),
                        content: "So have fun, And force be with you!",
                        delay: 8000,
                        position: "s",
                        expose: true
                    }
                ], {
                    tripTheme : "white",
                    backToTopWhenEnded: true,
                    delay: 3000,
                    skipUndefinedTrip: true,
                    //enableKeyBinding: true,
                    showNavigation: true,
                    prevLabel: "Go back",
                    nextLabel: "Got it",
                    finishLabel: "Got it",
                    //canGoPrev: true,
                    //canGoNext: true
                });
                trip.start();
            });
        });
    });
});