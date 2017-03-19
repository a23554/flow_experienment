function resetResultImg(num){
	$("#result_img_div").html("");
	for(var i = 0 ; i <= num;i++){
		$("#result_img_div").append("<img id='"+i+"' src='origin1.jpg' class='drag-component'></img>");
	}
}

function setDraggable(){
	$(".draggable").draggable({
					revert : function(event, ui) {
						$(this).data("uiDraggable").originalPosition = {
								top : 0,
								left : 0
						};
						return !event;
					}
			});
	$(".draggable").draggable("enable");
}

function resetDragPos(obj){
	obj.css({
		'left': '0px',
		'top': '0px'
	});
}

function saveAnswer(column,recordstring){
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if(xmlhttp.status==200) {
				xmlhttp.abort();
			}
		}
	};
	xmlhttp.open("POST","saveAnswer.php",true);
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send("userid=" + username + "&exp=" + expPrefix + "&column=" + column + "&content=" + recordstring);
}

function clearDraggable(){
	resetDragPos($(".ui-draggable"));
	$(".ui-draggable").show();
	$(".ui-draggable").draggable('disable');

}

function clearDraggableItem(className){
	/*resetDragPos($("."+className));
	$("."+className).show();
	$("."+className).draggable('disable');*/
}

function setDraggableItem(className){	//only used in experiment 10&11
	$("."+className).draggable({
		revert : function(event, ui) {
			$(this).data("uiDraggable").originalPosition = {
				top : 0,
				left : 0
			};
			return !event;
		}
	});
	$("."+className).draggable("enable");
}

function saveRecord(recordstring){
	theDate = new Date();
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if(xmlhttp.status==200) {
				xmlhttp.abort();
			}
		}
	};
	xmlhttp.open("POST","saveRecord.php",true);
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send("userid=" + username + "&info=" + recordstring + "&time=" + dateFormat(theDate, 'yyyy-MM-dd hh:mm:ss') + "." + theDate.getMilliseconds());
}

function dateFormat(date, format) {
    if(format === undefined){
        format = date;
        date = new Date();
    }
    var map = {
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "h": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "q": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}
