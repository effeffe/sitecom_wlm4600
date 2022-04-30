/*  Javascript Document:Bas_lan.js  */
<?mget :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1. "IPInterfaceIPAddress IPInterfaceSubnetMask X_TWSZ-COM_IPv6InterfaceAddress X_TWSZ-COM_IPv6InterfacePrefixLength"
`	G_IPAddress 	= "$01";
	G_SubMask 	= "$02";
	G_IPv6Address 	= "$03";
	G_IPv6PrexLength= "$04";
`?>
var G_AliasIPAddress = "<?get :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.2.IPInterfaceIPAddress?>";
var G_AlisaSubMask = "<?get :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.2.IPInterfaceSubnetMask?>";
var G_IGMP = "<?get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IGMPSnoop.Enabled?>";
var G_RouteProtocolRx = "<?get :InternetGatewayDevice.LANDevice.1.RouteProtocolRx?>";
var G_Direction = "<?get :InternetGatewayDevice.LANDevice.1.RipDirection?>";
var G_MinAddress = "<?get :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress?>";
var G_MaxAddress = "<?get :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress?>";

//加载初始化
function uiOnload(){	
	setJSONValue({
		"INPUT_IPAddress" 	: G_IPAddress,
		"INPUT_Mask" 		: G_SubMask,
		"INPUT_AliasIPAddress" 	: G_AliasIPAddress,
		"INPUT_AliasMask" 	: G_AlisaSubMask,
		"SEL_Route" 		: G_RouteProtocolRx || 'Off',
		"SEL_Direction" 	: G_Direction || 'Both',
		"INPUT_IPv6Address" 	: G_IPv6Address,
		"INPUT_Prefix" 		: G_IPv6PrexLength
	});
	//IGMP
	Form.Radio('RAD_IGMP', G_IGMP);
	onChgRoute();
}

function onChgRoute(xValue){	
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Select("SEL_Route");
	}
	
	if(xValue == "Off"){
		$("SEL_Direction").disabled = true;
	}else{
		$("SEL_Direction").disabled = false;
	}
}

//网段
function calcNetSegment(xIP, xMask){
	var _IP=[], _Mask=[], _And=[];
	
	_IP = xIP.split(".");
	_Mask = xMask.split(".");
	_And[0] = Number(_IP[0])&Number(_Mask[0]);
	_And[1] = Number(_IP[1])&Number(_Mask[1]);
	_And[2] = Number(_IP[2])&Number(_Mask[2]);
	_And[3] = Number(_IP[3])&Number(_Mask[3]);
	
	return _And;
}

//由十进制数计算ip地址
function calcIPAddress(xIP){
	var _IP = [];
	
	_IP[3] = xIP%256;
	xIP = parseInt(xIP/256);
	_IP[2] = xIP%256;
	xIP = parseInt(xIP/256);
	_IP[1] = xIP%256;
	_IP[0] = parseInt(xIP/256);
	
	return _IP[0]+"."+_IP[1]+"."+_IP[2]+"."+_IP[3];
}

//提交配置
function uiSubmit(){
	$H({
	   	':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPRouters' 						: $('INPUT_IPAddress').value,
	   	':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress' 		: $('INPUT_IPAddress').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceSubnetMask' 		: $('INPUT_Mask').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.2.IPInterfaceIPAddress' 		: $('INPUT_AliasIPAddress').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.2.IPInterfaceSubnetMask' 		: $('INPUT_AliasMask').value,
		':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IGMPSnoop.Enabled' 						: Form.Radio('RAD_IGMP'),
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.X_TWSZ-COM_IPv6InterfaceAddress' 	: $('INPUT_IPv6Address').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.X_TWSZ-COM_IPv6InterfacePrefixLength' : $('INPUT_Prefix').value,
		//缺少动态路由配置
		':InternetGatewayDevice.LANDevice.1.RouteProtocolRx' 		: Form.Select('SEL_Route'),
		':InternetGatewayDevice.LANDevice.1.RipDirection' 		: Form.Select('SEL_Direction'),
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
	//因DHCP和LAN_IP配置不在同一个页面，所以LAN_IP地址和子网掩码变更需要修改DHCP地址池
	if(G_IPAddress != $('INPUT_IPAddress').value || G_SubMask != $('INPUT_Mask').value){
		var _And = calcNetSegment($('INPUT_IPAddress').value, $('INPUT_Mask').value);
		var _IP = $('INPUT_IPAddress').value.split(".");
		var _Mask = $('INPUT_Mask').value.split(".");
		var _lanip = (Number(_IP[0])*16777216) + (Number(_IP[1])<<16) + (Number(_IP[2])<<8) + Number(_IP[3]);
		var _calcmask = (Number(_Mask[0])*16777216) + (Number(_Mask[1])<<16) + (Number(_Mask[2])<<8) + Number(_Mask[3]);
		var _ipandmask = (Number(_And[0])*16777216) + (Number(_And[1])<<16) + (Number(_And[2])<<8) + Number(_And[3]);
		var _minaddress = _ipandmask+1;
		var _maxaddress = _ipandmask+(~_calcmask)-1;
		/*跳过127.0.0特殊网段*/		
                if((_minaddress >> 24) == 127)
                {
                        _minaddress = _minaddress + 16777216;
                }		

		/*跳过127.0.0特殊网段*/
		if((_maxaddress >> 24) == 127)
		{
			_maxaddress = _maxaddress - 16777216;
		}
		//地址池不包含lan ip
		if(_minaddress <= _lanip && _lanip <= _maxaddress){
			if(_lanip - _minaddress > _maxaddress - _lanip){
				_maxaddress = _lanip - 1;
			}else{
				_minaddress = _lanip + 1;
			}
		}
	
		$F(":InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress", 	calcIPAddress(_minaddress));
		$F(":InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress", 	calcIPAddress(_maxaddress));
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
