$(function () {
    $('#menu').hover(function() {
        $(this).css({backgroundColor: '#000'});
    }, function() {
        $(this).css({backgroundColor: '#222'});
    });

    var fecha = new Date();
    $('#fecha').text('Fecha: '+fecha.toLocaleDateString());

    $('#btn-nuevo').click(function() {
        $('#alta').css('display','block');
        $('#tabla, #editar,#vacio11, #vacio22, #vacio33, #invalido2').css('display','none');
        $('#nombre-editar,#apellidoPat-editar,#apellidoMat-editar,#rfc-editar').val('');
    });

    function letras() {
        if (event.keyCode >= 65 && event.keyCode <= 90 || 
            event.keyCode >= 97 && event.keyCode <= 122 || event.keyCode == 32) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    }

    $('#nombre, #nombre-editar').keypress(function(e){
        $('#vacio1, #vacio11').css("display","none");
        letras();
    });
    $('#apellidoPat, #apellidoPat-editar').keypress(function(e){
        $('#vacio2, #vacio22').css("display","none");
        letras();
    });
    $('#apellidoMat, #apellidoMat-editar').keypress(function(e){
        $('#vacio3, #vacio33').css("display","none");
        letras();
    });
    $('#rfc, #rfc-editar').keypress(function(e){
        $('#invalido, #invalido2').css("display","none");
        var rfc = $(this).val();
        if (rfc.length >= 0 && rfc.length <= 3) {
            return e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122;
        } else if (rfc.length >= 4 && rfc.length <= 9) {
            return e.keyCode >= 48 && e.keyCode <= 57;
        } else if (rfc.length >= 10 && rfc.length <= 12) {
            return e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122 
                   || e.keyCode >= 48 && e.keyCode <= 57;
        } else {
            return false;
        }
    });

    $('#modal-accept').click(function(){
        $('#modal-pregunta').modal('hide');
        $('#tabla').css('display','block');
        $('#alta, #editar, #vacio1, #vacio2, #vacio3, #invalido, \
           #vacio11, #vacio22, #vacio33, #invalido2').css('display','none');
        $('#nombre,#apellidoPat,#apellidoMat,#rfc').val('');
        $('#nombre-editar,#apellidoPat-editar,#apellidoMat-editar,#rfc-editar').val('');
    }); 
    
    $('#modal-cancel').click(function(){
        $('#modal-pregunta').modal('hide');
    });

     /* clave para el registro de clientes */
    function clave() {
        $.get('php/clientes.php?funcion=1', function(data) {
            $('#men').text('Bien Hecho. El cliente con la clave: '+data+' ha sido registrado correctamente');
        });
    }

    /* Llenado de tabla */
    function table(){
        var url = 'php/clientes.php?funcion=2';
        $.getJSON(url, function(datos){
            $.each(datos, function(i,response){
                var newRow =
                '<tr>'
                +'<td>'+response.clave+'</td>'
                +'<td>'+response.nombre+'<a href=\'#\' id='+response.clave+' class=\'editar\'><img src=\'img/editar.png\'></td>'
                +'</tr>';
                $(newRow).appendTo('#cuerpo');
            })
        }) 
    }
    window.onload = table();

    /* Alta de clientes */
    $('#form').on('submit',function (e) {
        e.preventDefault();
        var nombre = $('#nombre').val();
        var apellidoPat = $('#apellidoPat').val();
        var apellidoMat = $('#apellidoMat').val();
        var rfc = $('#rfc').val();
        if (nombre == '')
            $('#vacio1').css('display','block');
        if (apellidoPat == '') 
            $('#vacio2').css('display','block');
        if (apellidoMat == '') 
            $('#vacio3').css('display','block');
        if (rfc == '' || rfc.length < 13) 
            $('#invalido').css('display','block');
        else if(nombre != "" && apellidoPat != "" && apellidoMat != "" && rfc != "" && rfc.length == 13){;
            $.ajax({
                url: 'php/clientes.php?funcion=3',
                method: 'POST',
                data: $(this).serialize(),
                beforeSend: function () {
                    $('#modal-carga').modal();
                }
            })
            .done(function (respuesta) {
                console.log(respuesta);
                $('#modal-carga').modal('hide');
                $('#cuerpo').empty();
                table();
                clave();
                $('#vacio1,#vacio2,#vacio3,#vacio4').css("display","none");
                $('#nombre,#apellidoPat,#apellidoMat,#rfc').val("");
                $('#alta').css('display','none');
                $('#tabla').css('display','block');
                $('#mensaje').css('display','block').html('<div class="alert alert-success" role="alert"><span><strong id="men"></strong></span></div>');
                $('#mensaje').slideDown('slow');
                setTimeout(function () {
                    $('#mensaje').slideUp('slow');
                },1000);
            })
        }
    });

    //Boton editar articulos
    $(document).on('click','a.editar',function(event) { 
        event.preventDefault();
        var clave = $(this).attr('id');
        $("#tabla").css('display','none');
        $('#editar').css('display','block');
        var url = 'php/clientes.php?funcion=4&clave='+clave;
        $.getJSON(url, function(datos){
            $.each(datos, function(i,response){
                $('.id').text(response.clave);
                $('#nombre-editar').val(response.nombre);
                $('#apellidoPat-editar').val(response.apellidoPat);
                $('#apellidoMat-editar').val(response.apellidoMat);
                $('#rfc-editar').val(response.rfc);
            })
        }) 
    });

    /* Editar clientes */
    $('#form-editar').on('submit',function (e) {
        e.preventDefault();
        var nombre = $('#nombre-editar').val();
        var apellidoPat = $('#apellidoPat-editar').val();
        var apellidoMat = $('#apellidoMat-editar').val();
        var rfc = $('#rfc-editar').val();
        var clave = $('.id').text();
        if (nombre == '')
            $('#vacio11').css('display','block');
        if (apellidoPat == '') 
            $('#vacio22').css('display','block');
        if (apellidoMat == '') 
            $('#vacio33').css('display','block');
        if (rfc == '' || rfc.length < 13) 
            $('#invalido2').css('display','block');
        else if(nombre != "" && apellidoPat != "" && apellidoMat != "" && rfc != "" && rfc.length == 13){
            $.ajax({
                url: 'php/clientes.php?funcion=5&clave='+clave,
                method: 'POST',
                data: $(this).serialize(),
                beforeSend: function () {
                    $('#modal-carga').modal();
                }
            })
            .done(function (respuesta) {
                console.log("success");
                $('#modal-carga').modal('hide');
                $('#cuerpo').empty();
                table();
                $('#nombre-editar,#apellidoPat,#apellidoMat,#rfc').val("");
                $('#editar').css('display','none');
                $('#tabla').css('display','block');
                $('#mensaje').css('display','block').html('<div class="alert alert-success" role="alert"><span><strong>"Bien Hecho. El cliente con la clave: '+clave+' ha sido Editado correctamente"</strong></span></div>');
                $('#mensaje').slideDown('slow');
                setTimeout(function () {
                    $('#mensaje').slideUp('slow');
                },2000);
            })
        }
    });
});