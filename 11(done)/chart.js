/*
function setChart(div_id,data){
	$('#'+div_id).highcharts({
		title: {
				text: '',
				x: -20 //center
		},
		xAxis: {
			title: {
						text: '溶液'
				},
			categories: ["沒入水","沒入酒精","沒入飽和鹽水"]
		},
		yAxis: {
				title: {
						text: '減輕重量(g)'
				},
				plotLines: [{
						value: 0,
						width: 0.5,
						color: '#808080'
				}],
				min:30,
				tickInterval:10
		},
		legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
		},
	});
	
	for(var key in data){
		$('#'+div_id).highcharts().addSeries({name:key});
	}
	
}
*/
function drawChart(){
	$('#result_chart_div').highcharts({
		title: {
				text: '',
				x: -20 //center
		},
		xAxis: {
			/*title: {
				text: 'gg'
			},*/
			categories: $("input[class*='item']").map(function(){return $(this).val();}) //["物體在空氣中重量","物體在液體中重量"]
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
				//min:-10,
				//tickInterval:10
		},
		legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
		},
	});
	var $chart=$('#result_chart_div').highcharts();
	$(".tb-des").each(function(){
		$row=$(this).parent().parent();
		var datas=$row.find(".tb-ans").map(function(){return parseInt($(this).val());});
		//return $(this).val();
		$chart.addSeries({name:$(this).val(),data:datas});
	});

}
