<?php
	
	class AcademySignup{

		function signup($conn,$academy_name, $academy_id, $email,$password){

			 $sqlInsert = "INSERT INTO ACADEMY_DETAILS(ACADEMY_NAME, ACADEMY_ID, EMAIL, PASSWORD)
		 		VALUES('$academy_name','$academy_id','$email','$password');";

		 		if($conn->query($sqlInsert) == true){
		 				echo "Registration successfull";
		 		}else{
		 				echo "Registration unsuccessfull\n".$conn->error."\n";
		 		}
		}

	}
