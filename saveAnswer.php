<?php
$link=mysql_connect("localhost","renjie","renjie") or die ("連線失敗");
mysql_select_db("renjie");
mysql_set_charset('utf8',$link);

$userid  = $_POST["userid"];
$exp  = $_POST["exp"];
$column = $_POST["column"];
$content = $_POST["content"];
$sql    = "SELECT * FROM answer WHERE USERID = '".$userid."' && EXP ='".$exp."'";
$result = mysql_query($sql);
$row    = mysql_fetch_array($result);
if($row==null){
	$sql2    = "INSERT INTO answer (USERID,EXP) VALUES ('$userid','$exp')";
	$result2 = mysql_query($sql2) or die('error2');
}

$sql3 ="UPDATE answer SET ".$column." = '".$content."' WHERE USERID = '".$userid."' && EXP ='".$exp."'";
$result3 = mysql_query($sql3);
mysql_close($link);
?>
