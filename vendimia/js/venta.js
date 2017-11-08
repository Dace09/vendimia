$(function () {
    $('#menu').hover(function() {
        $(this).css({backgroundColor: '#000'});
    }, function() {
        $(this).css({backgroundColor: '#222'});
    });

    var f = new Date();
    var fecha = f.toLocaleDateString();
    $('#fecha').text('Fecha: ' + fecha);

    $('#btn-nuevo').click(function() {
        $('#alta').css('display','block');
        $('#tabla').css('display','none');
    });

    $('#cliente').keyup(function(e){
       	$('.label-cliente').css('display','none');
		if (e.keyCode == 8) {
			$('.label-rfc').css('display','none');
		}
	}); 

	$('#cliente').keypress(function(e) {
		if (e.keyCode >= 65 && e.keyCode <= 90 ||
         e.keyCode >= 97 && e.keyCode <= 122 || e.keyCode == 32) {
            return true;
        } else {
            return false;
        }
	});

    $('#articulo').keypress(function(){
		$('.label-vacio').css('display','none');
	});

    $('#modal-accept').click(function(){
    	window.location.href = 'ventas.html';
    });
    $('#modal-cancel').click(function(){
        $('#modal-pregunta').modal('hide');
    });

    /* clave para el registro de ventas */
    function clave() {
        $.get('php/ventas.php?funcion=1', function(data) {
            $('#men').text("Bien Hecho, Tu venta con Folio: "+data+" ha sido registrada correctamente");
        });
    }

    /* Llenado de tabla de ventas registradas */
    function table(){
        var url = 'php/ventas.php?funcion=2';
        $.getJSON(url, function(datos){
            $.each(datos, function(i,response){
                var newRow =
                '<tr>'
                +'<td>'+response.folioVenta+'</td>'
                +'<td>'+response.clave+'</td>'
                +'<td>'+response.nombre+'</td>'
                +'<td>$'+response.precioTotal+'</td>'
                +'<td>'+response.fecha+'</td>'
                +'<td>'+response.estatus+'</td>'
                +'</tr>';
                $(newRow).appendTo('#cuerpo');
            })
        }) 
    }
    window.onload = table();

    /* Clientes autocomplete */
    $('#cliente').autocomplete({
        source: 'php/ventas.php?funcion=3',                    
        minLength: 3,
        select: function(event, ui) {
        	var url = 'php/ventas.php?funcion=4';
        	$.getJSON(url, {nombre: ui.item.value}, function(datos){
	            $.each(datos, function(i,resp){
	           		$('#cliente').val(resp.clave + ' - ' + ui.item.value);
			        $('.label-rfc').text('RFC: '+ resp.rfc).css('display', 'block');      		
		        });    	
	        });
        }
    });

    /* Articulos autocomplete */
    $('#articulo').autocomplete({
    	source: 'php/ventas.php?funcion=5',
	    minLength: 3
    });

    /* Funciones para tabla de abonos */
    function total_pagar(mes,tasa,plazo,total) {
		var contado = total / (1 + ((tasa * plazo) / 100));  
		var tp = contado * (1 + (tasa * mes) / 100);
		return tp.toFixed(2);
	}

	function importe_abono(mes,tasa,plazo,total) {
		var iab = total_pagar(mes,tasa,plazo,total) / mes;
		return iab.toFixed(2);
	}

	function importe_ahorro(mes,tasa,plazo,total){
		var ia = total - total_pagar(mes,tasa,plazo,total);
		return ia.toFixed(2);
	}

	function operaciones(eng,tas,pla) {
		var suma = 0;
		$('.tabla-art tbody tr').each(function(){
			$(this).find('td:eq(4)').each(function(){
				var importeSuma = suma += parseInt($(this).text().substring(1));
				var enganche = (eng / 100) * importeSuma;
	            var bonificacion = enganche * (tas * pla) / 100;
	            var total = importeSuma - enganche - bonificacion;
				$('#enganche').text('$'+enganche.toFixed(2));
				$('#bonificacion').text('$'+bonificacion.toFixed(2))
				$('#total').text('$'+total.toFixed(2));

				var incremento = 3;
				for (var i = 3; i <= pla; i+=incremento) {
					$('#tp'+i).text('Total a pagar $' + total_pagar(i,tas,pla,total));
					$('#iab'+i).text('$' + importe_abono(i,tas,pla,total));
					$('#ia'+i).text('Se ahorra $' + importe_ahorro(i,tas,pla,total));
				}
			});
		});
	}
    
    /* Funcion calculo de importe, enganche, precio etc. */
    function cantidad(input,eng,tas,pla) {
		var precio = input.closest("tr").children().eq(3).text().substring(1);
		var importe = input.val() * precio;
		input.closest("tr").children().eq(4).text('$'+importe.toFixed(2));

		operaciones(eng,tas,pla);
	}	

    $('#agregar').click(function(event) {
		event.preventDefault();
		var repetido;
		$('.tabla-art tbody tr').each(function(){
 			$(this).find('td:eq(0)').each(function(){
 				if ($(this).text() == $('#articulo').val()) {
 					$('.label-repetido').css('display','block');
					setTimeout(function() {
       					$('.label-repetido').css('display','none');
    				},2000);
 					repetido = true; 
 				}
 			});
        });

        if (repetido) {
        	$('#articulo').val('');
        	$('#articulo').focus();
        	return false;
        }

		if ($('#articulo').val() == '') {
			$('.label-vacio').css('display','block');
		} else {	
			var url = 'php/ventas.php?funcion=6';
			var dato = {articulo: $('#articulo').val()};
			$.getJSON(url, dato, function(datos){
	            $.each(datos, function(i,resp){
	            	console.log(resp)
	            	if (resp.tasa == 0 || resp.enganche == 0 || resp.plazo == 0) {
	            		$('.label-config').css('display','block');
						setTimeout(function() {
	       					$('.label-config').css('display','none');
	    				},2000);
	            	} else if (resp.existencia != 0) {
	                	var precio = resp.precio * (1 + (resp.tasa * resp.plazo) / 100);
						var newRow =
			            '<tr>'
			            +'<td id="des">'+resp.descripcion+'</td>'
			            +'<td>'+resp.modelo+'</td>'
			            +'<td><input type="text" class="form-control input-form" id="cantidad" style="width:20%;margin:auto"></td>'
			            +'<td>$'+precio.toFixed(2)+'</td>'
			            +'<td id="importe">$'+precio.toFixed(2)+'</td>'
			            +'<td style="text-align:center;"><a href="#" class="img-borrar"><img src="img/borrar.png" alt="borrar" style="width:25px;"></a></td>'
			            +'<td id="existencia" style="display:none">'+resp.existencia+'</td>'
			            +'</tr>';
			            $('#datos').append(newRow);
			            $('#cont-precio,#precio-venta').css('display', 'block');
			            operaciones(resp.enganche,resp.tasa,resp.plazo);
	                } else {
	                	$('.label-existencia').css('display','block');
						setTimeout(function() {
	       					$('.label-existencia').css('display','none');
	    				},2000);
	    				$('#articulo').focus();
	                }

	                $(".tabla-art tbody tr:last").find('#cantidad').keyup(function() {
						$(this).keypress(function(e){
							if (e.keyCode >= 48 && e.keyCode <= 57) {
								return true;
							} else {
								return false;
							}
						});

						$('.cant').remove();
						$('.maxcant').remove();

						var existencia = [];
						var cant = [];
						$('.tabla-art tbody tr').each(function(){
							existencia.push(parseInt($(this).find('td:eq(6)').text()));
							cant.push($(this).find('#cantidad').val());
						});

						for (var i = 0; i < existencia.length; i++) {
							if (cant[i] > existencia[i]) {
								$('.maxcant').remove();
								$(this).after('<label class="maxcant text-center" style="padding-bottom:0;">Supero la cantidad del inventario</label>');
								$('.maxcant').css('display','block');
								setTimeout(function() {
									$('.maxcant').remove();
								},3000);
								$(this).focus().val(existencia[i]);
								cantidad($(this),resp.enganche,resp.tasa,resp.plazo);
							} else {
								cantidad($(this),resp.enganche,resp.tasa,resp.plazo);
							}		
						}		 	
					})

					$('.img-borrar').click(function(e){
						e.preventDefault();
						$(this).parents('tr').remove();
						cantidad($("#tabla1 input"),resp.enganche,resp.tasa,resp.plazo);
						if ($('.tabla-art tbody tr').length == 0) {
							$('#cont-precio,#precio-venta,.abonos,.boton-alta').css('display','none');
							$('.boton-siguiente').css('display','block');
							$('#cuerpo-abonos tr').remove();
						}
					});

	                $('#articulo').val('');
					$('.tabla-art tbody tr:last').find('#cantidad').focus().val('1');
	            });
	        });
		}
	});

	function validacion (){
		$('.tabla-art tbody tr').each(function(){
		 	$(this).find('#cantidad').each(function(){
				if ($(this).val() == '' || $(this).val() == 0){ 
					$('.cant').remove();
					$(this).after('<label class="cant text-center" style="padding-bottom:0;">Cantidad invalida</label>');
					$('.cant').css('display','block');
					$(this).focus();
				} 
			});
		});
	}

	function tablaAbonos() {
		var url = 'php/ventas.php?funcion=7';
		var suma = 0;
		$.getJSON(url, function(data) {
			$.each(data, function(index, val) {
	            var total = $('#total').text().substring(1);
				var incremento = 3;
				for (var i = 3; i <= val.plazo; i+=incremento) {
					var newRow = 
					'<tr class="active">'
		                +'<td>'+i+' Abonos de</td>'
		                +'<td id="iab'+i+'">$' + importe_abono(i,val.tasa,val.plazo,total)+'</td>'
		                +'<td id="tp'+i+'">Total a pagar $' + total_pagar(i,val.tasa,val.plazo,total)+'</td>'
		                +'<td id="ia'+i+'">Se ahorra $' + importe_ahorro(i,val.tasa,val.plazo,total)+'</td>'
		                +'<td><label>'
		                        +'<input type="radio" name="optionsRadios" id="optionsRadios2" value="option1">'
		                    +'</label>'
		                +'</td>'
		            +'</tr>';
		            $('#cuerpo-abonos').append(newRow);
				}
			});
		});
	}

	$('.boton-siguiente').click(function(){
		validacion();
		if (!$('.label-rfc').is(':visible')) {
			$('.label-cliente').css('display','block');
			$('#cliente').focus();
			return false;
		} else if ($('.tabla-art tbody tr').length == 0) {
			$('.label-articulo').css('display','block');
			setTimeout(function() {
				$('.label-articulo').css('display','none');
			},2000);
			$('#articulo').focus();
			return false;
		} else if (!$('.cant').is(':visible')) {
			$('.abonos,.boton-alta').css('display','block');
			$('.boton-siguiente').css('display','none');
			tablaAbonos();
		} 
	});

	$('.boton-alta').click(function() {
		validacion();
		if (!$('.label-rfc').is(':visible')) {
			$('.label-cliente').css('display','block');
			$('#cliente').focus();
		} else if (!$('input[type="radio"]').is(':checked')) {
			$('.label-abonos').css('display','block');
			setTimeout(function() {
				$('.label-abonos').css('display','none');
			},2500);
		} else if (!$('.cant').is(':visible')){
			var formatFecha = fecha.split("/").reverse().join("-");
			var precioTotal;
			$('.tabla-abonos tbody tr').each(function(){
				if ($(this).find('input[type="radio"]').is(':checked')) {
					precioTotal = $(this).find('td:eq(2)').text().substring(15);
				}
			});
			
			var cliente = $('#cliente').val().substring(0,4);
			var articulos = [];
			var importe = [];
			var cant = [];
			$('.tabla-art tbody tr').each(function(){
				articulos.push($(this).find('td:eq(0)').text());
				cant.push($(this).find('#cantidad').val());
				importe.push($(this).find('td:eq(4)').text().substring(1));
			});

			var url = 'php/ventas.php?funcion=8';
			var dato = {articulo: JSON.stringify(articulos)};
			var ep = [];
			$.getJSON(url, dato, function(data) {
				$.each(data, function(index, val) {
					if (cant[index] > data[index].existencia) {
						$('.tabla-art tbody tr').each(function(index){
							$('.maxcant').remove();
							$(this).find('#cantidad').after('<label class="maxcant text-center" style="padding-bottom:0;">Supero la cantidad del inventario</label>');
							$('.maxcant').css('display','block');
							setTimeout(function() {
								$('.maxcant').remove();
							},3000);
							$(this).find('#cantidad').focus().val(data[index].existencia);
							$(this).find('#existencia').text(data[index].existencia);
							cantidad($(this).find('#cantidad'),val.enganche,val.tasa,val.plazo);
						});
						ep.push(false)
					} else { 
						ep.push(true)
					}
				});
				
				var ban;
				for (var i = 0; i < ep.length; i++) {
					if (ep[i] == false) {
						ban = false;
						return false;
					} else {
						ban = true;
					}
				}

				if (ban) {
					$.ajax({
						url: 'php/ventas.php?funcion=9',
						type: 'POST',
						data: { 
							fecha: formatFecha,
							precio: precioTotal,
							cliente: cliente,
							articulos: JSON.stringify(articulos),
							cantidad: JSON.stringify(cant),
							importe: JSON.stringify(importe)
						},
						beforeSend: function () {
						   	$('#modal-carga').modal();
			            }
					})
					.done(function(data) {
						console.log("success");
						console.log(data.substring(4));
						if(data.substring(4) == "false"){
							$('#modal-carga').modal('hide');
			            } else {
			            	$('#modal-carga').modal('hide');
			                $('#cuerpo').empty();
			                clave();
			                table();
			                $('#cliente,#articulo').val('');
			                $('.tabla-art tbody tr').remove(); 
			                if ($('.tabla-art tbody tr').length == 0) {
								$('#cont-precio,#precio-venta,.abonos,.boton-alta').css('display','none');
								$('.boton-siguiente').css('display','block');
							}
							$('input[type="radio"]').val("")
			                $('#alta,.label-rfc').css('display','none');
			                $('#tabla').css('display','block');
			                $('#mensaje').css('display','block').html('<div class="alert alert-success" role="alert"><span><strong id="men"></strong></span></div>');
			                $('#mensaje').slideDown('slow');
			                setTimeout(function () {
			                    $('#mensaje').slideUp('slow');
			                },2000);
			            }
					});
				}	
			});						
		}
	});
});