var data = [];  //   store user actions.   !important: do not remove this line

var getCurrentTime = function(){
	return (new Date().toLocaleTimeString('en-US', { hour12: false, 
																					 hour: "numeric", 
																					 minute: "numeric",
																					 second: "numeric"}).toString());
};	
function Learn(options){
	
	
	
	var $inputs = [$("#exp-suppose"), $("#independent-var"), $("#dependent-var"), $("#control-var")] ;
	var t_summary = ['summary-1', 'summary-2', 'summary-3'];

// modal node	
	var $modal = $('#questions') ;
	var $modal_title = $('#modal-title');
	var $modal_content = $("#modal-content");
	var $modal_btn1 = $('#modal-btn1');
	var $modal_btn2 = $("#modal-btn2"); 
	
	var modal_hide = function(){$('#questions').modal("hide")};
	var modal_show = function(){$('#questions').modal("show")};
	
	var modal_dialog = function(options){
		// set title
		$modal_title.html("").html(options["title"]);
		// set content
		$modal_content.html("").html(options["content"]);
		// set button1 (optional)
		if(options["button_1"]){
			var opt = options["button_1"] ;
			$modal_btn1.html(opt["text"]||"儲存");
			$modal_btn1.removeClass().addClass(opt["class"]||"btn btn-primary");
			$modal_btn1.unbind("click").click(opt["callBack"]);
			$modal_btn1.show();
		}else $modal_btn1.hide();
		// set button2 (optional)
		if(options["button_2"]){
			var opt = options["button_2"] ;
			$modal_btn2.html(opt["text"]||"關閉");
			$modal_btn2.removeClass().addClass(opt["class"]||"btn btn-warning");
			$modal_btn2.unbind("click").click(opt["callBack"]);
			$modal_btn2.show();
		}else $modal_btn2.hide();

		modal_show();
	};
	
	
// stage div	
	var $learn_stage1_form = $('#exp-var-form');
	var $learn_stage2_table = $("#exp-table");
	var $table_button = $("#table-finish") ;
	var $learn_stage3_form = $("#exp-summary");
	var $summary_finish = $("#summary-finish");
	
// store all data here -> take out to be global variable
	/* var data = {};  */ 

// stage var
	var stage = 1 ;
	var stage1_cnt = 0 ;

// html tag string & titles
	const title1 = "後設認知";
	const hr = "<hr>";
	
// toggle exp form 
	var setup_toggle_button = function(){
		$("#toggle-exp-form").css("visibility","");
		$("#toggle-exp-form").attr("onclick","").click(function(){
			$learn_stage1_form.toggle();
		});
	};
	
////////////////////////////////////////
// 第一階段填寫假設與變因
	var stage1_handle = function(flag){	
		// flag用來表示是否為第一階段
		for(var i=0, $input; $input = $inputs[i]; ++i){
			$input.click(function(){
				var org_text = $(this).val();
				var var_title = $(this).attr('placeholder') ;
				modal_dialog({
					title: var_title,
					content: '<textarea id="modal-answer" cols="30" rows="7" class="form-control">'+org_text+'</textarea>',
					button_1: {
						text:"儲存",
						callBack: function(event){
							var text = $("#modal-answer").val() ;
							if(text.length==0){
								alert("請填寫完整");
								return false ;
							}
							$(this).val(text);
							if(flag) 
								$(this).attr('disabled', true);
							modal_hide();
							stage1_cnt++ ;
							//save data 
						//	data["stage1_"+stage1_cnt] = text ;	
							data.push({
									time: getCurrentTime(), 
									action: "dailog confirm", 
									target: var_title, 
									data: text 
								});
							
							if(flag){ 
								if(stage1_cnt==$inputs.length)
								{
									console.log("stage1 over");
									stage = 2 ;
									stage2_start();
								}else if(stage1_cnt==1){ //寫完假設後，顯示後面的變因輸入框
									for(var j=1; j<$inputs.length; ++j)
										$inputs[j].parent().parent().show();
								}
							}				
						}.bind(this)	
					},
					button_2: {
						text: "關閉",
						callBack: function(){ 
							data.push({
									time: getCurrentTime(), 
									action: "dialog close", 
									target: var_title
								});
							modal_hide(); 
						}
					}
				});

			});
		}
	};	

	var stage2_start = function(){		
		$learn_stage2_table.show(); //show stage2 table
		//$("#exp-table-div").removeClass("hidden"); //show stage2 table
		//$(".tb-ans").hide();
		$table_button.unbind('click').click(table_finish_1);//填完實驗操作/應變變因
		
	};
	

	var stage2_mid = function(){
		
		//$('#exp-learn-form').hide();
		$(".tb-des").attr("disabled", true);
		$(".tb-ind").attr("disabled", true);
		
		$('#go').removeClass("disabled");
		$('#reset').removeClass("disabled"); 
		
		$('.tb-ans').html('<input type="text" class="form-control tb-ans-input"/>');
		var totalLen=$(".tb-des").length;
		
		$('.tb-ans-input').each(function(idx, data){
			//$(data).attr('id','tb-ans-'+idx);
			$(data).attr('onkeypress','return event.charCode >= 48 && event.charCode <= 57');
			$(data).attr('idx',(idx%totalLen)+1);
		});//.click({title:"實驗結果"}, show_modal);
		
		alert("請利用左方實驗材料進行模擬並將實驗結果填入表格。");
		setDraggable();
		
		$table_button.unbind('click').click(table_finish_2);//填完實驗數據
	};
	

	var stage2_end = function(){
		//if(options["chart"]) 
			genChart(options["chart"]);	
		$table_button.unbind('click');
		if(options["mode"]){
			$learn_stage1_form.show();
			n_dialog_1_1();
		}else{
			stage = 3;
			$learn_stage1_form.hide();
			$learn_stage3_form.show();
			$table_button.hide();
			//drawChart();
			setup_toggle_button(); 
			alert('請依照實驗結果填寫結論');	
		}
		
		//$table_button.unbind('click').click(table_finish_3);
	};
	
	var table_finish_1 = function(){
		console.log("table[1]: 填寫變因完成");
		if(!save_td_var()){
			alert("請填寫完整");
			return false ;
		}
			
		stage2_mid();	
	};

	var table_finish_2 = function(){
		if(!save_td_ans()){
			alert("請填寫完整");
			//console.log("table_finish_1");
			return false ;
		}
		if(!options["mode"]){
			if(!confirm("送出後將無法再修改數據，確定要送出嗎?")) return false ;
		}
		
		$('.tb-ind').attr("disabled", true); 
		$('.tb-des').attr("disabled", true);
		$('.tb-ans').each(function(idx, dat){
			var $input = $(dat).children('input').first();
			$input.attr('disabled', true);
		});

		stage2_end();
	};

	var save_var = function(){
		for(var i=0, $input; $input = $inputs[i]; ++i){
			console.log($input.val());
		}
	};
	
	var save_td_var = function(){
		var pass = true;
		td_data = {};
		$('.tb-ind').each(function(idx, dat){
			if($(dat).val().length==0){pass=false; return ;}			
			td_data["tb-ind_"+$(dat).attr('idx')] = $(dat).val() ;
		});
		$('.tb-des').each(function(idx, dat){
			if($(dat).val().length==0){pass=false; return ;}
			td_data["tb-des_"+$(dat).attr('idx')] = $(dat).val() ;
		});
		if(!pass)
			return pass;
		data.push({
			time: getCurrentTime,
			action: "table save",
			target: "表格 操作變因/應變變因",
			data: td_data
		});
		return pass ;
	};
	
	var save_td_ans = function(){
		var pass = true;
		var td_data = {};
		$('.tb-ans').each(function(idx, dat){
			var $input = $(dat).children('input').first();
			if($input.val().length==0 || !parseInt($input.val()) ){pass=false; return ;}
			td_data["tb-ans-"+idx] = $input.val() ;
		});
		if(!pass)
			return pass;
		data.push({
			time: getCurrentTime,
			action: "table save",
			target: "表格 實驗數值",
			data: td_data
		});
		return pass ;
	};
	
	var stage2_3_edit = function(){
		var pass = true;

		pass &= save_td_var();
		pass &= save_td_ans();

		if(!pass){
			alert("請填寫完整");
			return ;
		}
		$('.tb-ind, .tb-des, .tb-ans-input').attr('disabled', true); 
		/*if(options["chart"])*/
		genChart(options["chart"]);
		
		n_dialog_1_2();
	};

	var genChart=function(type){
			var categories;
			if(type== 1) 
				categories=$(".tb-ind").map(function(){return $(this).val();});
			else if(type==2)
				categories=$(".tb-des").map(function(){return $(this).val();});
			$('#result_chart_div').highcharts({
			title: {
					text: '',
					x: -20 //center
			},
			xAxis: {
				/*title: {
					text: 'gg'
				},*/
				categories: categories //["物體在空氣中重量","物體在液體中重量"]
			},
			yAxis: {
					/*title: {
							text: '重量(克)'
					},*/
					plotLines: [{
							value: 0,
							width: 0.5,
							color: '#808080'
					}],
					/*min:-10,
					tickInterval:10*/
			},
			legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0
			},
		});
		var $chart=$('#result_chart_div').highcharts();
		if(type== 1) 
			$("input[class*='tb-des']").each(function(){
				var idx=$(this).attr('idx');
				var name=$(this).val();
				var datas=$(".tb-ans-input[idx='"+idx+"']").map(function(){return parseInt($(this).val());});//.val();
				//console.log(x);
				$chart.addSeries({name:name,data:datas});
			});
		else if(type==2)
			$("input[class*='tb-ind']").each(function(){
				$row=$(this).parent().parent();
				var name=$(this).val();
				var datas=$row.find(".tb-ans-input").map(function(){return parseInt($(this).val());});
				//var idx=$(this).attr('idx');
				
				//var datas=$(".tb-ans-input[idx='"+idx+"']").map(function(){return parseInt($(this).val());});//.val();
				//console.log(x);
				$chart.addSeries({name:name,data:datas});
			});
		$chart.redraw();
	}
	
	var n_dialog_1_1 = function(){	
		var radio_str = '<div class="text-center"><input type="radio" name="dialog-1-1" value="1" id="d-1-1-0"> <label for="d-1-1-0">是</label>'+
					'&nbsp;&nbsp;&nbsp;'+
					'<input type="radio" name="dialog-1-1" value="0" id="d-1-1-1"> <label for="d-1-1-1">否</label></div>';
		modal_dialog({
			title: title1,
			content: '<h4>開始模擬實驗後，你是否發現原本的實驗設計有問題導致實驗無法依設計執行？</br></br>'+radio_str+'</h4>',		
			button_1: {
				text: "送出",
				callBack: function(){
					var res = $('input[name="dialog-1-1"]:checked').val();
					if(res==0){						
						$('.tb-ind, .tb-des, .tb-ans-input').attr('disabled', false); 
						$table_button.unbind("click").click(stage2_3_edit) ;
						modal_hide();
					}else if(res==1){
						console.log(1);
						n_dialog_1_2();
					}
				}
			}	
		});

	};
	
	var n_dialog_1_2 = function(){
		var chkbox_str = '<input type="checkbox" name="editpart" value="suppose" id="d-s"> <label for="d-s">假設</label>&nbsp;'+
					'<input type="checkbox" name="editpart" value="variable" id="d-v"> <label for="d-v">變因</label>&nbsp;'+
					'<input type="checkbox" name="editpart" value="design" id="d-d"> <label for="d-d">實驗設計</label>&nbsp;'+
					'<input type="checkbox" name="editpart" value="simulation" id="d-sim"> <label for="d-sim">實驗模擬</label></br>'+
					'<input type="checkbox" name="editpart" value="others" id="d-o"> <label for="d-o">其他</label>&nbsp;'+
					'<input typt="text" value="" id="dialog-1-2-others">';
		modal_dialog({
			hidePre: false,
			title: title1,
			content: '<h4>請重新檢視並思考實驗設計有問題的原因，勾選你認為有問題的地方?</br></br>'+chkbox_str+'</h4>', // 3-4
			button_1: {
				text: "修改",
				callBack: function(){					 
					for(var i=0, $input; $input = $inputs[i]; ++i){
						$input.attr("disabled", false);
					}
					stage1_handle(false);
					$('.tb-ind, .tb-des, .tb-ans-input').attr('disabled', false); 
					$table_button.unbind("click").click(stage2_3_edit) ;
					modal_hide();
				}
			},
			button_2: {
				text: "完成",
				class: "btn btn-primary",
				callBack: function(){
					var need_edit = [];
					var pass = true ;
					$('input[name="editpart"]:checked').each(function(idx, dat){
						var tmp = { selection: $(dat).val() } ;
						if($(dat).val()=="others"){	
							var o_text = $("#dialog-1-2-others").val();
							if(o_text.length>0)
								tmp["text"] = o_text;
							else{
								alert("請填寫原因");
								pass = false ;
							}
						}
							
						need_edit.push(tmp);
					});
					if(need_edit.length>0){
						alert("請點選修改以修改該選項");
						return false ;
					}else if(!pass){
						return false ;
					}	
					data["dialog-1-2"] = need_edit ;
					
					if(!confirm("完成後將無法再修改內容，確定要送出嗎?"))
						return false ;
					stage = 3;
					for(var j=1; j<$inputs.length; ++j)
						$inputs[j].attr("disabled", true);
					
					$learn_stage1_form.hide();
					setup_toggle_button(); 
					$learn_stage3_form.show();
					$table_button.hide();
					modal_hide();
					alert('請依照實驗結果填寫結論');										
				}
			},
		});

	};


	var n_dialog_2_1 = function(){
		console.log("2-1");
		var textarea = '<textarea rows="3" class="form-control" id="modal-textarea"></textarea>' ;
		modal_dialog({
			title: title1,
			content: '<h4>請回想探究實驗歷程，在此過程中你學到了什麼科學概念？</br></br>'+textarea+'</h4>', // new 2-1	    
			button_1: {
				text: "儲存",
				callBack: function(){
					var text = $('#modal-textarea').val(); 
					if(text && text.length>0){
						data['dialog-2-1'] = text;
						n_dialog_2_2();
					}else{					
						alert("請填寫內容");
					}
				}
			}
		});
	};
	
	var n_dialog_2_2 = function(){
		var textarea = '<textarea rows="3" class="form-control" id="modal-textarea"></textarea>' ;
		modal_dialog({
			title: title1,
		  content: '<h4>請回想探究實驗歷程，在此過程中你學到如何進行實驗探究？</br></br>'+textarea+'</h4>', // new 2-1	    
		  button_1: {
				text: "儲存",
				callBack: function(){
						var text = $('#modal-textarea').val(); 
						if(text && text.length>0){
							data['dialog-2-2'] = text;
							n_dialog_2_3();
						}else{
							alert("請填寫內容");
							
						}
				}
			}
		});
	};
	
	var n_dialog_2_3 = function(){
		var chkbox_str = '<input type="checkbox" name="editpart" value="suppose" id="d3-s"> <label for="d3-s">假設</label> '+
						'<input type="checkbox" name="editpart" value="variable" id="d3-v"> <label for="d3-v"">變因</label> '+
						'<input type="checkbox" name="editpart" value="design" id="d3-d"> <label for="d3-d">實驗設計</label> '+
						'<input type="checkbox" name="editpart" value="simulation" id="d3-sim"> <label for="d3-sim">執行模擬實驗</label> '+
						'<input type="checkbox" name="editpart" value="summary" id="d3-sum"> <label for="d3-sum">結論</label></br>'+
						'<input type="checkbox" name="editpart" value="other" id="d3-o"> <label for="d3-o">其他</label> '+
						'<input type="text" value="" id="other-text" />';
		modal_dialog({
			title: title1,
		  content: '<h4>回想剛剛的探究歷程，請勾選你認為探究的過程中最困難的部分?(複選)</br></br>'+chkbox_str+'</h4>', //4-2-a1
		  button_1: {
				text: "儲存",
				callBack: function(){
					var res = [];
					var pass = true ;
					$('input[name="editpart"]:checked').each(function(idx, data){
						var select = $(data).val() ; 
						if(select=="other"){
							var o_text = $("#other-text").val() ;
							res.push({type:"other", content: o_text||"" });
							if(o_text.length==0){							
								alert("請填寫完整");
								pass = false ;
							}
						}else
							res.push(select);
					});
					if(res.length==0){
						alert("請至少勾選一項");
						return false ;
					}else if(!pass)
						return false ;
					data["dailog-2-3"] = res ;
					n_dialog_2_4();
			  },
			}
		});
	};
	
	var n_dialog_2_4 = function(){
		var textarea = '<textarea rows="3" class="form-control" id="modal-textarea"></textarea>' ;
		modal_dialog({
			title: title1,
		    content: '<h4>根據你所勾選的選項，請說明為什麼你覺得困難？你如何解決困難？</br></br>'+textarea+'</h4>', // new 2-1
		    button_1: {
					text: "儲存",
					callBack: function(){
						var text = $('#modal-textarea').val(); 
						if(text && text.length>0){
							data['dialog-2-4'] = text;
							n_dialog_2_5();
						}else{
							alert("請填寫內容");
							
						}
					}
			},
		});
	};
	
	var n_dialog_2_5 = function(){
		var textarea = '<textarea rows="3" class="form-control" id="modal-textarea"></textarea>' ;
		modal_dialog({
			title: title1,
		  content: '<h4>請回想探究歷程，你學到形成假設、變因與實驗設計之間的關係為何？</br></br>'+textarea+'</h4>', // new 2-1
		  button_1: {
				text: "儲存",
				callBack: function(){
					var text = $('#modal-textarea').val(); 
					if(text && text.length>0){
						data['dialog-2-5'] = text;
						n_dialog_2_6();
					}else{
						alert("請填寫內容");
						
					}		    	
				}
			}	
		});
	};
	
	var n_dialog_2_6 = function(){
		var textarea = '<textarea rows="3" class="form-control" id="modal-textarea"></textarea>' ;
		modal_dialog({
			title: title1,
		  content: '<h4>請回想探究歷程，你學到實驗設計與執行模擬實驗之間的關係為何？</br></br>'+textarea+'</h4>', // new 2-1	  
		  button_1: {
				text: "儲存",
				callBack: function(){
					var text = $('#modal-textarea').val(); 
					if(text && text.length>0){
						data['dialog-2-6'] = text;
						alert("學習單結束!");
						$summary_finish.unbind("click");
						modal_hide();
					}else{
						alert("請填寫內容");
						
					}		    	
				}
			}
		});
	};

	$summary_finish.click(function(){
		var pass = true ;
		
		// check text area value
		$.each(t_summary, function(idx, dat){
			var $input = $('#'+dat) ;	
			if($input.val().length==0) 
				pass = false ;
			else
				data[dat] = $input.val(); 
		});
		if(!pass){
			alert("請填寫完整");
			return ;
		}
		
		// check checkbox selected	
		var support = $('input[name=summary-sup]:checked').val() ;
		if(!support){
			alert("請選擇是否支持假設");
			return ;
		}
		data["summary-sup"] = support;
		
		/////
		if(!confirm("送出後無法修改，確定作答無誤嗎?")) return ;		
		$(this).remove();
		if(options["mode"])
			n_dialog_2_1();
		else
			alert("學習單結束");
		
	});

	

	stage1_handle(true);


}

/*$(function(){
    var var_cnt = 0 ;
    var $inputs = [$("#exp-suppose"), $("#independent-var"), $("#dependent-var"), $("#control-var")] ;
    var $summary_inputs = [$("#summary-1"), $("#summary-2"), $("#summary-3")];
    var $finish = $('#summary-finish');
    var $modal = $('#questions');
    var $modal_title = $('#modal-title');
    var $modal_content = $('#modal-answer');
    var $modal_save = $('#modal-save');
    $(".tb-ans").hide();
		//set number only
		$("input[class*='tb-ans']").attr('onkeypress','return event.charCode >= 48 && event.charCode <= 57');
		
    for(var i=0, $input; $input = $inputs[i]; ++i){
        $input.click(function(){
            //console.log($(this).attr('placeholder'));
            $modal_title.html($(this).attr('placeholder'));
            $modal_content.val('');
             
            $modal_save.unbind('click');
            $modal_save.click(function(event){
                var text = $modal_content.val() ;
                if(text.length==0){
                    alert("請填寫完整");
                    return false ;
                }
                $(this).val(text);
                $(this).attr('disabled', true);
                $modal.modal('hide');
                var_cnt++ ;
                if(var_cnt==$inputs.length){
									$("#exp-table-div").removeClass("hidden");
									$("#result_chart_div").removeClass("hidden");
                  
									//$("#exp-var-form").addClass("hidden");
                }
                 
            }.bind(this));
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
        alert("學習單結束!!!");
         
    });
     
});

function canSimulation(){
	var inputDone=true;
	$("#exp-table").find(".tb-des").each(function(index,value){
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
	if(canSimulation()){
		alert("實驗已開始!");
		$obj.attr("onClick","startConclusion();");
		setDraggable();
		$("#reset").removeClass("disabled");
		$("#go").removeClass("disabled");
		$(".btn-liquid").removeClass("disabled");
		$(".tb-ans").show();
	}
	else{
		alert("有表格尚未填寫!");
	}
}
function startConclusion(){
	//$(this).addClass("hidden");
	if(canConclusion()){
		drawChart();
		$("#exp-var-form").addClass("hidden");
		$("#conclusion").removeClass("hidden");
		$("#toggle-exp-form").css("visibility","visible");//removeClass("hidden");
		$("#exp-table").find("input").attr("disabled","true");
	}
	else{
		alert("有表格尚未填寫!");
	}
};
*/