var noInteracts = document.getElementsByClassName('disabled');
[].map.call(noInteracts, function(elem) {
    elem.addEventListener("keydown", function(e) {
        if (e.keyCode != 9) {
            e.returnValue = false;
            return false;
        }
    }, true);
});
