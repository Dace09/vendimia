$(function () {
    $('#menu').hover(function() {
        $(this).css({backgroundColor: '#000'});
    }, function() {
        $(this).css({backgroundColor: '#222'});
    });

    var fecha = new Date();
    $('#fecha').text('Fecha: '+fecha.toLocaleDateString());

    $('#modal-accept').click(function(){
        window.location.href = "index.html";
    }); 
    $('#modal-cancel').click(function(){
        $('#modal-pregunta').modal('hide');
    });

    $('#tasa').keypress(function(e){
        var num = $(this).val();
        if(num.indexOf('.') == -1) {
            return e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46;
        } else {
            for (var i = 0; i <= num.length; i++) {
                if (num[0] == '.') {
                    $(this).val('0.');
                }
            }

            if (num.indexOf('.') > 0) {
                var decimal = (num.length + 1) - num.indexOf('.');
                if (decimal > 2) {
                    return false;
                }
            }

            return e.keyCode >= 48 && e.keyCode <= 57;
        }   
    });
    $('#enganche').keypress(function(e){
        if (e.charCode >= 48 && e.charCode <= 57) {
            return true;
        } else {
            return false;
        }
    });

    var incremento = 3;
    for (var i = 3; i <= 12; i+=incremento) {
        var option = '<option>'+i+'</option>';
        $('#plazo').append(option);
    }

    function query() {
        var url = 'php/configuracion.php?funcion=1';
        $.getJSON(url, function(datos){ 
            $.each(datos, function(i,response){
                $('#tasa').val(response.tasa);
                $('#enganche').val(response.enganche);
                $('#plazo').val(response.plazo);
            });
        });
    }
    window.onload = query();
    
    $('#form').on('submit',function (e) {
        e.preventDefault();
        var tasa = $('#tasa').val();
        var enganche = $('#enganche').val();
        var plazo = $('#plazo').val();
        if(tasa == "" && enganche == "" && plazo == ""){
            return false;
        } else {
            $.ajax({
                url: 'php/configuracion.php?funcion=2',
                method: 'POST',
                data: $(this).serialize(),
                beforeSend: function () {
                    $('#modal-carga').modal();
                }
            })
            .done(function (respuesta) {
                $('#modal-carga').modal('hide');
                $('#mensaje').css("display","block").html("<div class=\"alert alert-success\" role=\"alert\"></*span*/><strong>Bien Hecho. La configuracion ha sido realizada</strong></span></div>");
                $('#mensaje').slideDown('slow');
                setTimeout(function () {
                    $('#mensaje').slideUp('slow');
                },2000);
                query();
            })
        }
    });
})