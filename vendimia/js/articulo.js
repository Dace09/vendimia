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
        $('#tabla, #editar, #vacio11, #vacio22, #vacio33, #vacio44').css('display','none');
        $('#descripcion-editar, #modelo-editar, #precio-editar, #existencia-editar').val('');
    });

    $('#descripcion, #descripcion-editar').keypress(function(){
        $('#vacio1, #vacio11').css("display","none");
    });
    $('#modelo, #modelo-editar').keypress(function(){
        $('#vacio2, #vacio22').css("display","none");
    });
    $('#precio, #precio-editar').keypress(function(e){
        $('#vacio3, #vacio33').css("display","none");
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
                if (decimal > 3) {
                    return false;
                }
            }

            return e.keyCode >= 48 && e.keyCode <= 57;
        } 
    });
    $('#existencia, #existencia-editar').keypress(function(e){
        $('#vacio4, #vacio44').css("display","none");
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            return true;
        } else {
            return false;
        }
    });

    $('#modal-accept').click(function(){
        $('#modal-pregunta').modal('hide');
        $('#tabla').css('display','block');
        $('#alta, #editar, #vacio1, #vacio2, #vacio3, #vacio4, \
           #vacio11, #vacio22, #vacio33, #vacio44').css('display','none');
        $('#descripcion, #modelo, #precio, #existencia').val('');
        $('#descripcion-editar, #modelo-editar, #precio-editar, #existencia-editar').val('');
    }); 
    $('#modal-cancel').click(function(){
        $('#modal-pregunta').modal('hide');
    }); 

    /* clave para el registro de productos */
    function clave() {
        $.get('php/articulos.php?funcion=1', function (data) {
            $('#men').text('Bien Hecho. El Articulo con la clave: '+data+' ha sido registrado correctamente');
        })
    }

    /* Llenado de tabla */
    function table(){
        var url = 'php/articulos.php?funcion=2';
        $.getJSON(url, function(datos){
            $.each(datos, function(i,response){
                var newRow =
                '<tr>'
                +'<td>'+response.clave+'</td>'
                +'<td>'+response.descripcion+'<a href=\'#\' id='+response.clave+' class=\'editar\'><img src=\'img/editar.png\'></td>'
                +'</tr>';
                $(newRow).appendTo('#cuerpo');
            })
        }) 
    }
    window.onload = table();

    /* Alta de articulos */
    $('#form').on('submit', function(event) {
        event.preventDefault();
        var descripcion = $('#descripcion').val();
        var modelo = $('#modelo').val();
        var precio = $('#precio').val();
        var existencia = $('#existencia').val();
        if (descripcion == "")
            $('#vacio1').css("display","block");
        if (modelo == "") 
            $('#vacio2').css("display","block");
        if (precio == "") 
            $('#vacio3').css("display","block");
        if (existencia == "") 
            $('#vacio4').css("display","block");
        else if (descripcion != "" && modelo != "" && precio != "" && existencia != "") {
            $.ajax({
                url: 'php/articulos.php?funcion=3',
                method: 'POST',
                data: $(this).serialize(),
                beforeSend: function () {
                    $('#modal-carga').modal();
                }
            })
            .done(function(response) {
                console.log("success");
                $('#modal-carga').modal('hide');
                $('#cuerpo').empty();
                clave();
                table();
                $('#descripcion,#modelo,#precio,#existencia').val("");
                $('#alta').css('display','none');
                $('#tabla').css('display','block');
                $('#mensaje').css('display','block').html('<div class="alert alert-success" role="alert"><span><strong id="men"></strong></span></div>');
                $('#mensaje').slideDown('slow');
                setTimeout(function () {
                    $('#mensaje').slideUp('slow');
                },2000);
            })
        } 
    });

    //Boton editar articulos
    $(document).on('click','a.editar',function(event) { 
        event.preventDefault();
        var clave = $(this).attr('id');
        $("#tabla").css('display','none');
        $('#editar').css('display','block');
        var url = 'php/articulos.php?funcion=4&clave='+clave;
        $.getJSON(url, function(datos){
            $.each(datos, function(i,response){
                $('.id').text(response.clave);
                $('#descripcion-editar').val(response.descripcion);
                $('#modelo-editar').val(response.modelo);
                $('#precio-editar').val(response.precio);
                $('#existencia-editar').val(response.existencia);
            })
        }) 
    });

    /* Editar Articulos */
    $('#form-editar').on('submit',function (e) {
        e.preventDefault();
        var descripcion = $('#descripcion-editar').val();
        var modelo = $('#modelo-editar').val();
        var precio = $('#precio-editar').val();
        var existencia = $('#existencia-editar').val();
        var clave = $('.id').text();
        if (descripcion == "")
            $('#vacio11').css("display","block");
        if (modelo == "") 
            $('#vacio22').css("display","block");
        if (precio == "") 
            $('#vacio33').css("display","block");
        if (existencia == "") 
            $('#vacio44').css("display","block");
        else if(descripcion != "" && modelo != "" && precio != "" && existencia != ""){
            $.ajax({
                url: 'php/articulos.php?funcion=5&clave='+clave,
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
                $('#editar').css('display','none');
                $('#tabla').css('display','block');
                $('#mensaje').css('display','block').html('<div class="alert alert-success" role="alert"><span><strong>"Bien Hecho. El Articulo con la clave: '+clave+' ha sido Editado correctamente"</strong></span></div>');
                $('#mensaje').slideDown('slow');
                setTimeout(function () {
                    $('#mensaje').slideUp('slow');
                },2000);
            })
        }
    });
}); 