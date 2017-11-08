$(function () {
    $('#menu').hover(function() {
        $(this).css({backgroundColor: '#000'});
    }, function() {
        $(this).css({backgroundColor: '#222'});
    });

    var f = new Date();
    var fecha = f.toLocaleDateString();
    $('#fecha').text('Fecha: ' + fecha);
})