<?php

    $academy_name = $_POST['academy_name'];
    $academy_id = $_POST['academy_id'];
	$email = $_POST['academy_email'];
	$password = $_POST['password'];

	require_once (dirname(__FILE__)."/getConnection.php");

	 $object = new Connection();
	 $conn = $object->connect();

	require_once (dirname(__FILE__)."/sqlCommand.php");
	require_once (dirname(__FILE__)."/AcademyRegistration.php");

	$obj = new SqlCommand();
	$obj->academydetails($conn);
	$ob = new AcademySignup();
	$ob->signup($conn,$academy_name,$academy_id,$email,$password);

	$conn->close();
?>