/*  Javascript Document:Bas_lan.js  */
/*  实例默认 3-6下行 7-10上行  */
var G_QosQueue = [];
var G_QoSRule = [];
var n = 0, m = 0;
<?objget :InternetGatewayDevice.QueueManagement.Queue. "QueueEnable SchedulerAlgorithm QueueWeight X_TWSZ-COM_EnableDSCPMark X_TWSZ-COM_EnableCOSMark ShapingRate"
`	G_QosQueue[n] = [];
	G_QosQueue[n][0] = "InternetGatewayDevice.QueueManagement.Queue.$00.";
	G_QosQueue[n][1] = "$01";
	G_QosQueue[n][2] = "$02";
	G_QosQueue[n][3] = "$03";
	G_QosQueue[n][4] = "$04";
	G_QosQueue[n][5] = "$05";
	G_QosQueue[n][6] = "$06";
	n++;
`?>
<?objget :InternetGatewayDevice.QueueManagement.Classification. "ClassificationEnable ClassInterface DestMACAddress DestIP DestMask DestPort DestPortRangeMax SourceMACAddress SourceIP SourceMask SourcePort SourcePortRangeMax Protocol VLANIDCheck DSCPCheck EthernetPriorityCheck DSCPMark EthernetPriorityMark ClassQueue"
`	G_QoSRule[m] = [];
	G_QoSRule[m][0] = "InternetGatewayDevice.QueueManagement.Classification.$00.";
	G_QoSRule[m][1] 	= "$01";		//ClassificationEnable
	G_QoSRule[m][2] 	= ("$02".indexOf('LAN') >= 0 || "$02".indexOf('Local') >= 0) ? "UP" : "DOWN";		//ClassInterface
	G_QoSRule[m][3] 	= "$03"			//DestMACAddress
	G_QoSRule[m][4] 	= "$04";		//DestIP
	G_QoSRule[m][5] 	= "$05";		//DestMask
	G_QoSRule[m][6] 	= "$06";		//DestPort
	G_QoSRule[m][7] 	= "$07";		//DestPortRangeMax
	G_QoSRule[m][8] 	= "$08";		//SourceMACAddress
	G_QoSRule[m][9] 	= "$09";		//SourceIP
	G_QoSRule[m][10] 	= "$0a";		//SourceMask
	G_QoSRule[m][11] 	= "$0b";		//SourcePort
	G_QoSRule[m][12] 	= "$0c";		//SourcePortRangeMax
	G_QoSRule[m][13] 	= "$0d";		//Protocol
	G_QoSRule[m][14] 	= "$0e";		//VLANIDCheck
	G_QoSRule[m][15] 	= "$0f";		//DSCPCheck
	G_QoSRule[m][16] 	= "$0g";		//EthernetPriorityCheck
	G_QoSRule[m][17] 	= "$0h";		//DSCPMark
	G_QoSRule[m][18] 	= "$0i";		//EthernetPriorityMark
	G_QoSRule[m][19] 	= "$0j";		//ClassQueue
	m++;
`?>

var G_QoSEnable = "<?get :InternetGatewayDevice.QueueManagement.Enable?>";
var DSCP_Text  = ["Not Match", 'AF11(001010)','AF12(001100)','AF13(001110)','AF21(010010)','AF22(010100)','AF23(010110)','AF31(011010)','AF32(011100)','AF33(011110)','AF41(100010)','AF42(100100)','AF43(100110) ','CS1(001000)','CS2(010000)','CS3(011000)','CS4(100000)','CS5(101000)','CS6(110000)','CS7(111000)','EF(101110)','Default'];
var DSCP_Value = ['-1', '10','12','14','18','20','22','26','28','30','34','36','38','8','16','24','32','40','48','56','46','0']; 
//加载初始势
function uiOnload(){
	//
	Form.Radio("RAD_qos", G_QoSEnable);
	onClkEnable();
	onClkUpDonwlink();
//	onClkDisclip();
	//create table
	creQoSTable();
}
//创建规则表格
function creQoSTable(){
	var arr_value = [];
	for(var i=0, len=G_QoSRule.length; i<len; i++){
		arr_value[i] = [];
		arr_value[i].push(i+1);
		arr_value[i].push(G_QoSRule[i][1] == "1" ? "YES" : "NO");
		arr_value[i].push(reRule(i));
		arr_value[i].push(reAction(i));
		arr_value[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="EditEntry('+ i +')"/>');
		arr_value[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="RemoveEntry('+ i +')"/>');
	}
	$T('ta_qosrules',arr_value);
}

function reRule(xValue){
	var _reRule = "";
	_reRule += "Source/Destination MAC Address : " + G_QoSRule[xValue][8] + "/" + G_QoSRule[xValue][3];
	_reRule += "<br>Source/Destination IP Address : " + G_QoSRule[xValue][9] + "/" + G_QoSRule[xValue][4];
	_reRule += "<br>Source/Destination Mask Address : " + G_QoSRule[xValue][10] + "/" + G_QoSRule[xValue][5];
	_reRule += "<br>VLAN ID : " + G_QoSRule[xValue][14];
	_reRule += "<br>802.1p : " + G_QoSRule[xValue][16];
	_reRule += "<br>DSCP Value : " + G_QoSRule[xValue][15];
	_reRule += "<br>Protocol Type : " + reProtocol(G_QoSRule[xValue][13]);
	_reRule += "<br>Source Port Range : " + G_QoSRule[xValue][11] +"~"+G_QoSRule[xValue][12];
	_reRule += "<br>Destination Port Range : " + G_QoSRule[xValue][6] +"~"+G_QoSRule[xValue][7];	
	return _reRule;
}
function reProtocol(){
	var PROTOCOL;
	switch(arguments[0]){
		case '-1':{
			PROTOCOL = "Do Not Match";
			break;
		}
		case '0':{
			PROTOCOL = 'TCP/UDP';
			break;
		}
		case '1':{
			PROTOCOL = 'ICMP';
			break;
		}
		case '58':{
			PROTOCOL = 'ICMP';
			break;
		}
		case '2':{
			PROTOCOL = 'IGMP';
			break;
		}
		case '6':{
			PROTOCOL = 'TCP';
			break;
		}
		case '17':{
			PROTOCOL = 'UDP';
			break;
		}
		case '1000':{
			PROTOCOL = 'RTP';
			break;
		}
	}
	return PROTOCOL;
}

function reAction(xValue){
	var _reAction = "";
	_reAction += "DSCP Remark : " + G_QoSRule[xValue][17];
	_reAction += "<br>802.1p Remark : " + G_QoSRule[xValue][18];
	_reAction += "<br>Queue # : " + G_QoSRule[xValue][2]+"_Q_"+G_QoSRule[xValue][19];	
	return _reAction;
}

//灰显控制
function onClkEnable(){
	//onload 初始势

	xValue = Form.Radio("RAD_qos");
	
	if(xValue == "1"){
		disCtrl("tb_queue", true);
		disCtrl("tb_addbutton", true);
	}else{
		disCtrl("tb_queue", false);
		disCtrl("tb_addbutton", false);
	}
}

//上下行选择
function onClkUpDonwlink(){
	//onload 初始势
    xValue = Form.Radio("RAD_direct");
	
	if(xValue == "Downlink"){
		Form.Radio("RAD_queue",         G_QosQueue[1][1]);
		Form.Radio("RAD_Discip",        G_QosQueue[6][2]);
		Form.Checkbox("CHB_DSCPMark",   G_QosQueue[1][4]);
		Form.Checkbox("CHB_8021pMark",  G_QosQueue[1][5]);
		setJSONValue({
			"INPUT_ShapingRate" : G_QosQueue[1][6] || "",
			"INPUT_Hightest" 	: G_QosQueue[6][3] || "8",
			"INPUT_High" 		: G_QosQueue[7][3] || "4",
			"INPUT_Medium" 		: G_QosQueue[8][3] || "2",
			"INPUT_Low" 		: G_QosQueue[9][3] || "1"
		});
	}else{
		Form.Radio("RAD_queue",         G_QosQueue[0][1]);
		Form.Radio("RAD_Discip",        G_QosQueue[2][2]);
		Form.Checkbox("CHB_DSCPMark",   G_QosQueue[0][4]);
		Form.Checkbox("CHB_8021pMark",  G_QosQueue[0][5]);
		setJSONValue({
			"INPUT_ShapingRate" : G_QosQueue[0][6] || "",
			"INPUT_Hightest" 	: G_QosQueue[2][3] || "8",
			"INPUT_High" 		: G_QosQueue[3][3] || "4",
			"INPUT_Medium" 		: G_QosQueue[4][3] || "2",
			"INPUT_Low" 		: G_QosQueue[5][3] || "1"
		});
	}
    onClkDisclip();
}

//灰显控制
function onClkDisclip(){
	//onload 初始势
    
	xValue = Form.Radio('RAD_Discip');
	
	if(xValue == "WRR"){
		$('INPUT_Hightest').disabled = false;
		$('INPUT_High').disabled = false;
		$('INPUT_Medium').disabled = false;
		$('INPUT_Low').disabled = false;
	}else{
		$('INPUT_Hightest').disabled = true;
		$('INPUT_High').disabled = true;
		$('INPUT_Medium').disabled = true;
		$('INPUT_Low').disabled = true;
	}	
}

//编辑
function EditEntry(xValue){
	var Path = G_QoSRule[xValue][0];
	$H({
		'var:Idx'    : Path.split('.')[3],
		'var:action' 	: "1",
		'var:menu'      : G_Menu,
		'var:page' 	: G_Page,
		'var:subpage' 	: "Adv_qosrules",
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	});
	
	$('uiPostForm').submit();
}

//删除
function RemoveEntry(xValue){
	if(!confirm(SEcode[1001])){
		return false;
	}
	//alert(G_QoSRule[xValue][0]);
	$H({
		'del-obj'       : G_QoSRule[xValue][0],
		'obj-action'    : 'del',
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	},true);
	$('uiPostForm').submit();
}

//提交配置
function uiSubmit(){
	$H({
	   	":InternetGatewayDevice.QueueManagement.Enable" : Form.Radio('RAD_qos'),
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
	var _queueenable = Form.Radio('RAD_queue');
	var _scheduler   = Form.Radio('RAD_Discip');
	if(Form.Radio('RAD_qos') == "1" && Form.Radio("RAD_direct") == "Downlink"){
		if (_scheduler != G_QosQueue[6][2]){
			_queueenable = "0";
		}
        $F(":InternetGatewayDevice.QueueManagement.Queue.2.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.2.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.2.ShapingRate",	 	$('INPUT_ShapingRate').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.2.X_TWSZ-COM_EnableDSCPMark",	Form.Checkbox('CHB_DSCPMark'));
		$F(":InternetGatewayDevice.QueueManagement.Queue.2.X_TWSZ-COM_EnableCOSMark",	Form.Checkbox('CHB_8021pMark'));
		$F(":InternetGatewayDevice.QueueManagement.Queue.7.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.7.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.7.X_TWSZ-COM_EnableForceWeight", 1);
		$F(":InternetGatewayDevice.QueueManagement.Queue.7.QueueWeight",	 $('INPUT_Hightest').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.8.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.8.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.8.X_TWSZ-COM_EnableForceWeight", 1);
		$F(":InternetGatewayDevice.QueueManagement.Queue.8.QueueWeight",	 $('INPUT_High').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.9.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.9.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.9.X_TWSZ-COM_EnableForceWeight", 1);
		$F(":InternetGatewayDevice.QueueManagement.Queue.9.QueueWeight",	 $('INPUT_Medium').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.10.QueueEnable",	 _queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.10.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.10.QueueWeight",	 $('INPUT_Low').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.10.X_TWSZ-COM_EnableForceWeight", 1);
	}else if(Form.Radio('RAD_qos') == "1" && Form.Radio("RAD_direct") == "Uplink"){
		if (_scheduler != G_QosQueue[2][2]){
			_queueenable = "0";
		}
        $F(":InternetGatewayDevice.QueueManagement.Queue.1.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.1.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.1.ShapingRate", 		$('INPUT_ShapingRate').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.1.X_TWSZ-COM_EnableDSCPMark",	Form.Checkbox('CHB_DSCPMark'));
		$F(":InternetGatewayDevice.QueueManagement.Queue.1.X_TWSZ-COM_EnableCOSMark",	Form.Checkbox('CHB_8021pMark'));
		$F(":InternetGatewayDevice.QueueManagement.Queue.3.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.3.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.3.QueueWeight",	 $('INPUT_Hightest').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.4.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.4.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.4.QueueWeight",	 $('INPUT_High').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.5.QueueEnable", 	_queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.5.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.5.QueueWeight",	 $('INPUT_Medium').value);
		$F(":InternetGatewayDevice.QueueManagement.Queue.6.QueueEnable",	 _queueenable);
		$F(":InternetGatewayDevice.QueueManagement.Queue.6.SchedulerAlgorithm", _scheduler);
		$F(":InternetGatewayDevice.QueueManagement.Queue.6.QueueWeight",	 $('INPUT_Low').value);
	}
	
	$('uiPostForm').submit();
}

//添加
function uiAdd(){
	$H({
	   	":InternetGatewayDevice.QueueManagement.Enable" 	: Form.Radio('RAD_qos'),
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:action" 		: "0",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		'var:subpage' 		: "Adv_qosrules",
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
//监听加载与错误处理函擿
addListeners(uiOnload, dealWithError);