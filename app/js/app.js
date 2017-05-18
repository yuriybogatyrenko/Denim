var YOURAPPNAME = (function () {

    function YOURAPPNAME(doc) {
        var _self = this;

        _self.doc = doc;
        _self.window = window;
        _self.html = _self.doc.querySelector('html');
        _self.body = _self.doc.body;
        _self.location = location;
        _self.hash = location.hash;
        _self.Object = Object;
        _self.scrollWidth = 0;

        _self.bootstrap();
    }

    YOURAPPNAME.prototype.bootstrap = function () {
        var _self = this;

        // Initialize window scollBar width
        _self.scrollWidth = _self.scrollBarWidth();
    };

    // Window load types (loading, dom, full)
    YOURAPPNAME.prototype.appLoad = function (type, callback) {
        var _self = this;

        switch (type) {
            case 'loading':
                if (_self.doc.readyState === 'loading') callback();

                break;
            case 'dom':
                _self.doc.onreadystatechange = function () {
                    if (_self.doc.readyState === 'complete') callback();
                };

                break;
            case 'full':
                _self.window.onload = function (e) {
                    callback(e);
                };

                break;
            default:
                callback();
        }
    };

    // Detect scroll default scrollBar width (return a number)
    YOURAPPNAME.prototype.scrollBarWidth = function () {
        var _self = this,
            outer = _self.doc.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";

        _self.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;

        outer.style.overflow = "scroll";

        var inner = _self.doc.createElement("div");

        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };

    YOURAPPNAME.prototype.initSwitcher = function () {
        var _self = this;

        var switchers = _self.doc.querySelectorAll('[data-switcher]');

        if (switchers && switchers.length > 0) {
            for (var i = 0; i < switchers.length; i++) {
                var switcher = switchers[i],
                    switcherOptions = _self.options(switcher.dataset.switcher),
                    switcherElems = switcher.children,
                    switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children;

                for (var y = 0; y < switcherElems.length; y++) {
                    var switcherElem = switcherElems[y],
                        parentNode = switcher.children,
                        switcherTarget = switcherTargets[y];

                    if (switcherElem.classList.contains('active')) {
                        for (var z = 0; z < parentNode.length; z++) {
                            parentNode[z].classList.remove('active');
                            switcherTargets[z].classList.remove('active');
                        }
                        switcherElem.classList.add('active');
                        switcherTarget.classList.add('active');
                    }

                    switcherElem.children[0].addEventListener('click', function (elem, target, parent, targets) {
                        return function (e) {
                            e.preventDefault();
                            if (!elem.classList.contains('active')) {
                                for (var z = 0; z < parentNode.length; z++) {
                                    parent[z].classList.remove('active');
                                    targets[z].classList.remove('active');
                                }
                                elem.classList.add('active');
                                target.classList.add('active');
                            }
                        };

                    }(switcherElem, switcherTarget, parentNode, switcherTargets));
                }
            }
        }
    };

    YOURAPPNAME.prototype.str2json = function (str, notevil) {
        try {
            if (notevil) {
                return JSON.parse(str
                    .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                        return '"' + $1 + '":';
                    })
                    .replace(/'([^']+)'/g, function (_, $1) {
                        return '"' + $1 + '"';
                    })
                );
            } else {
                return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
            }
        } catch (e) {
            return false;
        }
    };

    YOURAPPNAME.prototype.options = function (string) {
        var _self = this;

        if (typeof string != 'string') return string;

        if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
            string = '{' + string + '}';
        }

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = _self.str2json(string.substr(start));
            } catch (e) {
            }
        }

        return options;
    };

    YOURAPPNAME.prototype.popups = function (options) {
        var _self = this;

        var defaults = {
            reachElementClass: '.js-popup',
            closePopupClass: '.js-close-popup',
            currentElementClass: '.js-open-popup',
            changePopupClass: '.js-change-popup'
        };

        options = $.extend({}, options, defaults);

        var plugin = {
            reachPopups: $(options.reachElementClass),
            bodyEl: $('body'),
            topPanelEl: $('.top-panel-wrapper'),
            htmlEl: $('html'),
            closePopupEl: $(options.closePopupClass),
            openPopupEl: $(options.currentElementClass),
            changePopupEl: $(options.changePopupClass),
            bodyPos: 0
        };

        plugin.openPopup = function (popupName) {
            plugin.closePopup($('.js-popup.opened').attr('data-popup'));
            var popup = plugin.reachPopups.filter('[data-popup="' + popupName + '"]');
            popup.addClass('opened');
            if (!popup.hasClass('js-small-popup')) {
                plugin.bodyEl.css('overflow-y', 'scroll');
                // plugin.topPanelEl.css('padding-right', scrollSettings.width);
                plugin.htmlEl.addClass('popup-opened');
            }
        };

        plugin.closePopup = function (popupName) {
            plugin.reachPopups.filter('[data-popup="' + popupName + '"]').removeClass('opened');
            // setTimeout(function () {
            plugin.bodyEl.css('overflow-y', 'auto');
            plugin.htmlEl.removeClass('popup-opened');
            plugin.topPanelEl.removeAttr('style');
            // }, 500);
        };

        plugin.changePopup = function (closingPopup, openingPopup) {
            plugin.reachPopups.filter('[data-popup="' + closingPopup + '"]').removeClass('opened');
            plugin.reachPopups.filter('[data-popup="' + openingPopup + '"]').addClass('opened');
        };

        plugin.init = function () {
            plugin.bindings();
        };

        plugin.bindings = function () {
            plugin.openPopupEl.on('click', function (e) {
                e.preventDefault();
                var pop = $(this).attr('data-open-popup');
                var popup = plugin.reachPopups.filter('[data-popup="' + pop + '"]');
                if (popup.hasClass('opened'))
                    plugin.closePopup(pop);
                else
                    plugin.openPopup(pop);
            });

            plugin.closePopupEl.on('click', function (e) {
                e.preventDefault();
                var pop;
                if (this.hasAttribute('data-close-popup')) {
                    pop = $(this).attr('data-close-popup');
                } else {
                    pop = $(this).closest(options.reachElementClass).attr('data-popup');
                }

                plugin.closePopup(pop);
            });

            plugin.changePopupEl.on('click', function (e) {
                e.preventDefault();
                var closingPop = $(this).attr('data-closing-popup');
                var openingPop = $(this).attr('data-opening-popup');

                plugin.changePopup(closingPop, openingPop);
            });

            plugin.reachPopups.on('click', function (e) {
                var target = $(e.target);
                var className = options.reachElementClass.replace('.', '');
                if (target.hasClass(className)) {
                    e.preventDefault();
                    plugin.closePopup($(e.target).attr('data-popup'));
                }
            });

            $(document).click(function (e) {
                var target = $(e.target);
                if (
                    !target.hasClass('js-popup')
                    && !target.closest('.js-popup').length > 0
                    && !target.hasClass('js-open-popup')
                    && !target.closest('.js-open-popup').length > 0
                ) {
                    plugin.closePopup($('.js-popup.opened').attr('data-popup'));
                }
            });
        };

        if (options)
            plugin.init();

        return plugin;
    };

    YOURAPPNAME.prototype.selectBox = function (selector) {
        var _self = this;

        var selectBox = {
            init: function () {
                selectBox.bindings();

                $(selector).each(function () {
                    selectBox.update($(this));
                });
            },
            bindings: function () {
                $(selector).on('change', function (e) {
                    e.preventDefault();
                    selectBox.update($(this));
                    $(this).addClass('js-touched')
                    _self.formValidator().checkSelect($(this), $(this).closest('form'));
                });
            },
            update: function (bl) {
                var $this = bl,
                    selectedOpt = $this.find('option:selected'),
                    selectText = selectedOpt.text(),
                    selectWrapper = $this.closest('.js-selectbox-wrapper'),
                    fakeSelect = selectWrapper.find('.js-selectbox-text');

                if (selectText === '') {
                    selectText = $this.data('placeholder');
                    fakeSelect.addClass('support-form__select_placeholder');
                } else {
                    fakeSelect.removeClass('support-form__select_placeholder');
                }

                fakeSelect.text(selectText);
            }
        };

        if (selector)
            selectBox.init();

        return selectBox;
    };

    YOURAPPNAME.prototype.formValidator = function () {
        var validator = {
            checkSelect: function (select, form) {
                if(select.val() === '') {
                    select.next('.js-selectbox-text').addClass('has-error');
                    validator.buttonChange(true, form);
                } else {
                    select.next('.js-selectbox-text').removeClass('has-error');
                    validator.buttonChange(false, form);
                }
            },
            checkInput: function (input, form) {
                if(input.val().length < 3) {
                    input.addClass('has-error');
                    validator.buttonChange(true, form);
                } else {
                    input.removeClass('has-error');
                    validator.buttonChange(false, form);
                }
            },
            buttonChange: function (type, form) {
                var touched = true;

                form.find('input, select').each(function () {
                    if(!$(this).hasClass('js-touched'))
                        touched = false;
                });

                if(touched === false)
                    return;

                var button = form.find('button[type="submit"]');

                if(type){
                    button.addClass("button_gray");
                    button.removeClass("button_persian-green");
                } else {
                    button.removeClass("button_gray");
                    button.addClass("button_persian-green");
                }
            }
        };

        return validator;
    };

    return YOURAPPNAME;

})();

var app = new YOURAPPNAME(document);

app.appLoad('loading', function () {
    // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full
});

app.appLoad('dom', function () {
    // DOM is loaded! Paste your app code here (Pure JS code).
    // Do not use jQuery here cause external libs do not loads here...

    app.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
});

app.appLoad('full', function (e) {
    // App was fully load! Paste external app source code here... 4example if your use jQuery and something else
    // Please do not use jQuery ready state function to avoid mass calling document event trigger!
    app.popups();

    app.selectBox('.js-selectbox');
    // app.formSupportUpdate(".support-form");

    // app.formSupport(".support-form");

    $('input[name="email"]').focusout(function (e) {
        e.preventDefault();
        $(this).addClass('js-touched');
        app.formValidator().checkInput($(this), $(this).closest('form'));
    });

    $('form').on('submit', function (e) {
        e.preventDefault();

        app.formValidator().checkInput($(this).find('input'), $(this));
        app.formValidator().checkSelect($(this).find('select'), $(this));
    });

    (function () {
        $('.screenshots-slider').owlCarousel({
            center: true,
            items: 2,
            startPosition: 1
        });

        $('.alternative-markets-slider').owlCarousel({
            items: 3,
            center: false,
            loop: true,
            startPosition: 1,
            responsive: {
                0: {
                    items: 3,
                    center: true
                },
                /*450: {
                    items: 4
                },
                550: {
                    items: 5
                },
                650: {
                    items: 6
                },
                768: {
                    items: 7
                },*/
            }
        });

    })();

    $('.js-read-more-button').click(function () {

        var readmore = $(this).prev(".read-more"),
            readmoreHide = readmore.children(".read-more__wrapper"),
            readmoreHeight = readmoreHide.height(),
            $this = $(this);

        if (readmore.hasClass("hidden")) {
            readmore.css('height', readmoreHeight);
            setTimeout(function () {
                readmore.removeClass("hidden").css('height','auto');
                $this.addClass("display-none");
            }, 300)
        }
    });
});

$(document).ready(function() {

    var fontSize = $(".container:eq(0)").width()/(22.85*1.2);
    if(fontSize < 14)
        fontSize = 14;
    $('body').css('font-size', fontSize);

    $(window).resize(function() {
        var fontSize = $(".container:eq(0)").width()/(22.85*1.2);
        if(fontSize < 14)
            fontSize = 14;
        $('body').css('font-size', fontSize);
    });

});