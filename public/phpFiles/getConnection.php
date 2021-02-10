<?php
	
	class Connection{

		function connect(){

			$servername = "localhost";
			$username = "Project350";
			$password = "wolverine";
			$DB_NAME = "player_selection";
			/**
			  *Create connection and finally added database 
			  *if we want to add database then we have to pass db name as last parameter to mysqli method
			 **/

			$conn = new mysqli($servername,$username,$password,$DB_NAME);
			if($conn->connect_error){
				die("connection failed: ". $conn->connect_error);
			}
			else{
				echo "Connection Successfull!!!";
			}
			return $conn;
		}
	}
