<?php
	$conexion = new mysqli('localhost','root','','vendimia');

	if($conexion->connect_errno){
		echo "Error al conectarse con MySQL debido al error:" .$conexion->connect_error;
	}
?>