/* JavaScript Document */
var G_WAN = [], G_WANConn = [], G_V6Conn = [];
<?if eq $var:action `1`
`	<?mget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx. "X_TWSZ-COM_DSLType X_TWSZ-COM_VLANID X_TWSZ-COM_VLANPriority WANDSLLinkConfig.Enable WANDSLLinkConfig.LinkType WANDSLLinkConfig.DestinationAddress WANDSLLinkConfig.ATMQoS WANDSLLinkConfig.ATMEncapsulation WANDSLLinkConfig.ATMPeakCellRate WANDSLLinkConfig.ATMSustainableCellRate WANDSLLinkConfig.ATMMaximumBurstSize"
	`	G_WAN['Path'] 			= "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.";
		G_WAN['DSLType'] 		= "$01";	//DSLType
		G_WAN['VLANID'] 		= "$02";	//VLANID
		G_WAN['VLANPriority'] 		= "$03";	//VLANPriority
		G_WAN['Enable'] 		= "$04";	//Enable
		G_WAN['LinkType'] 		= "$05";	//LinkType
		G_WAN['DestinationAddress'] 	= "$06";	//DestinationAddress
		G_WAN['ATMQoS'] 		= "$07";	//ATMQoS
		G_WAN['ATMEncapsulation'] 	= "$08";	//ATMEncapsulation
		G_WAN['ATMPeakCellRate'] 	= "$09";	//ATMPeakCellRate
		G_WAN['ATMSustainableCellRate'] = "$0a";	//ATMSustainableCellRate
		G_WAN['ATMMaximumBurstSize'] 	= "$0b";	//ATMMaximumBurstSize
	`?>
`?>
<?if eq $var:conn_type `IP`
`	G_WANConn['IGMPEnable'] = "<?get :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.X_TWSZ-COM_IGMPEnabled?>";
	<?mget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.WANIPConnection.$var:thdIdx. "Enable Name NATEnabled ExternalIPAddress SubnetMask DefaultGateway DNSOverrideAllowed DNSServers AddressingType ConnectionType X_TWSZ-COM_NATType X_TWSZ-COM_ServiceList X_TWSZ-COM_ProtocolType RouteProtocolRx RipDirection"
	`	G_WANConn['Path'] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.WANIPConnection.$var:thdIdx.";
		G_WANConn['Enable'] 			= "$01";	//Enable
		G_WANConn['Name'] 			= "$02";	//Name
		G_WANConn['NATEnabled'] 		= "$03";	//NATEnabled
		G_WANConn['ExternalIPAddress'] 		= "$04";	//ExternalIPAddress
		G_WANConn['SubnetMask'] 		= "$05";	//SubnetMask
		G_WANConn['DefaultGateway'] 		= "$06";	//DefaultGateway
		G_WANConn['DNSOverrideAllowed'] 	= "$07";	//DNSOverrideAllowed
		G_WANConn['DNSServers'] 		= "$08";	//DNSServers
		G_WANConn['AddressingType'] 		= "$09";	//AddressingType
		G_WANConn['ConnectionType'] 		= "$0a";	//ConnectionType
		G_WANConn['NATType'] 			= "$0b";	//X_TWSZ-COM_NATType
		G_WANConn['ServiceList'] 		= "$0c";	//X_TWSZ-COM_ServiceList
		G_WANConn['ProtocolType'] 		= "$0d";	//X_TWSZ-COM_ProtocolType
		G_WANConn['RouteProtocolRx'] 		= "$0e";	// RouteProtocolRx
		G_WANConn['RipDirection'] 		= "$0f";	// RipDirection
	`?>
	<?mget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.WANIPConnection.$var:thdIdx.X_TWSZ-COM_IPv6Config. "IPv6AddressList.1.IPv6Address IPv6AddressList.1.PrefixLength IPv6DNSServers IPv6DefaultRouterList.1.DefaultRouter IPv6SitePrefixInfo.IPv6SitePrefix IPv6SitePrefixInfo.IPv6SitePrefixLength IPv6PrefixDelegationEnabled DHCP6cForAddress"
	`	G_V6Conn['IPv6Address'] 		= "$01";	//IPv6AddressList.1.IPv6Address
		G_V6Conn['PrefixLength'] 		= "$02";	//IPv6AddressList.1.PrefixLength
		G_V6Conn['IPv6DNSServers'] 		= "$03";	//IPv6DNSServers
		G_V6Conn['DefaultRouter'] 		= "$04";	//IPv6DefaultRouterList.1.DefaultRouter
		G_V6Conn['IPv6SitePrefix'] 		= "$05";	//IPv6SitePrefixInfo.IPv6SitePrefix
		G_V6Conn['IPv6SitePrefixLength'] 	= "$06";	//IPv6SitePrefixInfo.IPv6SitePrefixLength
		G_V6Conn['IPv6PrefixDelegationEnabled'] = "$07";	//IPv6PrefixDelegationEnabled
		G_V6Conn['DHCP6cForAddress']		= "$08" ; 	//DHCP6cForAddress
	`?>
`?>
<?if eq $var:conn_type `PPP`
`	G_WANConn['IGMPEnable'] = "<?get :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.X_TWSZ-COM_IGMPEnabled?>";
	<?mget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.WANPPPConnection.$var:thdIdx. "Enable NATEnabled Username PPPAuthenticationProtocol ConnectionTrigger IdleDisconnectTime MaxMRUSize MaxMTUSize PPPLCPEchoRetry X_TWSZ-COM_StaticIPAddress X_TWSZ-COM_NATType PPPLCPEcho X_TWSZ-COM_ServiceList X_TWSZ-COM_ProtocolType RouteProtocolRx RipDirection"
	`	G_WANConn['Path'] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.WANPPPConnection.$var:thdIdx.";
		G_WANConn['Enable'] 			= "$01";	//Enable
		G_WANConn['NATEnabled'] 		= "$02";	//NATEnabled
		G_WANConn['Username'] 			= "$03";	//Username
		G_WANConn['Password'] 			= "**********";	//Password
		G_WANConn['PPPAuthenticationProtocol'] 	= "$04";	//PPPAuthenticationProtocol
		G_WANConn['ConnectionTrigger'] 		= "$05";	//ConnectionTrigger
		G_WANConn['IdleDisconnectTime'] 	= "$06";	//IdleDisconnectTime
		G_WANConn['MaxMRUSize'] 		= "$07";	//MaxMRUSize
		G_WANConn['MaxMTUSize'] 		= "$08";	//MaxMTUSize
		G_WANConn['PPPLCPEchoRetry'] 		= "$09";	//PPPLCPEchoRetry
		G_WANConn['StaticIPAddress'] 		= "$0a";	//X_TWSZ-COM_StaticIPAddress
		G_WANConn['NATType'] 			= "$0b";	//X_TWSZ-COM_NATType
		G_WANConn['PPPLCPEcho'] 		= "$0c";	//PPPLCPEcho
		G_WANConn['ServiceList'] 		= "$0d";	//X_TWSZ-COM_ServiceList
		G_WANConn['ProtocolType'] 		= "$0e";	//X_TWSZ-COM_ProtocolType
		G_WANConn['RouteProtocolRx'] 		= "$0f";	// RouteProtocolRx
		G_WANConn['RipDirection'] 		= "$0g";	// RipDirection
	`?>
	<?mget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$var:secIdx.WANPPPConnection.$var:thdIdx.X_TWSZ-COM_IPv6Config. "IPv6PrefixDelegationEnabled DHCP6cForAddress"
	`	G_V6Conn['IPv6PrefixDelegationEnabled'] = "$01";	//IPv6PrefixDelegationEnabled
		G_V6Conn['DHCP6cForAddress']	= "$02"	;	//DHCP6cForAddress
	`?>
`?>
//默认网关
var G_DefaultRouter = "<?get :InternetGatewayDevice.Layer3Forwarding.DefaultConnectionService?>";

//全局变量
var action = "<?echo $var:action?>";		//0 ==> 新增? ==> 编辑
var Sec_IndexNum = "<?echo $var:secIdx?>";
var Conn_Type = "<?echo $var:conn_type?>";

//加载初始?
function uiOnload(){
	//Status
	Form.Radio('RAD_Status', G_WANConn['Enable'] || '1');
	var _vpi, _vci, _priv4dns, _secv4dns, _ipv6AddrPrefix, _ipv6AddrLength, _priv6dns, _secv6dns;
	//区分新增与编辑初始化
	if(action == '1'){
		_vpi = G_WAN['DestinationAddress'].split(':')[1].split('/')[0];
		_vci = G_WAN['DestinationAddress'].split(':')[1].split('/')[1];
		
		if(Conn_Type == "IP" && G_WANConn['DNSServers'] != ""){			
			_priv4dns = G_WANConn['DNSServers'].split(',')[0];
			_secv4dns = G_WANConn['DNSServers'].split(',')[1];
		}
		/*
		if(Conn_Type == "IP" && G_V6Conn['PrefixLength'] != ""){
			_ipv6AddrPrefix = G_V6Conn['PrefixLength'].split(',')[0];
			_ipv6AddrLength = G_V6Conn['PrefixLength'].split(',')[1];
		}
		*/
		if(Conn_Type == "IP" && G_V6Conn['IPv6DNSServers'] != ""){
			_priv6dns = G_V6Conn['IPv6DNSServers'].split(',')[0];
			_secv6dns = G_V6Conn['IPv6DNSServers'].split(',')[1];
		}
		
	}
	//新增初始?
	setJSONValue({
		"INPUT_VPI" 		: _vpi || '8',
		"INPUT_VCI" 		: _vci || '36',
		"SEL_ATMQoS" 		: G_WAN['ATMQoS'] || 'UBR',
		"INPUT_PCR" 		: G_WAN['ATMPeakCellRate'] || '0',
		"INPUT_SCR" 		: G_WAN['ATMSustainableCellRate'] || '0',
		"INPUT_MBS" 		: G_WAN['ATMMaximumBurstSize'] || '0',
		"SEL_IPVersion" 	: G_WANConn['ProtocolType'] || 'IPv4',
		"SEL_Servicetype" 	: G_WANConn['ServiceList'] || 'Internet',
		"INPUT_VLanID" 		: G_WAN['VLANID'] || '0',
		"INPUT_Priority" 	: G_WAN['VLANPriority'] || '0',
		"SEL_Nat" 		: G_WANConn['NATEnabled'] || '1',
		"SEL_RouteProto" 	: G_WANConn['RouteProtocolRx'] || 'Off',
		"SEL_Direction" 	: G_WANConn['RipDirection'] || 'Both'
	});
	//IP
	setJSONValue({
		"INPUT_v4IPAddress" 	: G_WANConn['ExternalIPAddress'] || "",
		"INPUT_v4Mask" 		: G_WANConn['SubnetMask'] || "",
		"INPUT_v4GW" 		: G_WANConn['DefaultGateway'] || "",
		"INPUT_v4Pridns" 	: _priv4dns || "",
		"INPUT_v4Secdns" 	: _secv4dns || "",
		"INPUT_v6IPAddress" 	: G_V6Conn['IPv6Address'] || "",
		//"INPUT_ipv6AddrPrefix" 	: _ipv6AddrPrefix || "",
		"INPUT_ipv6AddrLength" 	: G_V6Conn['PrefixLength'] || "",
		"INPUT_v6GW" 		: G_V6Conn['DefaultRouter'] || "",
		"INPUT_ipv6Prefix" 	: G_V6Conn['IPv6SitePrefix'] || "",
		"INPUT_ipv6Length" 	: G_V6Conn['IPv6SitePrefixLength'] || "",
		"INPUT_v6delegation" 	: G_V6Conn['IPv6PrefixDelegationEnabled'] || "1",
		"INPUT_v6iana"			: G_V6Conn['DHCP6cForAddress'] || "1",
		"INPUT_v6Pridns" 	: _priv6dns || "",
		"INPUT_v6Secdns" 	: _secv6dns || ""
	});
	//PPP
	setJSONValue({
		"INPUT_Username" 	: G_WANConn['Username'] || "",
		"INPUT_Password" 	: G_WANConn['Password'],
		"INPUT_cfPassword" 	: G_WANConn['Password'],
		"INPUT_Minute" 		: (G_WANConn['IdleDisconnectTime'] === undefined ? "10" : G_WANConn['IdleDisconnectTime']/60),
		"INPUT_MRU" 		: G_WANConn['MaxMRUSize'] || "1492",
		"INPUT_MTU" 		: G_WANConn['MaxMTUSize'] || "1490"
	});
	//connection
	Form.Radio("RAD_ConnOndemand", G_WANConn['ConnectionTrigger'] || "AlwaysOn");
	onClkIdleTime();
	//get ip mode
	Form.Radio("RAD_GetIPMode", (G_WANConn['StaticIPAddress'] == undefined || G_WANConn['StaticIPAddress'] == "") ? "DHCP" : "Static");	
	//IGMP
	Form.Radio('RAD_IgmpProxy', G_WANConn['IGMPEnable'] || '0');
	//QoS 灰显控制
	onChgQoSGrey();
	//IPv4/IPv6
	onChgProto();
	//ISP
	Form.Radio('RAD_ISPType', findProtocol());
	onClkISP();
}

//确定协议
function findProtocol(){	
	if(action == "1"){
		var LinkType = G_WAN['LinkType'],
		    ConnType = G_WANConn['Path'].indexOf('WANIPConnection') > -1 ? "IP" : "PPP";
		if(LinkType == "EoA" && ConnType == "IP"){
			if(G_WANConn['ConnectionType'] == "IP_Bridged"){
				return "Bridge";
			}else{
				return G_WANConn['AddressingType'];
			}
		}else if(LinkType == "EoA" && ConnType == "PPP"){
			return "PPPoE";
		}else{
			return LinkType;
		}
	}else{
		return "DHCP";
	}
}

//create Encap select
function creatEncapSel(){
	var _isptype = Form.Radio('RAD_ISPType');
	var _value = ['LLC', 'VCMUX'], _text = ['1483 Routed IP LLC', '1483 Routed IP VC-Mux'];
	if(_isptype == "Bridge"){
		_text = ['RFC 1483 Bridged IP LLC', 'RFC 1483 Bridged IP VC-Mux'];
	}else if(_isptype == "PPPoA"){
		_text = ['PPPoA LLC', 'PPPoA VC-Mux'];
	}else if(_isptype == "PPPoE"){
		_value = ['LLC', 'VCMUX', 'None'];
		_text = ['PPPoE LLC', 'PPPoE VC-Mux', 'PPPoE None'];
	}
	$S('SEL_IPEncap', _text, _value);
}

//QoS
function onChgQoSGrey(xValue){
	//onload 初始
	if(xValue == undefined){
		xValue = Form.Select('SEL_ATMQoS');
	}
	//HTML 触发
	switch(xValue){
		case "UBR" :
			$('INPUT_PCR').disabled = true;
			$('INPUT_SCR').disabled = true;
			$('INPUT_MBS').disabled = true;
			break;
		case "CBR" :
			$('INPUT_PCR').disabled = false;
			$('INPUT_SCR').disabled = true;
			$('INPUT_MBS').disabled = true;
			break;
		default :
			$('INPUT_PCR').disabled = false;
			$('INPUT_SCR').disabled = false;
			$('INPUT_MBS').disabled = false;
	}
}

//IPv4/IPv6/IPv4_6
function onChgProto(xValue){
	
	//onload 初始?
	if(xValue == undefined){
		xValue = Form.Select('SEL_IPVersion');
	}
	onChgText(xValue);
	
	//考虑协议类型
	var _ipv4 = _ipv6 = _pppaddr = _predelegat = _iana =  "none";
	//HTML 触发
	switch(xValue){
		case "IPv4" :
			if(Form.Radio('RAD_ISPType') == "Static" || Form.Radio('RAD_ISPType') == "IPoA"){
				_ipv4 = "";
			}
			break;
		case "IPv6" :
			_ipv4 = "none";
            _predelegat = "";
            if (Form.Radio('RAD_ISPType') == "DHCP"  || 
    			Form.Radio('RAD_ISPType') == "PPPoE" || 
    			Form.Radio('RAD_ISPType') == "PPPoA"){
    			_iana = "";
    		}
			if(Form.Radio('RAD_ISPType') == "Static" || Form.Radio('RAD_ISPType') == "IPoA"){
				_ipv6 = "";
			}
			break;
		default :
            _predelegat = "";
            if (Form.Radio('RAD_ISPType') == "DHCP"  || 
    			Form.Radio('RAD_ISPType') == "PPPoE" || 
    			Form.Radio('RAD_ISPType') == "PPPoA"){
    			_iana = "";
    		}
			if(Form.Radio('RAD_ISPType') == "Static" || Form.Radio('RAD_ISPType') == "IPoA"){
				_ipv4 = "";
				_ipv6 = "";
			}
	}
    
    if (Form.Radio('RAD_ISPType') == "Bridge"){
        _predelegat = "none";   //桥没有这个设置
    }
    


	$('tr_pppaddr').style.display = _pppaddr;
	$('tb_ipv4option').style.display = _ipv4;
	$('tb_ipv6option').style.display = _predelegat;
	$('tb_ipv6iana').style.display = _iana;
    $('tb_ipv6IpSetting').style.display = _ipv6;
    onClkPrefix();
}


function onChgText(xValue)
{
	var _type = Form.Radio('RAD_ISPType');
	
	if(xValue == undefined)
	{
		xValue = Form.Select('SEL_IPVersion');
	}
	switch(_type)
	{
		case 'PPPoE' : 
    case 'PPPoA' :
    	$('BWAN057').innerHTML= (xValue != "IPv4" ? '(1280~1492)' : '(576~1492)');
    	$('BWAN059').innerHTML= (xValue != "IPv4" ? '(1280~1492)' : '(576~1492)');
    	break;
    default:
			break;
	}
}


//ISP
function onClkISP(xValue){
	//onload 初始?
	if(xValue == undefined){
		xValue = Form.Radio('RAD_ISPType');
	}
	//HTML 触发
	var _dhcp = _static = _ipoa = _pppoe = _pppoa = _bridge = _connection = "none"
	var _vlanid = _priority = _ipversion = _service = _nat = _dyroute = _igmp = _ipv4 = ipv6 = "";
	switch(xValue){
		case "DHCP" :
			_dhcp = "";
			_ipv4 = _ipv6 = "none";
			break;
		case "Static" :
			_static = "";
			_ipv4 = Form.Select('SEL_IPVersion') != "IPv6" ? "" : "none";
			_ipv6 = Form.Select('SEL_IPVersion') != "IPv4" ? "" : "none";
			break;
		case "IPoA" :
			_ipoa = "";
			_vlanid = _priority = "none";
			_ipv4 = Form.Select('SEL_IPVersion') != "IPv6" ? "" : "none";
			_ipv6 = Form.Select('SEL_IPVersion') != "IPv4" ? "" : "none";
			break;
		case "PPPoE" :
			_pppoe = "";
			_connection = ""
			_ipv4 = (Form.Select('SEL_IPVersion') != "IPv6" && G_WANConn['StaticIPAddress'] != "") ? "" : "none";
			_ipv6 = (Form.Select('SEL_IPVersion') != "IPv4" && G_WANConn['StaticIPAddress'] != "") ? "" : "none";
			break;
		case "PPPoA" :
			_pppoa = "";
			_connection = "";
			_ipv4 = (Form.Select('SEL_IPVersion') != "IPv6" && G_WANConn['StaticIPAddress'] != "") ? "" : "none";
			_ipv6 = (Form.Select('SEL_IPVersion') != "IPv4" && G_WANConn['StaticIPAddress'] != "") ? "" : "none";
			break;
		case "Bridge" :
			_bridge = "";
			_ipversion = _service = _nat = _dyroute = _igmp = _ipv4 = _ipv6 = "none"
			break;
		default :
			_dhcp = "";
			_ipv4 = _ipv6 = "none";
			
	}
    
    if ( xValue != "Bridge" && 
        !(G_WANConn['ConnectionType'] === undefined) &&
        G_WANConn['ConnectionType'] == 'IP_Bridged'){
        $('SEL_Nat').value = '1';
    }
	//隐显控制
	$('tb_bt_dhcp').style.display = _dhcp;
	$('tb_bt_static').style.display = _static;
	$('tb_bt_ipoa').style.display = _ipoa;
	$('tb_bt_pppoe').style.display = _pppoe;
	$('tb_bt_pppoa').style.display = _pppoa;
	$('tb_bt_bridge').style.display = _bridge;
	
    $('tr_service').style.display = _service;
	$('tr_vlanid').style.display = _vlanid;
	$('tr_priority').style.display = _priority;
	$('tr_nat').style.display = _nat;
	$('tr_dyroute').style.display = _dyroute;
	$('tr_igmp').style.display = _igmp;
	
	$('tb_ipversion').style.display = _ipversion;	
	$('tb_connection').style.display = _connection;	
//	$('tb_ipv4option').style.display = _ipv4;
//	$('tb_ipv6option').style.display = _ipv6;
	
	//ENCAP
	creatEncapSel();
	Form.Select("SEL_IPEncap" , G_WAN['ATMEncapsulation'] || 'LLC');
	//Service Name
	setServiceName();
	//get IP mode
	onClkGetIPMode();
    onChgProto();
}

//Service Name
function setServiceName(){
	var namePrefix = Form.Radio('RAD_ISPType');
	var index = Sec_IndexNum == "-" ? "1" : Sec_IndexNum;
	$('INPUT_ServiceName').value = namePrefix + '_' + ($('INPUT_VLanID').value || '0') + '_' +index;
}

//PPP IdleTime
function onClkIdleTime(xValue){
	//onload 初始?
	if(xValue == undefined){
		xValue = Form.Radio('RAD_ConnOndemand');
	}
	//HTML 触发
	if(xValue == "OnDemand"){
		$('INPUT_Minute').disabled = false;
	}else{
		$('INPUT_Minute').disabled = true;
	}
}

//PPP Get IP Mode
function onClkGetIPMode(xValue){
	//onload 初始?
	if(xValue == undefined){
		xValue = Form.Radio('RAD_GetIPMode');
	}
	//HTML 触发
	if(xValue == "DHCP"){
		$('tr_pppaddr').style.display = "none";
//		$('tr_predelegat').style.display = "none";
	}else{
		$('tr_pppaddr').style.display = "";		
//		$('tr_predelegat').style.display = Form.Select('SEL_IPVersion') != "IPv4" ? "" : "none";
	}
	//PPPoE/PPPoA
	if(Form.Radio('RAD_ISPType').indexOf('PPP') > -1){
		$('tb_ipv4option').style.display = "none";
		$('tb_ipv6IpSetting').style.display = "none";
	}
}

function onClkPrefix(){
	if(Form.Checkbox('INPUT_v6delegation') == 1 ){
		$('ipv6Prefix').style.display = "";
	}else{
		$('ipv6Prefix').style.display = "none";
	}
}

//返回
function uiBack(){
	$H({
		'var:menu'      : G_Menu,
		'var:page'      : "Bas_wansum",
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	});
	
	$('uiPostForm').submit();
}

//获取连接类型 IP/PPP
function getConnType(){
	var _type = Form.Radio('RAD_ISPType');
	switch(_type){
		case "DHCP" :
		case "Static" :
		case "Bridge" :
			return ['EoA', 'IP'];
		case "IPoA" :
			return ['IPoA', 'IP'];
		case "PPPoE" :
			return ['EoA', 'PPP'];
		case "PPPoA" :
			return ['PPPoA', 'PPP'];
		default :
			return ['EoA', 'IP'];
	}
}

//提交配置
function uiSubmit(){
	//check password
	if($('INPUT_Password').value != $('INPUT_cfPassword').value){
		alert(SEcode[1010]);
		return false;
	}
	//vpi/vci
	var _vpivci   = "PVC:"+$('INPUT_VPI').value+"/"+$('INPUT_VCI').value;	//PVC:8/36
	var _protocol = Form.Select("SEL_IPVersion");				//IPv4/IPv6/IPv4_6
	var _ispmode  = Form.Radio("RAD_ISPType");				//DHCP/Static/IPoA/PPPoE/PPPoA/Bridge
	var _atmqos   = Form.Select("SEL_ATMQoS");				//UBR/CBR/VBR-rt/VBR-nrt
	var _addrtype, _conntype = getConnType();
	if(_conntype[1] == "IP" && _ispmode == "DHCP"){
		_addrtype = "DHCP";
	}else if(_conntype[1] == "IP" && (_ispmode == "Static" || _ispmode == "IPoA")){
		_addrtype = "Static";
	}else{
		_addrtype = "undefined";
	}
		
	$H({
		"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:subpage" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
	//路径
	var DevicePath, ConnPath;
	if(action == '1'){//编辑wan
		//ATM路径
		DevicePath = G_WAN['Path'];
		//判断连接类型是否更改
		if(G_WANConn['Path'] && G_WANConn['Path'].indexOf(_conntype[1]) > -1){
			ConnPath = G_WANConn['Path'];
		}else{
			ConnPath = G_WANConn['Path'].replace(_conntype[1] == 'PPP' ? 'IP' : 'PPP', _conntype[1]);
			$F('mid','0438');
			$F(":" + ConnPath + "X_TWSZ-COM_ConnectionMode", G_WANConn['Path'].indexOf('IP') > 0 ? 'IP' : 'PPP');
		}
	}else{//新增wan
		DevicePath = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.0.";
		ConnPath = DevicePath + 'WAN' + _conntype[1] + 'Connection.0.';
		$F('mid','0438');
		$F(":" + ConnPath + "X_TWSZ-COM_ConnectionMode", _conntype[1]);
	}
	
	//vlan
	$F(":" + DevicePath + "X_TWSZ-COM_DSLType", 				"ATM");
	$F(":" + DevicePath + "X_TWSZ-COM_VLANID", 				_ispmode != "IPoA" ? $('INPUT_VLanID').value : undefined);
	$F(":" + DevicePath + "X_TWSZ-COM_VLANPriority", 			_ispmode != "IPoA" ? $('INPUT_Priority').value : undefined);
	$F(":" + DevicePath + "X_TWSZ-COM_IGMPEnabled", 			_ispmode != "Bridge" ? Form.Radio('RAD_IgmpProxy') : undefined);
	//status/vpivci/QoS
	$F(":" + DevicePath + "WANDSLLinkConfig.Enable", 			"1");
	$F(":" + DevicePath + "WANDSLLinkConfig.DestinationAddress", 		_vpivci);
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMQoS", 			_atmqos);
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMPeakCellRate", 		$('INPUT_PCR').value);
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMSustainableCellRate", 	(_atmqos == "UBR" || _atmqos == "CBR") ? undefined : $('INPUT_SCR').value);
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMMaximumBurstSize", 		(_atmqos == "UBR" || _atmqos == "CBR") ? undefined : $('INPUT_MBS').value);
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMEncapsulation", 		Form.Select('SEL_IPEncap'));
	$F(":" + DevicePath + "WANDSLLinkConfig.LinkType", 			_conntype[0]);	//EoA/IPoA/PPPoA
	//IP common
	$F(":" + ConnPath + "Enable", 			Form.Radio('RAD_Status'));
	$F(":" + ConnPath + "Name", 			$('INPUT_ServiceName').value);	//新增时需要下发生成的Name
	$F(":" + ConnPath + "X_TWSZ-COM_ProtocolType", 	_ispmode == "Bridge" ? "IPv4" :_protocol);
	$F(":" + ConnPath + "X_TWSZ-COM_ServiceList", 	_ispmode == "Bridge" ? "Internet" :Form.Select('SEL_Servicetype'));
	$F(":" + ConnPath + "NATEnabled", 		_ispmode != "Bridge" ? Form.Select('SEL_Nat') : undefined);
	$F(":" + ConnPath + "X_TWSZ-COM_NATType", 	_ispmode != "Bridge" ? "symmetric" : undefined);
	$F(":" + ConnPath + "RouteProtocolRx", 		_ispmode != "Bridge" ? Form.Select('SEL_RouteProto') : undefined);
	$F(":" + ConnPath + "RipDirection", 		_ispmode != "Bridge" ? Form.Select('SEL_Direction') : undefined);	
	$F(":" + ConnPath + "ConnectionType", 		_ispmode == "Bridge" ? "IP_Bridged" : "IP_Routed");
	$F(":" + ConnPath + "AddressingType", 		_addrtype == "undefined" ? undefined : _addrtype);
	
	switch(_ispmode){
		case "DHCP" :
			if(_protocol != "IPv6"){//IPv4 or IPv4_6
				$F(":" + ConnPath + "DNSOverrideAllowed", 	"0");
			}
			if(_protocol != "IPv4"){//IPv6 or IPV4_6
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DefaultRouterList.1.ConfigType", 	"OTHER");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6AddressList.1.AddressingType", 		"DHCP");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DNSOverrideAllowed", 			"0");
                $F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6PrefixDelegationEnabled", 		Form.Checkbox('INPUT_v6delegation'));
                $F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.DHCP6cForAddress", 		Form.Checkbox('INPUT_v6iana'));
			}
			break;
		case "Static" :
        case "IPoA"   :
			if(_protocol != "IPv6"){//IPv4 or IPv4_6
				var _dnsservers = $('INPUT_v4Pridns').value+','+$('INPUT_v4Secdns').value;
				$F(":" + ConnPath + "ExternalIPAddress", 	$('INPUT_v4IPAddress').value);
				$F(":" + ConnPath + "SubnetMask", 		$('INPUT_v4Mask').value);
				$F(":" + ConnPath + "DefaultGateway", 		$('INPUT_v4GW').value);
				$F(":" + ConnPath + "DNSServers", 		_dnsservers.delcomma());
				$F(":" + ConnPath + "DNSOverrideAllowed", 	"0");
			}
			if(_protocol != "IPv4"){//IPv6 or IPV4_6				
				var _dnservers = $('INPUT_v6Pridns').value+','+$('INPUT_v6Secdns').value;
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DefaultRouterList.1.ConfigType", 	"Static");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6AddressList.1.AddressingType", 		"Static");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DNSOverrideAllowed", 			"0");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6AddressList.1.IPv6Address", 		$('INPUT_v6IPAddress').value);
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6AddressList.1.PrefixLength", 		$('INPUT_ipv6AddrLength').value);
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DefaultRouterList.1.DefaultRouter", 	$('INPUT_v6GW').value);
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DNSServers", 				_dnservers.delcomma());
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6SitePrefixInfo.ValidLifeTime", 		"172800");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6SitePrefixInfo.PreferredLifeTime", 	"7200");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DNSEnabled", 				"1");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.GetIPv6NTPServers", 				"1");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6PrefixDelegationEnabled", 		Form.Checkbox("INPUT_v6delegation"));
				if (Form.Checkbox("INPUT_v6delegation") == 1){
					$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6SitePrefixInfo.IPv6SitePrefix", 		$('INPUT_ipv6Prefix').value);
					$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6SitePrefixInfo.IPv6SitePrefixLength", 	$('INPUT_ipv6Length').value);
				}
			}
			break;
		case "PPPoE" :
		case "PPPoA" :
			$F(":" + ConnPath + "Username", 		$('INPUT_Username').value);
			$F(":" + ConnPath + "Password", 		$('INPUT_Password').value != '**********' ? $('INPUT_Password').value : undefined);
			$F(":" + ConnPath + "PPPAuthenticationProtocol", "Auto");
			$F(":" + ConnPath + "ConnectionTrigger", 	Form.Radio('RAD_ConnOndemand'));
			$F(":" + ConnPath + "IdleDisconnectTime", 	Form.Radio('RAD_ConnOndemand') == "OnDemand" ? $('INPUT_Minute').value*60 : undefined);
			$F(":" + ConnPath + "MaxMRUSize", 		$('INPUT_MRU').value);
			$F(":" + ConnPath + "MaxMTUSize", 		$('INPUT_MTU').value);
			$F(":" + ConnPath + "PPPLCPEcho", 		"30");
			$F(":" + ConnPath + "PPPLCPEchoRetry", 		"0");
			$F(":" + ConnPath + "X_TWSZ-COM_StaticIPAddress", Form.Radio('RAD_GetIPMode') == "DHCP" ? "" : $('INPUT_PPPIPAddress').value);
			
			if(_protocol != "IPv4"){//IPv6 or IPV4_6
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6AddressList.1.AddressingType", 		"DHCP");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6PrefixDelegationEnabled", 		Form.Checkbox('INPUT_v6delegation'));
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.DHCP6cForAddress", 		Form.Checkbox('INPUT_v6iana'));
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DNSEnabled", 				"1");
				$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DNSOverrideAllowed", 			"0");
			//	$F(":" + ConnPath + "X_TWSZ-COM_IPv6Config.IPv6DNSEnabled", 				"0"); //重复不
			}
			break;
		case "Bridge" :
		default :
			;
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
//监听加载与错误处理函?
addListeners(uiOnload, dealWithError);