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

	function clave($conexion) {
        $result = $conexion->query("SELECT MAX(id) FROM articulos");
        $row = $result->fetch_row();
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
        } else if($clave >= 1000){
        	echo $claveFinal = $claveMensaje; 
            return $claveFinal = $clave;
        } 

        $conexion->close();
    }  

	function table($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$result = $conexion->query("SELECT clave,descripcion FROM articulos");
		
		while ($row = $result->fetch_assoc()) {
			$datos[] = array('clave' => $row['clave'], 'descripcion' => $row['descripcion']);
		}

		echo json_encode($datos);

		$conexion->close();
	}

	function insert($conexion) {
		sleep(1);
		mysqli_set_charset($conexion, 'utf8');

		$descripcion = mysqli_real_escape_string($conexion, $_POST['descripcion']);
		$modelo = mysqli_real_escape_string($conexion, $_POST['modelo']);
		$precio = mysqli_real_escape_string($conexion, $_POST['precio']);
		$existencia = mysqli_real_escape_string($conexion, $_POST['existencia']);

		$clave = clave($conexion);

		if ($existencia == 0) {
			$sql = $conexion->prepare("INSERT INTO articulos (clave,descripcion,modelo,precio,existencia,estatus) VALUES (?, ?, ?, ?, ?, ?)");
			$sql->bind_param("sssdis", $clave, $descripcion, $modelo, $precio, $existencia, $estatus = 'No activo');
			$sql->execute();
		} else{	
			$sql = $conexion->prepare("INSERT INTO articulos (clave,descripcion,modelo,precio,existencia) VALUES (?, ?, ?, ?, ?)");
			$sql->bind_param("sssdi", $clave, $descripcion, $modelo, $precio, $existencia);
			$sql->execute();
		}

		$conexion->close();
	}

	function queryEdit($conexion) {
		mysqli_set_charset($conexion, 'utf8');

		$clave = mysqli_real_escape_string($conexion, $_GET['clave']);

		$sql = $conexion->prepare("SELECT clave,descripcion,modelo,precio,existencia FROM articulos WHERE clave = ?");
		$sql->bind_param('s', $clave);
		$sql->execute();
		$result = $sql->get_result();
		$row = $result->fetch_assoc();

		$datos[] = array('clave' => $row['clave'], 'descripcion' => $row['descripcion'], 'modelo' => $row['modelo'], 'precio' => $row['precio'], 'existencia' => $row['existencia']);
		
		echo json_encode($datos);

		$conexion->close();
	}

	function edit($conexion) {
		sleep(1);
		mysqli_set_charset($conexion, 'utf8');

		$clave = mysqli_real_escape_string($conexion, $_GET['clave']);

		$descripcion = mysqli_real_escape_string($conexion, $_POST['descripcion-editar']);
		$modelo = mysqli_real_escape_string($conexion, $_POST['modelo-editar']);
		$precio = mysqli_real_escape_string($conexion, $_POST['precio-editar']);
		$existencia = mysqli_real_escape_string($conexion, $_POST['existencia-editar']);

		if ($existencia == 0) {
			$sql = $conexion->prepare("UPDATE articulos SET descripcion = ?, modelo = ?, precio = ?, existencia = ?, estatus = ? WHERE clave = ?");
			$sql->bind_param("ssdiss", $descripcion, $modelo, $precio, $existencia, $estatus = 'No activo', $clave);
			$sql->execute();
		} else{
			$sql = $conexion->prepare("UPDATE articulos SET descripcion = ?, modelo = ?, precio = ?, existencia = ?, estatus = ? WHERE clave = ?");
			$sql->bind_param("ssdiss", $descripcion, $modelo, $precio, $existencia, $estatus = 'Activo', $clave);
			$sql->execute();
		}

		$conexion->close();
	}	
?>