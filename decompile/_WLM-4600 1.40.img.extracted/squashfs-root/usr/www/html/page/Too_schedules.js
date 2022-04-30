/* JavaScript Document */
var G_SchedEntry = [];
var n = 0;
<?objget :InternetGatewayDevice.X_TWSZ-COM_SCHEDULES.SchedEntry. "SchedName SchedUsed EnableAllDays SelectDays EnableAllTimes StartTime EndTime"
`	G_SchedEntry[n] = [];
	G_SchedEntry[n][0] = "$01";   	//ScheduleName
	G_SchedEntry[n][1] = "$02";	//ScheduleUsed	
	G_SchedEntry[n][2] = "$03";	//EnableAllDays
	G_SchedEntry[n][3] = "$04";	//SelectDays
	G_SchedEntry[n][4] = "$05";	//EnableAllTimes
	G_SchedEntry[n][5] = "$06";	//StartTime
	G_SchedEntry[n][6] = "$07";	//EndTime
	G_SchedEntry[n][7] = "InternetGatewayDevice.X_TWSZ-COM_SCHEDULES.SchedEntry.$00.";    //path
	G_SchedEntry[n][8] = "$00";   	//index
	++n;
`?>
//全局变量
var addAction = G_Error == "1" ? "<?echo $var:addAction?>" : "0";	//0 ==> 添加 1 ==> 编辑
var editIdx   = "<?echo $var:editIdx?>" == "-" ? "0" : "<?echo $var:editIdx?>";

//加载初始化
function uiOnload(){
	CreateTable();
}
//DHCPv6 DNS Server 
function onClkgetDNSMode(xValue){
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio('RAD_getDNSMode');
	}	
	if(xValue == "DHCP"){
		$('INPUT_V6PriDNS').disabled = true;
		$('INPUT_V6SecDNS').disabled = true;
	}else{
		$('INPUT_V6PriDNS').disabled = false;
		$('INPUT_V6SecDNS').disabled = false;
	}
}

//select all day
function changeDaysSelect(){
	var _input=$('daysArea').getElementsByTagName('INPUT');
	if($('RAD_Allweek').checked){
		for(var k = 0, _len = _input.length; k < _len; k++){
			_input[k].checked = true;
			_input[k].disabled = true;
		}
	}else{
		for(var k = 0, _len = _input.length; k < _len; k++){
			_input[k].checked = false;
			_input[k].disabled = false;	
		}
	}
}
//Set all time
function SetWholeDay(){	
	if($('CHB_Allday').checked){
		$('INPUT_StartTS').value="00";
		$('INPUT_StartTE').value="00";
		$('INPUT_EndTS').value="23";
		$('INPUT_EndTE').value="59";
		$('INPUT_StartTS').disabled=true;
		$('INPUT_StartTE').disabled=true;
		$('INPUT_EndTS').disabled=true;
		$('INPUT_EndTE').disabled=true;
	}else{
		$('INPUT_StartTS').value="";
		$('INPUT_StartTE').value="";
		$('INPUT_EndTS').value="";
		$('INPUT_EndTE').value="";
		$('INPUT_StartTS').disabled=false;
		$('INPUT_StartTE').disabled=false;
		$('INPUT_EndTS').disabled=false;
		$('INPUT_EndTE').disabled=false;
	}
	return true;	
}
function CreateTable(){
	var value_array = [];
	for(var i = 0; i < G_SchedEntry.length; i++){
		value_array[i] = [];
		value_array[i].push(i+1); //schedules index
		value_array[i].push(G_SchedEntry[i][0]); //schedules name
		var day=G_SchedEntry[i][3];
		if(day.indexOf('Sun')!=-1){
			value_array[i].push("&#8730;"); //Sun
		}else{
			value_array[i].push("&nbsp;"); //Sun
		}
		if(day.indexOf('Mon')!=-1)
			value_array[i].push("&#8730;"); //Mon
		else
			value_array[i].push("&nbsp;"); //Mon
		if(day.indexOf('Tue')!=-1)
			value_array[i].push("&#8730;"); //Tue
		else
			value_array[i].push("&nbsp;"); //Tue
		if(day.indexOf('Wed')!=-1)
			value_array[i].push("&#8730;"); //Wed
		else
			value_array[i].push("&nbsp;"); //Wed
		if(day.indexOf('Thu')!=-1)
			value_array[i].push("&#8730;"); //Thu
		else
			value_array[i].push("&nbsp;"); //Thu
		if(day.indexOf('Fri')!=-1)
			value_array[i].push("&#8730;"); //Fri
		else
			value_array[i].push("&nbsp;"); //Fri
		if(day.indexOf('Sat')!=-1)
			value_array[i].push("&#8730;"); //Sat
		else
			value_array[i].push("&nbsp;"); //Sat
			
		value_array[i].push(G_SchedEntry[i][5]); //StartTime
		value_array[i].push(G_SchedEntry[i][6]); //EndTime
		value_array[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="EditEntry('+ i +')"/>');
		value_array[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="RemoveEntry('+ i +')"/>');
	}	
	$T('tb_scherule',value_array);

}
//编辑
function EditEntry(_idx){
	addAction = "1";	//编辑标志
	editIdx = G_SchedEntry[_idx][8];
	var starttime= G_SchedEntry[_idx][5];
	var num=starttime.indexOf(':');
	var starttimeh=starttime.substring(0,num);
	var starttimem=starttime.substring(num+1,starttime.length+1);
	var endtime= G_SchedEntry[_idx][6];
	var num=endtime.indexOf(':');
	var endtimeh=endtime.substring(0,num);
	var endtimem=endtime.substring(num+1,endtime.length+1);
	
	var day=G_SchedEntry[_idx][3];			
	if(day.indexOf('Sun')!=-1){
		var SunEnable=1; //Sun
	}else{
		var SunEnable=0; //Sun
	}
	if(day.indexOf('Mon')!=-1)
		var MonEnable=1; //Mon
	else
		var MonEnable=0; //Mon
	if(day.indexOf('Tue')!=-1)
		var TueEnable=1; //Tue
	else
		var TueEnable=0; //Tue
	if(day.indexOf('Wed')!=-1)
		var WedEnable=1; //Wed
	else
		var WedEnable=0; //Wed
	if(day.indexOf('Thu')!=-1)
		var ThuEnable=1; //Thu
	else
		var ThuEnable=0; //Thu
	if(day.indexOf('Fri')!=-1)
		var FriEnable=1; //Fri
	else
		var FriEnable=0; //Fri
	if(day.indexOf('Sat')!=-1)
		var SatEnable=1; //Sat
	else
		var SatEnable=0; //Sat
	Form.Radio("RAD_Day", G_SchedEntry[_idx][2]);
	setJSONValue({
		"INPUT_Name" 	: G_SchedEntry[_idx][0],
		"CHB_Sun"	: SunEnable,
		"CHB_Mon" 	: MonEnable,
		"CHB_Tue" 	: TueEnable,
		"CHB_Wed" 	: WedEnable,
		"CHB_Thu" 	: ThuEnable,
		"CHB_Fri" 	: FriEnable,
		"CHB_Sat" 	: SatEnable,
		"CHB_Allday" 	: G_SchedEntry[_idx][4],
		"INPUT_StartTS" : starttimeh,
		"INPUT_StartTE" : starttimem,
		"INPUT_EndTS" 	: endtimeh,
		"INPUT_EndTE" 	: endtimem
	});
	
	if($('CHB_Allday').checked){
		$('INPUT_StartTS').disabled=true;
		$('INPUT_StartTE').disabled=true;
		$('INPUT_EndTS').disabled=true;
		$('INPUT_EndTE').disabled=true;
	}
	if($('RAD_Allweek').checked){
		var _input=$('daysArea').getElementsByTagName('INPUT');
		for(var k = 0, _len = _input.length; k < _len; k++){
			_input[k].disabled = true;
		}
	}
}
//
function FullFillTimeBlank(_nodes){
	var num;
	num = parseInt(_nodes[1].value);
	if (num < 9)
		_nodes[1].value = "0" + num;
	num = parseInt(_nodes[2].value);
	if (num < 9)
		_nodes[2].value = "0" + num;
	num = parseInt(_nodes[3].value);
	if (num < 9)
		_nodes[3].value = "0" + num;
	num = parseInt(_nodes[4].value);
	if (num < 9)
		_nodes[4].value = "0" + num;
}
//var addAction = 0;	//0 ==> 添加 1 ==> 编辑
//var editIdx=0;
function uiSubmit(){
	var _nodes = $('INPUT_Name','INPUT_StartTS','INPUT_StartTE','INPUT_EndTS','INPUT_EndTE');
	FullFillTimeBlank(_nodes);
	var starttime=_nodes[1].value+':'+_nodes[2].value;
	var endtime=_nodes[3].value+':'+_nodes[4].value;
	var selectdays='';
	if($('CHB_Sun').checked)
	     selectdays='Sun,';
	if($('CHB_Mon').checked)
	     selectdays+='Mon,';
	if($('CHB_Tue').checked)
	     selectdays+='Tue,';
	if($('CHB_Wed').checked)
	     selectdays+='Wed,';
	if($('CHB_Thu').checked)
	     selectdays+='Thu,';
	if($('CHB_Fri').checked)
	     selectdays+='Fri,';
	if($('CHB_Sat').checked)
	     selectdays+='Sat,';
	    
	//alert(addAction);
	if(addAction=='0'){
		$H({
		   	'add-obj'		:'InternetGatewayDevice.X_TWSZ-COM_SCHEDULES.SchedEntry.',
			':SchedName'   		: _nodes[0].value,
			':EnableAllDays'   	: Form.Radio('RAD_Day')=='1'?1:0,
			':SelectDays'   	: selectdays,
			':EnableAllTimes' 	: Form.Checkbox('CHB_Allday'),
			':StartTime'   		: starttime,
			':EndTime'   		: endtime,
			'obj-action' 		: 'add-set',
			'var:menu' 		: G_Menu,
			'var:page' 		: G_Page,
			'var:errorpage' 	: G_Page,
			'var:addAction' 	: "0",
			'getpage' 		: 'html/index.html',
			'errorpage' 		: 'html/index.html',
			'var:CacheLastData'	: ViewState.Save()
		}, true);
	}else if(addAction=='1'){
		$H({
			'obj-action' 		: 'set',
			'var:menu' 		: G_Menu,
			'var:page' 		: G_Page,
			'var:errorpage' 	: G_Page,
			'var:addAction' 	: "1",			
			'var:editIdx' 		: editIdx,
			'getpage' 		: 'html/index.html',
			'errorpage' 		: 'html/index.html',
			'var:CacheLastData'	: ViewState.Save()
		}, true);
		var path=':InternetGatewayDevice.X_TWSZ-COM_SCHEDULES.SchedEntry.'+editIdx+ ".";
		$F(path+'SchedName',_nodes[0].value);
		var EnableValue=0;
		if($('RAD_Allweek').checked){
			EnableValue=1;
		}
		$F(path+'EnableAllDays', EnableValue);
		$F(path+'SelectDays', selectdays);
		EnableValue=0;
		if($('CHB_Allday').checked){
			EnableValue=1;
		}
		$F(path+'EnableAllTimes', EnableValue);
		$F(path+'StartTime', starttime);
		$F(path+'EndTime', endtime);
	}
	
	$('uiPostForm').submit();
}

//删除
function RemoveEntry(Idx){
	if(!confirm(SEcode[1001])){
		return false;
	}
	var _path = G_SchedEntry[Idx][7];
	$H({
	   	"del-obj" 		: _path,
	   	"obj-action" 		: "del",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
	$('uiPostForm').submit();
}

//错误处理函数
function dealWithError(){
	if (G_Error != 1){ 
		return false;
	}
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}
//监听加载与错误处理函数
addListeners(uiOnload, dealWithError);