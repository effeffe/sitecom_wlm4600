/*  Javascript Document:Adv_qosrules.js  */
var G_Classification = [];
<?if eq $var:action `1`
`	<?mget :InternetGatewayDevice.QueueManagement.Classification.$var:Idx. "ClassificationEnable ClassInterface DestMACAddress DestIP DestMask DestPort DestPortRangeMax SourceMACAddress SourceIP SourceMask SourcePort SourcePortRangeMax Protocol VLANIDCheck DSCPCheck EthernetPriorityCheck DSCPMark EthernetPriorityMark ClassQueue"
	`	G_Classification['Path'] 		= "InternetGatewayDevice.QueueManagement.Queue.$00.";
		G_Classification['Enable'] 		= "$01";		//ClassificationEnable
		G_Classification['Interface'] 		= "$02";		//ClassInterface
		G_Classification['Direction'] 		= ("$02".indexOf('LAN') > -1 || "$02".indexOf('Local') > -1) ? "UP" : "DOWN";
		G_Classification['DestMACAddress'] 	= "$03";		//DestMACAddress
		G_Classification['DestIP'] 		= "$04";		//DestIP
		G_Classification['DestMask'] 		= "$05";		//DestMask
		G_Classification['DestPort'] 		= "$06";		//DestPort
		G_Classification['DestPortRangeMax'] 	= "$07";		//DestPortRangeMax
		G_Classification['SourceMACAddress'] 	= "$08";		//SourceMACAddress
		G_Classification['SourceIP'] 		= "$09";		//SourceIP
		G_Classification['SourceMask'] 		= "$0a";		//SourceMask
		G_Classification['SourcePort'] 		= "$0b";		//SourcePort
		G_Classification['SourcePortRangeMax'] 	= "$0c";		//SourcePortRangeMax
		G_Classification['Protocol'] 		= "$0d";		//Protocol
		G_Classification['VLANIDCheck'] 	= "$0e";		//VLANIDCheck
		G_Classification['DSCPCheck'] 		= "$0f";		//DSCPCheck
		G_Classification['EthernetPriorityCheck'] = "$0g";		//EthernetPriorityCheck
		G_Classification['DSCPMark'] 		= "$0h";		//DSCPMark
		G_Classification['EthernetPriorityMark'] = "$0i";		//EthernetPriorityMark
		G_Classification['ClassQueue'] 		= "$0j";		//ClassQueue
	`?>
`?>

var G_UPDSCPRemark = "<?get :InternetGatewayDevice.QueueManagement.Queue.1.X_TWSZ-COM_EnableDSCPMark?>";
var G_UP8021pRemark= "<?get :InternetGatewayDevice.QueueManagement.Queue.1.X_TWSZ-COM_EnableCOSMark?>";
var G_DOWNDSCPRemark = "<?get :InternetGatewayDevice.QueueManagement.Queue.2.X_TWSZ-COM_EnableDSCPMark?>";
var G_DOWN8021pRemark= "<?get :InternetGatewayDevice.QueueManagement.Queue.2.X_TWSZ-COM_EnableCOSMark?>";

//获取LAN
var G_Upstream = [];
var t = 0;
<?objget :InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig. "X_TWSZ-COM_Description"
`	G_Upstream[t] = ["$01","InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.$00"];
	t++;
`?>
//获取WLAN
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "SSID"
`	G_Upstream[t] = ["$01","InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00"];
	t++;
`?>
var G_WANConn = [];
var m = 0;
//获取wan
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00";	//Path
			G_WANConn[m][1] = "$01";	//Name
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00";	//Path
			G_WANConn[m][1] = "$01";	//Name
			m++;
		`?>
	`?>
`?>

//全局变量
var action = "<?echo $var:action?>";		//0 ==> 新增 ==> 编辑
var indexNum = "<?echo $var:Idx?>";

//加载初始势
function uiOnload(){
	//createDESP select
	createDSCPValueOption();
	if(G_Classification['Direction'] == undefined){
		$('RAD_Upstream').disabled = false;
		$('RAD_Downstream').disabled = false;
		Form.Radio("RAD_Classify", "DOWN");
	}else{
		$('RAD_Upstream').disabled = true;
		$('RAD_Downstream').disabled = true;
		Form.Radio("RAD_Classify", G_Classification['Direction']);
	}
	crtIOoption();
	if(action == "1"){		
		Form.Radio("RAD_RuleActive", G_Classification['Enable']);
		Form.Select("SEL_Interface", G_Classification['Interface']);
		if (Number(G_Classification['ClassQueue']) > 6){
			G_Classification['ClassQueue'] = Number(G_Classification['ClassQueue']) - 4;
		}
		
		setJSONValue({
			"INPUT_DestMac" 	: G_Classification['DestMACAddress'],
			"INPUT_DestIp" 		: G_Classification['DestIP'],
			"INPUT_DestMask" 	: G_Classification['DestMask'],
			"INPUT_DestPortStart" 	: G_Classification['DestPort'],
			"INPUT_DestPortEnd" 	: G_Classification['DestPortRangeMax'],
			"INPUT_SrcMac" 		: G_Classification['SourceMACAddress'],
			"INPUT_SrcIp" 		: G_Classification['SourceIP'],
			"INPUT_SrcMask" 	: G_Classification['SourceMask'],
			"INPUT_SrcPortStart" 	: G_Classification['SourcePort'],
			"INPUT_SrcPortEnd" 	: G_Classification['SourcePortRangeMax'],
			"SEL_Protocol" 		: G_Classification['Protocol'],
			"INPUT_VlanID" 		: G_Classification['VLANIDCheck'],
			"SEL_DSCP" 		: G_Classification['DSCPCheck'],
			"SEL_802_1p" 		: G_Classification['EthernetPriorityCheck'],
			"SEL_DSCPRemark" 	: G_Classification['DSCPMark'],
			"SEL_802Remark" 	: G_Classification['EthernetPriorityMark'],
			"SEL_Queue" 		: G_Classification['ClassQueue']
		});
	}
	//action 灰显控制
	onCtrlAction();
    onCtrl802App();
    SelProtocolChanged();
}

function onCtrl802App(){
    var tmp802remark = $('SEL_802Remark').value;
    
    switch(tmp802remark){
        case"7":
            Form.Select("SEL_802app", "keynet");
            break;
        case"6":
            Form.Select("SEL_802app", "voice");
            break;
        case"5":
            Form.Select("SEL_802app", "video");
            break;
        case"4":
            Form.Select("SEL_802app", "igmp");
            break;
        case"3":
            Form.Select("SEL_802app", "keydata");
            break;
        default:
            Form.Select("SEL_802app", "nomatch");
            break;
    }
}

//创建接口
function crtIOoption(){
	var _text = [], _value = [];
	if(Form.Radio("RAD_Classify") == "UP"){
		_text.push(["Local"],["LAN"]);
		_value.push(["Local"],["LAN"]);
		for(var i=0; i<G_Upstream.length; i++){
			_text.push(G_Upstream[i][0]);
			_value.push(G_Upstream[i][1]);
		}
	}else{
		_text.push("WAN");
		_value.push("WAN");
		/*
		for(var i=0; i<G_WANConn.length; i++){
            if (G_WANConn[i][1].indexOf('Bridge') > -1){
                continue;
            }
			_text.push(G_WANConn[i][1]);
			_value.push(G_WANConn[i][0]);
		}
		*/
	}
	
	$S('SEL_Interface',_text,_value);
}
//控制Remark是否可配
function onCtrlAction(xValue){
	//onload 初始势
	if(xValue == undefined){
		xValue = Form.Radio("RAD_Classify");
	}
	if(xValue == "UP"){
		if(G_UPDSCPRemark == "1"){
			$('SEL_DSCPRemark').disabled = false;
        }else{
			$('SEL_DSCPRemark').disabled = true;
        }
		if(G_UP8021pRemark == "1"){
			$('SEL_802Remark').disabled = false;
			$('SEL_802app').disabled = false;
		}else{
			$('SEL_802Remark').disabled = true;
			$('SEL_802app').disabled = true;
		}
	}else{
		if(G_DOWNDSCPRemark == "1"){
			$('SEL_DSCPRemark').disabled = false;
		}else{
			$('SEL_DSCPRemark').disabled = true;
        }
		if(G_DOWN8021pRemark == "1"){
			$('SEL_802Remark').disabled = false;
			$('SEL_802app').disabled = false;
		}else{
			$('SEL_802Remark').disabled = true;
			$('SEL_802app').disabled = true;
		}
	}
}

function onChgAPP(xValue){
	//onload 初始势
	if(xValue == undefined){
		xValue = "nomatch";
	}
	var _desIP = _desMask = _desPortS = _desPortE = _srcPortS = _srcPortE = "";
	var _pro = "-1"
	switch(xValue){
		case "igmp" :
			_desIP = "224.0.0.0";
			_desMask = "240.0.0.0";
			break;
		case "sip" :
			_desPortS = "5060";
			_desPortE = "5060";
			_pro = "17";
			break;
		case "h323" :
			_desPortS = "1719";
			_desPortE = "1720";
			_pro = "17";
			break;
		case "mgcp" :
			_desPortS = "2427";
			_desPortE = "2427";
			_pro = "17";
			break;
		case "snmp" :
			_desPortS = "161";
			_desPortE = "161";
			_pro = "0";
			break;
		case "dns" :
			_desPortS = "53";
			_desPortE = "53";
			_pro = "17";
			break;
		case "dhcp" :
			_desPortS = "67";
			_desPortE = "67";
			_srcPortS = "68";
			_srcPortE = "68";
			_pro = "17";
			break;
		case "rip" :
			_desPortS = "502";
			_desPortE = "502";
			_pro = "17";
			break;
		case "rstp" :
			_desPortS = "554";
			_desPortE = "554";
			_pro = "17";
			break;
		case "rtcp" :
			_desPortS = "5005";
			_desPortE = "5005";
			_pro = "17";
			break;
		case "rtp" :
			_desPortS = "5004";
			_desPortE = "5004";
			_pro = "17";
			break;
		default :
			break;
	}
	
	setJSONValue({
		"INPUT_DestIp" 		: _desIP,
		"INPUT_DestMask" 	: _desMask,
		"INPUT_DestPortStart" 	: _desPortS,
		"INPUT_DestPortEnd" 	: _desPortE,
		"INPUT_SrcPortStart" 	: _srcPortS,
		"INPUT_SrcPortEnd" 	: _srcPortE,
		"SEL_Protocol" 		: _pro
	});
}

//
function onChg802APP(xValue){
	//onload 初始势
	if(xValue == undefined){
		xValue = "nomatch";
	}
	switch(xValue){
		case "keynet" :
			Form.Select("SEL_802Remark", "7");
			break;
		case "voice" :
			Form.Select("SEL_802Remark", "6");
			break;
		case "video" :
			Form.Select("SEL_802Remark", "5");
			break;
		case "igmp" :
			Form.Select("SEL_802Remark", "4");
			break;
		case "keydata" :
			Form.Select("SEL_802Remark", "3");
			break;
		default :
			return ;
	}	
}

function createDSCPValueOption(){
	var value_array   = ["Not Match", 'AF11(001010)','AF12(001100)','AF13(001110)','AF21(010010)','AF22(010100)','AF23(010110)','AF31(011010)','AF32(011100)','AF33(011110)','AF41(100010)','AF42(100100)','AF43(100110) ','CS1(001000)','CS2(010000)','CS3(011000)','CS4(100000)','CS5(101000)','CS6(110000)','CS7(111000)','EF(101110)','Default'];
	var value_options = ['-1', '10','12','14','18','20','22','26','28','30','34','36','38','8','16','24','32','40','48','56','46','0']; 
	/*
	//如果是不存在DSCP值，就添加到下拉框的最县
	if(G_Qos_DSCPCheck != '' && value_options.indexOf(G_Qos_DSCPCheck) < 0){
		value_array.push(G_Qos_DSCPCheck);
		value_options.push(G_Qos_DSCPCheck);
	}
	*/
	$S('SEL_DSCP',value_array,value_options);
	$S('SEL_DSCPRemark',value_array,value_options);
}

//返回接口
function reInterface(){
	
}

//添加
function uiSubmit(){
	if(action == "1"){//编辑
		var _Path ="InternetGatewayDevice.QueueManagement.Classification." + indexNum + '.';
		$H({
			"obj-action" 		: "set",
			"getpage" 		: "html/index.html",
			"errorpage" 		: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" 	: G_Page,
			"var:CacheLastData" 	: ViewState.Save()
		}, true);
		
	}else{
		var _Path = "";
		$H({
		   	"add-obj" 		: "InternetGatewayDevice.QueueManagement.Classification.",
			"obj-action" 		: "add-set",
			"getpage" 		: "html/index.html",
			"errorpage" 		: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" 	: G_Page,
			"var:CacheLastData" 	: ViewState.Save()
		}, true);
		
	}
	var _interface = Form.Select('SEL_Interface')
	//rule
	$F(":" + _Path + "ClassificationEnable", 		Form.Radio('RAD_RuleActive'));
	$F(":" + _Path + "ClassInterface", 			_interface);
	$F(":" + _Path + "DestMACAddress", 			$('INPUT_DestMac').value);
	$F(":" + _Path + "DestIP", 				$('INPUT_DestIp').value);
	$F(":" + _Path + "DestMask", 				$('INPUT_DestMask').value);
	$F(":" + _Path + "DestPort", 				$('INPUT_DestPortStart').value == "" ? "-1" : $('INPUT_DestPortStart').value);
	$F(":" + _Path + "DestPortRangeMax", 			$('INPUT_DestPortEnd').value == "" ? "-1" : $('INPUT_DestPortEnd').value);
	$F(":" + _Path + "SourceMACAddress", 			$('INPUT_SrcMac').value);
	$F(":" + _Path + "SourceIP", 				$('INPUT_SrcIp').value);
	$F(":" + _Path + "SourceMask", 				$('INPUT_SrcMask').value);
	$F(":" + _Path + "SourcePort", 				$('INPUT_SrcPortStart').value == "" ? "-1" : $('INPUT_SrcPortStart').value);
	$F(":" + _Path + "SourcePortRangeMax", 			$('INPUT_SrcPortEnd').value == "" ? "-1" : $('INPUT_SrcPortEnd').value);
	$F(":" + _Path + "Protocol", 				Form.Select('SEL_Protocol'));
	$F(":" + _Path + "VLANIDCheck", 			$('INPUT_VlanID').value == "" ? "-1" : $('INPUT_VlanID').value);
	$F(":" + _Path + "DSCPCheck", 				Form.Select('SEL_DSCP'));
	$F(":" + _Path + "EthernetPriorityCheck", 		Form.Select('SEL_802_1p'));
	//action
	$F(":" + _Path + "DSCPMark", 				Form.Select('SEL_DSCPRemark'));
	$F(":" + _Path + "EthernetPriorityMark", 		Form.Select('SEL_802Remark'));

	//Form.Select('SEL_Queue') == "-1" 表示不绑定队列。因此上下行都置为“-1”
	if(Form.Select('SEL_Queue') != "-1")
	{
		$F(":" + _Path + "ClassQueue", 				Number(Form.Select('SEL_Queue')) + (Form.Radio('RAD_Classify') == "UP" ? 0 :4 ));	
	}
	else
	{
		$F(":" + _Path + "ClassQueue", 				Form.Select('SEL_Queue'));	
	}
	
	$('uiPostForm').submit();
}

//返回
function uiBack(){
	$H({
		'var:menu'      : G_Menu,
		'var:page'      : "Adv_qos",
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	});
	
	$('uiPostForm').submit();
}

function SelProtocolChanged()
{
	var selectVal = Form.Select('SEL_Protocol');
	if(selectVal == "-1"|| selectVal == "1" || selectVal == "2")
	{
		$('INPUT_DestPortStart').value = "";
		$('INPUT_DestPortEnd').value = "";
		$('INPUT_SrcPortStart').value = "";
		$('INPUT_SrcPortEnd').value = "";
		
		$('INPUT_DestPortStart').disabled = true;
		$('INPUT_DestPortEnd').disabled = true;
		$('INPUT_SrcPortStart').disabled = true;
		$('INPUT_SrcPortEnd').disabled = true;	
	}
	else
	{
		$('INPUT_DestPortStart').disabled = false;
		$('INPUT_DestPortEnd').disabled = false;
		$('INPUT_SrcPortStart').disabled = false;
		$('INPUT_SrcPortEnd').disabled = false;	
	}	
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