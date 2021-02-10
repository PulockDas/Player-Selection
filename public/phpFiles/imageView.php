<?php
    require_once "getConnection.php.php";
    if(isset($_GET['image_id'])) {
        $sql = "SELECT Image FROM players_details;
		$result = mysqli_query($conn, $sql) or die("<b>Error:</b> Problem on Retrieving Image BLOB<br/>" . mysqli_error($conn));
		$row = mysqli_fetch_array($result);
		header("Content-type: " . $row["imageType"]);
        echo $row["imageData"];
	}
	mysqli_close($conn);
?>