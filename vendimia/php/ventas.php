<?php 
	include 'conexion.php';

	$funcion = intval($_GET['funcion']);
	switch ($funcion) {
		case '1': clave($conexion); break;
		case '2': table($conexion); break;
		case '3': autocompleteCliente($conexion); break;
		case '4': datosCliente($conexion); break;
		case '5': autocompleteArticulo($conexion); break;
		case '6': addTable($conexion); break;
		case '7': tablaAbonos($conexion); break;
		case '8': verificaExistencia($conexion); break;
		case '9': insertVenta($conexion); break;
	}

	function clave($conexion) {
        $resultClave = $conexion->query("SELECT MAX(id) FROM ventas");
        $row = $resultClave->fetch_row();
        $claveMensaje = $row[0];
        $clave = $row[0] + 1;

        if($clave < 10){ 
            echo $claveFinal = "000".$claveMensaje;
            return $claveFinal = "000".$clave;
        } else if($clave >= 10 && $clave < 100){ 
            echo $claveFinal = "00".$claveMensaje;
            return $claveFinal = "00".$clave; 
        } else if($clave >= 100 && $clave < 1000){
            echo $claveFinal = "0".$claveMensaje; 
            return $claveFinal = "0".$clave; 
        } else if($clave <= 1000){
            echo $claveFinal = $claveMensaje;
            return $claveFinal = $clave;
        } 

        $conexion->close();
    }

	function table($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$result = $conexion->query("SELECT folioVenta,clave,concat(nombre,' ',apellidoPaterno,' ',apellidoMaterno) AS nombre,precioTotal,fecha,estatus FROM ventas INNER JOIN detalleventa ON ventas.id = detalleventa.idVenta INNER JOIN clientes ON clientes.id = detalleventa.idCliente GROUP BY folioVenta");
		
		while ($row = $result->fetch_assoc()) {
			$fecha = date_create($row['fecha']);
			
			$datos[] = array('folioVenta' => $row['folioVenta'], 'clave' => $row['clave'], 'nombre' => $row['nombre'], 'precioTotal' => $row['precioTotal'], 'fecha' => date_format($fecha, 'd/m/Y'), 'estatus' => $row['estatus']);
		}

		echo json_encode($datos);

		$conexion->close();
	}

	function autocompleteCliente($conexion) {
        mysqli_set_charset($conexion, 'utf8');

        $busqueda = mysqli_real_escape_string($conexion, "%{$_GET['term']}%");

        $sql = $conexion->prepare("SELECT concat(nombre,' ',apellidoPaterno,' ',apellidoMaterno) as nombre FROM clientes WHERE nombre LIKE ?");
		$sql->bind_param('s', $busqueda);
		$sql->execute();
		$result = $sql->get_result();

		while ($row = $result->fetch_assoc()) {
			$nombre[] = $row['nombre'];
		}
        	
        echo json_encode($nombre);

        $conexion->close(); 
	}

	function datosCliente($conexion) {
	    mysqli_set_charset($conexion, 'utf8');

	    $nombre = mysqli_real_escape_string($conexion, $_GET['nombre']);

	    $sql = $conexion->prepare("SELECT clave,rfc FROM clientes WHERE concat(nombre,' ',apellidoPaterno,' ',apellidoMaterno) = ?");
		$sql->bind_param('s', $nombre);
		$sql->execute();
		$result = $sql->get_result();
	    $row = $result->fetch_assoc();

	    $datos[] = array('clave' => $row['clave'], 'rfc' => $row['rfc']);
	    
	    echo json_encode($datos);

	    $conexion->close();
	}

	function autocompleteArticulo($conexion) {
    	mysqli_set_charset($conexion, 'utf8');

        $busqueda = mysqli_real_escape_string($conexion, "%{$_GET['term']}%");

        $sql = $conexion->prepare("SELECT descripcion FROM articulos WHERE descripcion LIKE ?");
		$sql->bind_param('s', $busqueda);
		$sql->execute();
		$result = $sql->get_result();

        while ($row = $result->fetch_assoc()) {
            $descripcion[] = $row['descripcion'];
        }

        echo json_encode($descripcion);

        $conexion->close();
	}

	function addTable($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$articulo = mysqli_real_escape_string($conexion, $_GET['articulo']);

		$sql = $conexion->prepare("SELECT descripcion,modelo,precio,existencia,tasaFinanciamiento,enganche,plazo FROM articulos,configuracion WHERE descripcion = ?");
		$sql->bind_param('s', $articulo);
		$sql->execute();
		$result = $sql->get_result();

		while ($row = $result->fetch_assoc()) {
			$datos[] = array('descripcion' => $row['descripcion'], 'modelo' => $row['modelo'], 'precio' => $row['precio'], 'existencia' => $existencia = $row['existencia'], 'tasa' => $row['tasaFinanciamiento'], 'enganche' => $row['enganche'], 'plazo' => $row['plazo']);
		}

		echo json_encode($datos);
		
		$conexion->close();
	}

	function tablaAbonos($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$result = $conexion->query("SELECT tasaFinanciamiento,plazo FROM configuracion");

		while ($row = $result->fetch_assoc()) {
			$datos[] = array('tasa' => $row['tasaFinanciamiento'], 'plazo' => $row['plazo']);
		}

		echo json_encode($datos);

		$conexion->close();
	}
	
	function verificaExistencia($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$articulos = json_decode($_GET['articulo']);

		for ($i = 0; $i < count($articulos); $i++) {
			$sql = $conexion->prepare("SELECT descripcion,existencia,enganche,tasaFinanciamiento,plazo FROM articulos,configuracion WHERE descripcion = ?");
			$sql->bind_param('s', $articulos[$i]);
			$sql->execute();
			$result = $sql->get_result();
			$row = $result->fetch_assoc();

			$datos[] = array('existencia' => $row['existencia'], 'enganche' => $row['enganche'], 'tasa' => $row['tasaFinanciamiento'], 'plazo' => $row['plazo']);	
		}

		echo json_encode($datos);

		$conexion->close();
	}

	function insertVenta($conexion) {
		sleep(1);
		mysqli_set_charset($conexion, 'utf8');

		$folio = clave($conexion);
		$fecha = mysqli_real_escape_string($conexion, $_POST['fecha']);
		$precio = mysqli_real_escape_string($conexion, $_POST['precio']);
		$clienteClave = mysqli_real_escape_string($conexion, $_POST['cliente']);	
		$articulos1 = json_decode($_POST['articulos']);
		$importe1 = json_decode($_POST['importe']);
		$cantidad1 = json_decode($_POST['cantidad']);

		$sql = $conexion->prepare("INSERT INTO ventas (folioVenta,fecha,precioTotal) VALUES (?, ?, ?)");
		$sql->bind_param("ssd", $folio, $fecha, $precio);
		$sql->execute();

		for ($i = 0; $i < count($articulos1); $i++) { 
			$res = $conexion->prepare("SELECT descripcion,existencia FROM articulos WHERE descripcion = ?");
			$res->bind_param("s", $articulos1[$i]);
			$res->execute();
			$res2 = $res->get_result();
			$row1 = $res2->fetch_row();

			if ($cantidad1[$i] <= $row1[1]) { 
				$result = $conexion->prepare("SELECT ventas.id, clientes.id, articulos.id FROM ventas,clientes,articulos WHERE ventas.id = ? AND clientes.clave = ? AND articulos.descripcion = ?");
				$result->bind_param("sss", $folio, $clienteClave, $articulos1[$i]);
				$result->execute();
				$result2 = $result->get_result();
				$row = $result2->fetch_row();
				$idVenta = $row[0];
				$idCliente = $row[1];
				$idArticulo = $row[2];
				$articulos = $articulos1[$i];
				$cantidad = $cantidad1[$i];
				$importe = $importe1[$i];
				$cantidadUpd = $row1[1] - $cantidad;

				$sql2 = $conexion->prepare("INSERT INTO detalleventa (idVenta,idCliente,idArticulo,cantidad,importe) VALUES (?, ?, ?, ?, ?)");
				$sql2->bind_param("iiiid", $idVenta, $idCliente, $idArticulo, $cantidad, $importe);
				$sql2->execute();

				if ($cantidadUpd == 0) {
					$upd = $conexion->prepare("UPDATE articulos SET existencia = ?, estatus = ? WHERE descripcion = ?");
					$upd->bind_param("iss", $cantidadUpd = 0, $estatus = 'No activo', $articulos);
					$upd->execute();
				} else {
					$upd = $conexion->prepare("UPDATE articulos SET existencia = ? WHERE descripcion = ?");
					$upd->bind_param("is", $cantidadUpd, $articulos);
					$upd->execute();
				}
			} else {
				echo "false";
			}
		}

		$conexion->close();
	}
?>