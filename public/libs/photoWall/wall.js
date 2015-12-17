(function () {
    if (typeof define === 'function' && define.amd) {
        define('PhotoWall', [], function () {
            return PhotoWall;
        });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PhotoWall;
        }
        exports.PhotoWall = PhotoWall;
    } else {
        window['PhotoWall'] = PhotoWall;
    }

    function PhotoWall(container, className) {
        'use strict';
        var isExtandChildren = false;
        var currentelement = null;
        var hGap = 1;
        var hGapChanged = false;
        this.setHGap = function (value) {
            hGap = value;
            hGapChanged = true;
            reDraw(false);
        };
        var vGap = 1;
        var vGapChanged = false;
        this.setVGap = function (value) {
            vGap = value;
            vGapChanged = true;
            reDraw(false);
        };
        var rotate = 5;
        var rotateChanged = false;
        this.setRotate = function (value) {
            rotate = value;
            rotateChanged = true;
            reDraw(false);
        };

        this.layout = function () {
            reDraw(true);
        }

        function reDraw(isInit) {
            var containerWidth = Util.getElementWidth(container) - 30;
            var row = 1;
            iterateChildren();
            var currentRowTotalWidth = 0;
            var totalHeight = 0;
            var containerHeight = 0;
            var numChildren = container.children.length;
            for (var i = 0; i < numChildren; i++) {
                var item = container.children[i];
                transformElement(item, isInit);
                var width = Util.getElementWidth(item);
                var height = Util.getElementHeight(item);
                totalHeight += height;
                item.style.width = width + "px";
                item.style.height = height + "px";
                var w = currentRowTotalWidth + width + hGap;
                if (w < containerWidth) {
                    item.style.left = currentRowTotalWidth + "px";;
                    currentRowTotalWidth = w;
                } else {
                    item.style.left = 0;
                    currentRowTotalWidth = width + hGap;
                    row++;
                }
                var temp_top = (row - 1) * (totalHeight / (i + 1) + vGap);
                item.style.top = temp_top + "px";
                if (i === numChildren - 1) {
                    containerHeight = temp_top + 50 + height;
                }
            }
            rotateChanged = false;
            container.style.height = containerHeight + "px";

        }


        function iterateChildren() {
            if (!isExtandChildren) {
                for (var i = 0; i < container.children.length; i++) {
                    var child = container.children[i];
                    extendsElement(child);
                }
                isExtandChildren = true;
            }
        }

        function transformElement(element, isInit) {
            if ((rotateChanged || isInit) && (rotate || rotate === 0)) {
                element.style.transform = "rotate(" + Util.getRandomRotate(rotate) + ")";
            }
            if (!element.style.zIndex) {
                element.style.zIndex = Math.floor(Math.random() * 5);
            }
        }

        function extendsElement(element) {
            element.classList.add(className);
            element.addEventListener("mouseover", function (e) {
                if (currentelement !== element) {
                    element.style.maxWidth = "300px";
                    element.style.maxHeight = "300px";
                    var oldW = Util.getElementWidth(element);
                    var oldH = Util.getElementHeight(element);
                    var oldzIndex = element.style.zIndex;
                    element.style.width = oldW * 1.2 + "px";
                    element.style.height = oldH * 1.2 + "px";
                    element.style.zIndex = 5;
                    currentelement = element;
                    element.addEventListener("mouseleave", function (e) {
                        if (e.target === element) {
                            element.style.width = oldW + "px";
                            element.style.height = oldH + "px";
                            element.style.zIndex = oldzIndex;
                            currentelement = null;
                        }
                    });

                }
            });
            return element;
        }
    }

    function Util() {
        'use strict';
    }

    Util.getElementWidth = function (element) {
        var width = getComputedStyle(element).width;
        width = width.substr(0, width.length - 2);
        return parseInt(width);
    };

    Util.getElementHeight = function (element) {
        var height = getComputedStyle(element).height;
        height = height.substr(0, height.length - 2);
        return parseInt(height);
    };


    Util.getRandomNumber = function (min, max) {
        if (min >= max) {
            return min;
        }
        return min + Math.random() * (max - min);
    };

    Util.getRandomRotate = function (maxVal) {
        if (maxVal === 0) {
            return "0deg";
        }
        var rotate = Math.random() * maxVal;
        var random = Math.random();
        if (random > 0 && random < 0.4) {
            rotate = '-' + rotate + "deg";
        } else if (random > 0.3 && random < 0.8) {
            rotate = rotate + "deg";
        } else {
            rotate = "0deg";
        }
        return rotate;
    };
})();