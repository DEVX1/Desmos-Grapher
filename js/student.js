$( document ).ready ( function () {
    // Calculator definition
    var elt           = document.getElementById('calculator');
    var calculator    = Desmos.Calculator(elt,{expressions:1,zoomButtons:1,lockViewport:0,solutions:1});
});