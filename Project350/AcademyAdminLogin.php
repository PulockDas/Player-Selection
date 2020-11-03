<?php


	        $academyId = $_POST['academy_id'];
			$academyAdmin_password = $_POST['password'];
			
			require_once (dirname(__FILE__)."/getConnection.php");
			$obj = new Connection();
			$conn = $obj->connect();
			
			$sql="SELECT * FROM `ACADEMY_DETAILS` WHERE ACADEMY_ID = '$academyId' and PASSWORD = '$academyAdmin_password';";
			$result= $conn->query($sql) or die("failed to connect");
			$row=$result->fetch_assoc();
			if($row['ACADEMY_ID']==$academyId && $row['PASSWORD']==$academyAdmin_password){
				echo "Login successfull! WELCOME ".$row["ACADEMY_NAME"];
			}else{
				echo "failed!";
			}
?>