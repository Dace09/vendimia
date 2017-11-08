<?php 
	include 'conexion.php';

	$funcion = intval($_GET['funcion']);
	switch ($funcion) {
		case '1': clave($conexion); break;
		case '2': table($conexion); break;
		case '3': insert($conexion); break;
		case '4': queryEdit($conexion); break;
		case '5': edit($conexion); break;
	}

	function clave($conexion) {;
        $result = $conexion->query("SELECT MAX(id) FROM clientes");
        $row = $result->fetch_row();
        $claveMensaje = $row[0];
        $clave = $row[0] + 1;

        if($clave < 10){ 
            echo $claveFinal = "000".$claveMensaje;
            return $claveFinal = "000".$clave;
        } else if($clave >= 10 && $clave < 100){ 
            echo $claveFinal = "00".$claveMensaje;
            return $claveFinal = "00".$claveMensaje; 
        } else if($clave >= 100 && $clave < 1000){
            echo $claveFinal = "0".$claveMensaje; 
            return $claveFinal = "0".$clave; 
        } else if($clave >= 1000){
            echo $claveFinal = $claveMensaje;
            return $claveFinal = $clave;
        } 

        $conexion->close();
    } 

	function table($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$result = $conexion->query("SELECT clave,concat(nombre,' ',apellidoPaterno,' ',apellidoMaterno) as nombre FROM clientes");

		while ($row = $result->fetch_assoc()) {
			$datos[] = array('clave' => $row['clave'], 'nombre' => $row['nombre']);
		}

		echo json_encode($datos);

		$conexion->close();
	}

	function insert($conexion) {
		sleep(1);
		mysqli_set_charset($conexion, 'utf8');

		$nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
		$apellidoPat = mysqli_real_escape_string($conexion, $_POST['apellidoPat']);
		$apellidoMat = mysqli_real_escape_string($conexion, $_POST['apellidoMat']);
		$rfc = mysqli_real_escape_string($conexion, $_POST['rfc']);

		$clave = clave($conexion);

		$sql = $conexion->prepare("INSERT INTO clientes (clave,nombre,apellidoPaterno,apellidoMaterno,rfc) VALUES (?, ?, ?, ?, ?)");
		$sql->bind_param("sssss", $clave, $nombre, $apellidoPat, $apellidoMat, $rfc);
		$sql->execute();

		$conexion->close();
	}

	function queryEdit($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$clave = mysqli_real_escape_string($conexion, $_GET['clave']);

		$sql = $conexion->prepare("SELECT clave,nombre,apellidoPaterno,apellidoMaterno,rfc FROM clientes WHERE clave = ?");
		$sql->bind_param('s', $clave);
		$sql->execute();
		$result = $sql->get_result();
		$row = $result->fetch_assoc();

		$datos[] = array('clave' => $row['clave'], 'nombre' => $row['nombre'], 'apellidoPat' => $row['apellidoPaterno'], 'apellidoMat' => $row['apellidoMaterno'], 'rfc' => $row['rfc']);

		echo json_encode($datos);

		$conexion->close();
	}

	function edit($conexion) {
		sleep(1);
		mysqli_set_charset($conexion, 'utf8');

		$clave = mysqli_real_escape_string($conexion, $_GET['clave']);

		$nombre = mysqli_real_escape_string($conexion, $_POST['nombre-editar']);
		$apellidoPat = mysqli_real_escape_string($conexion, $_POST['apellidoPat-editar']);
		$apellidoMat = mysqli_real_escape_string($conexion, $_POST['apellidoMat-editar']);
		$rfc = mysqli_real_escape_string($conexion, $_POST['rfc-editar']);

		$sql = $conexion->prepare("UPDATE clientes SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, rfc = ? WHERE clave = ?");
		$sql->bind_param("sssss", $nombre, $apellidoPat, $apellidoMat, $rfc, $clave);
		$sql->execute();

		$conexion->close();
	}
?>