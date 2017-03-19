<?php
$link=mysql_connect("localhost","renjie","renjie") or die ("連線失敗");
mysql_select_db("renjie");
mysql_set_charset('utf8',$link);

$userid  = $_POST["userid"];
$info = $_POST["info"];
$time    = $_POST["time"];
$sql    = "INSERT INTO log (USER,INFO,TIME) VALUES ('$userid','$info','$time')";
$result = mysql_query($sql);
mysql_close($link);
?>
