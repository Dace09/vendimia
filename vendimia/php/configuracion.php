<?php 
	include 'conexion.php';

	$funcion = intval($_GET['funcion']);
	switch ($funcion) {
		case '1': query($conexion); break;
		case '2': insert($conexion); break;
	}

	function query($conexion) {
	    mysqli_set_charset($conexion, 'utf8');

	    $result = $conexion->query("SELECT tasaFinanciamiento,enganche,plazo FROM configuracion"); 
	    $row = $result->fetch_assoc();
    	
    	$datos[] = array('tasa' => $row['tasaFinanciamiento'], 'enganche' => $row['enganche'], 'plazo' => $row['plazo']);

	    echo json_encode($datos);

	    $conexion->close();
	}
	
	function insert($conexion) {
		sleep(1);
		mysqli_set_charset($conexion, 'utf8');

		$tasa = mysqli_real_escape_string($conexion, $_POST['tasa']);
		$enganche = mysqli_real_escape_string($conexion, $_POST['enganche']);
		$plazo = mysqli_real_escape_string($conexion, $_POST['plazo']);

		$result = $conexion->query("SELECT id FROM configuracion");
		$row = $result->fetch_assoc();

		if ($row['id'] == "") {
			$sql = $conexion->prepare("INSERT INTO configuracion (id,tasaFinanciamiento,enganche,plazo) VALUES (?, ?, ?, ?)");
			$sql->bind_param("idii", $id = 1, $tasa, $enganche, $plazo);
			$sql->execute();
		} else {
			$sql = $conexion->prepare("UPDATE configuracion SET tasaFinanciamiento = ?, enganche = ?, plazo = ? WHERE id = ?");
			$sql->bind_param("diii", $tasa, $enganche, $plazo, $id = 1);
			$sql->execute();
		}

		$conexion->close();
	}
 ?>