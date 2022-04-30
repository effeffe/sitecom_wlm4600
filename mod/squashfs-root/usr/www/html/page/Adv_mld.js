/*  JavaScript Document:Adv_mld  */
var WANConn = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_ProtocolType X_TWSZ-COM_ServiceList"
		`	WANConn[m] = [];
			WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00.X_TWSZ-COM_IPv6Config";   // Path
			WANConn[m][1] = "$01";   // Name
			WANConn[m][2] = "$02";   // X_TWSZ-COM_ProtocolType
			WANConn[m][3] = "$03";   // X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_ProtocolType X_TWSZ-COM_ServiceList"
		`	WANConn[m] = [];
			WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00.X_TWSZ-COM_IPv6Config";   // Path
			WANConn[m][1] = "$01";   // Name
			WANConn[m][2] = "$02";   // X_TWSZ-COM_ProtocolType
			WANConn[m][3] = "$03";   // X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
`?>

<?mget :InternetGatewayDevice.X_TWSZ-COM_MLD. "Proxy.Enable Proxy.AssociatedWANConnection Snooping.Enable"
`	G_ProEnable   = "$01";
	G_AssWANConn  = "$02";
	G_SnoopEnable = "$03";
`?>

//加载初始化
function uiOnload(){
	var _text = [], _value = [];
	for(var i = 0; i < WANConn.length; i++){
		if (WANConn[i][3] == "TR069") {
			continue;
		}
		if (WANConn[i][2].indexOf('6') == -1) {
			continue;
		}
		_text.push(WANConn[i][1]);
		_value.push(WANConn[i][0]);
	}
	if(_text == ""){//没有IPv6类型的wan连接
		_text.push("No IPv6 connection");
		_value.push("Noconnection");
	}
	$S('SEL_WAN',_text,_value);
	setJSONValue({
		"CHB_ProxyEnable"	: G_ProEnable,
		"SEL_WAN"		: G_AssWANConn,
		"CHB_SnoopingEnable"	: G_SnoopEnable
	});
}

//提交配置
function uiSubmit(){
	//
	$H({
	   	':InternetGatewayDevice.X_TWSZ-COM_MLD.Proxy.Enable' 			: Form.Checkbox("CHB_ProxyEnable"),
		':InternetGatewayDevice.X_TWSZ-COM_MLD.Snooping.Enable' 		: Form.Checkbox("CHB_SnoopingEnable"),
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
	if($('CHB_ProxyEnable').checked){
		if(Form.Select("SEL_WAN") == "Noconnection"){
			alert(SEcode[2004]);
			return false;
		}
		$F(':InternetGatewayDevice.X_TWSZ-COM_MLD.Proxy.AssociatedWANConnection', Form.Select("SEL_WAN"));
	}
	
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