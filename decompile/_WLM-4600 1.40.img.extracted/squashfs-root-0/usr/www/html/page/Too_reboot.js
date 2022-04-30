/*  JavaScript Document  */

function onClkStart(xValue){
	if(xValue == undefined){
		xValue = "1";
	}
	if(xValue == "1"){
		$("tb_currestart").style.display = "";
		$("tb_facrestart").style.display = "none";
	}else{
		$("tb_currestart").style.display = "none";
		$("tb_facrestart").style.display = "";
	}
}
