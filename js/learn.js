$(function(){
	var var_cnt = 0 ;
	var $inputs = [$("#exp-suppose"), $("#independent-var"), $("#dependent-var"), $("#control-var")] ;
	var $summary_inputs = [$("#summary-1"), $("#summary-2"), $("#summary-3")];
	var $finish = $('#summary-finish');
	var $modal = $('#questions');
	var $modal_title = $('#modal-title');
	var $modal_content = $('#modal-answer');
	var $modal_save = $('#modal-save');
	var $modal_cancel = $('#modal-cancel');
 	$(".tb-ans").hide();
	//set number only
	$("input[class*='tb-ans']").attr('onkeypress','return event.charCode >= 46 && event.charCode <= 57');
		 $(".tb-ans1").hide();
	//set number only
	$("input[class*='tb-ans1']").attr('onkeypress','return event.charCode >= 46 && event.charCode <= 57');
// 控制學習單第一部分填寫實驗設計與變因
	for(var i=0, $input; $input = $inputs[i]; ++i){
		$input.click(function(){
			info = prefix+"1";
			saveRecord(info);
			//console.log($(this).attr('placeholder'));
			$modal_title.html($(this).attr('placeholder'));
			$modal_content.val('');

			$modal_save.unbind('click');
			$modal_save.click(function(event){
				var text = $modal_content.val() ;
				if(text.length==0){
					bootbox.alert("請填寫完整");
					return false ;
				}
				$(this).val(text);
				$(this).attr('disabled', true);
				$modal.modal('hide');
				var_cnt++ ;
				if(var_cnt==$inputs.length){
					var ansDa3 = "" + expPrefix + "Da3_" + document.getElementById("exp-suppose").value;
					var ansDb3 = "" + expPrefix + "Db3_"+ document.getElementById("independent-var").value;
					var ansDc3 = "" + expPrefix + "Dc3_"+ document.getElementById("control-var").value;
					var ansDd3 = "" + expPrefix + "Dd3_"+ document.getElementById("dependent-var").value;

					saveRecord(ansDa3);
					saveRecord(ansDb3);
					saveRecord(ansDc3);
					saveRecord(ansDd3);
					$("#exp-table-div").removeClass("hidden");
				 	$("#result_chart_div").removeClass("hidden");
					//setDraggable();
				}
            }.bind(this));

			info = prefix+"2";
			document.getElementById('modal-answer').setAttribute('onclick','saveRecord("'+info+'")');

			info = prefix+"3";
			document.getElementById('modal-save').setAttribute('onclick','saveRecord("'+info+'")');

			info = prefix+"4";
			document.getElementById('modal-cancel').setAttribute('onclick','saveRecord("'+info+'")');
            $modal.modal('show');
        });
    }

		$finish.click(function(){
			if(var_cnt!=4){
				alert("請完成每個填寫項目");
				return false ;
			}

			var summary_ratio = $('input[name=summary-sup]:checked').val();
			if(typeof summary_ratio == "undefined"){
				alert("請完成實驗總結");
					return false ;
			}
			for(var i=0, $input; $input = $summary_inputs[i]; ++i){
				var text = $input.val();
				if(text.length==0){
					alert("請完成實驗總結");
					return false ;
				}
			}

			var ansDg1 = "" + expPrefix + "Dg1_" + document.getElementById("summary-1").value;
			var ansDg2 = "" + expPrefix + "Dg2_" + document.getElementById("summary-2").value;
			var ansDg3 = "" + expPrefix + "Dg3_"+ document.getElementById("s-1").checked;
			var ansDg4 = "" + expPrefix + "Dg4_"+ document.getElementById("s-0").checked;
			var ansDg5 = "" + expPrefix + "Dg5_"+ document.getElementById("summary-3").value;
			saveRecord(ansDg1);
			saveRecord(ansDg2);
			saveRecord(ansDg3);
			saveRecord(ansDg4);
			saveRecord(ansDg5);
			saveAnswer('Dg1',ansDg1);
			saveAnswer('Dg2',ansDg2);
			saveAnswer('Dg3',ansDg3);
			saveAnswer('Dg4',ansDg4);
			saveAnswer('Dg5',ansDg5);

			alert("學習單結束!!!");
			document.getElementById("anspic").style.display = "inline";
	});

});
function canSimulation(){
	var inputDone=true;
	$("#exp-table").find(".tb-des ,.item").each(function(index,value){
		//$(this).removeClass("hidden");
		if($(this).val()=="")
			inputDone=false;
	});
	return inputDone;
}

function canConclusion(){
	var inputDone=true;
	$("#exp-table").find("input").each(function(index,value){
		//$(this).removeClass("hidden");
		if($(this).val()=="")
			inputDone=false;
	});
	return inputDone;
}

function startSimulation($obj){
	info = "" + expPrefix + "De99";
	saveRecord(info);
	if(canSimulation()){
		var ansDa3 = "" + expPrefix + "Da3_" + document.getElementById("exp-suppose").value;
		var ansDb3 = "" + expPrefix + "Db3_"+ document.getElementById("independent-var").value;
		var ansDc3 = "" + expPrefix + "Dc3_"+ document.getElementById("control-var").value;
		var ansDd3 = "" + expPrefix + "Dd3_"+ document.getElementById("dependent-var").value;
		saveAnswer('Da3',ansDa3);
		saveAnswer('Db3',ansDb3);
		saveAnswer('Dc3',ansDc3);
		saveAnswer('Dd3',ansDd3);

		bootbox.alert("實驗已開始!");
		$obj.attr("onClick","startConclusion();");
		//setDraggable();
		$("#reset").removeClass("disabled");
		$("#go").removeClass("disabled");
		$('#reset-button').removeAttr('disabled');
		$('#simulate-button').removeAttr('disabled');
		$(".btn-liquid").removeClass("disabled");
		$(".tb-ans").show();
		$(".tb-ans1").show();
		$("#exp-table").find(".tb-des ,.tb-des1 ,.item").attr("disabled","true");
	}
	else{
		bootbox.alert("有表格尚未填寫!");
	}
}

function startConclusion(){
	info = "" + expPrefix + "De99";
	saveRecord(info);

	//$(this).addClass("hidden");
	if(canConclusion()){
		genChart(true);

		var temp1 = [];
		var temp2 = [];

		switch(columncount){
			case 16://exp1
				for(i = 0; i < 6; i ++){
					temp1[i] = "" + expPrefix + "De" + (i+1) +"_" + document.getElementById(("col" + (i+1))).value;
					if(ansDe[i] != temp1[i]){
						ansDe[i] = temp1[i];
						saveRecord(ansDe[i]);
						saveAnswer(('De'+(i+1)),ansDe[i]);
					}
				}
				for(i = 0; i < 8; i ++){
					temp2[i] = "" + expPrefix + "Df" + (i+1) +"_" + document.getElementById(("tb-ans-" + i)).value;
					if(ansDf[i] != temp2[i]){
						ansDf[i] = temp2[i];
						saveRecord(ansDf[i]);
						saveAnswer(('Df'+(i+1)),ansDf[i]);
					}
				}
				break;
			case 7:
				for(i = 0; i < 4; i ++){
					temp1[i] = "" + expPrefix + "De" + (i+1) +"_" + document.getElementById(("col" + (i+1))).value;
					if(ansDe[i] != temp1[i]){
						ansDe[i] = temp1[i];
						saveRecord(ansDe[i]);
						saveAnswer(('De'+(i+1)),ansDe[i]);
					}
				}
				for(i = 0; i < 3; i ++){
					temp2[i] = "" + expPrefix + "Df" + (i+1) +"_" + document.getElementById(("tb-ans-" + i)).value;
					if(ansDf[i] != temp2[i]){
						ansDf[i] = temp2[i];
						saveRecord(ansDf[i]);
						saveAnswer(('Df'+(i+1)),ansDf[i]);
					}
				}
				break;
		}

		$("#exp-var-form").addClass("hidden");
		$("#conclusion").removeClass("hidden");
		$("#toggle-exp-form").css("visibility","visible");//removeClass("hidden");
		$("#exp-table").find("input").attr("disabled","true");
	}
	else{
		bootbox.alert("有表格尚未填寫!");
	}
};
