<?php


	class SqlCommand{

		function createDatabase($conn){

			    $sql = "CREATE DATABASE IF NOT EXISTS PLAYER_SELECTION ;";
			    if($conn->query($sql)== TRUE){
			 	    echo "Database has been crated successfully\n";
			    }else{
			 	    echo "Error creating database: ".$conn->error."\n";
			    }
		}


		function academydetails($conn){
			
			    $sqlCreateTable = "Create table ACADEMY_DETAILS(
				ACADEMY_NAME char(30),
				ACADEMY_ID char(30),
		        EMAIL char(30) UNIQUE,
		        PASSWORD char(30),
		        primary key(ACADEMY_ID));";
		        $conn->query($sqlCreateTable);
		}

		
	}


?>