/*  JavaScript Document:Hom_status  */
//deficeinfo
<?mget :InternetGatewayDevice.DeviceInfo. "Manufacturer ManufacturerOUI ModelName Description SerialNumber HardwareVersion SoftwareVersion ModemFirmwareVersion UpTime"
`	var G_Manufacturer 		= "$01";
	var G_ManufacturerOUI 		= "$02";
	var G_ModelName 		= "$03";
	var G_Descripstion 		= "$04";
	var G_SerialNumber 		= "$05";
	var G_HarewareVersion 		= "$06";
	var G_SoftwareVersion 		= "$07";
	var G_ModemFirmwareVersion 	= "$08";
	var G_UpTime               	= "$09";
`?>
//lan
var G_lan_info = []
<?mget :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement. "DHCPServerEnable IPInterface.1.IPInterfaceIPAddress IPInterface.1.IPInterfaceSubnetMask"
`	var G_lan_dhcp_enable 		= "$01";
	var G_lan_ip_addr     		= "$02";
	var G_lan_mask        		= "$03";
`?>
var G_lan_mac = "<?get :InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1.MACAddress ?>";
//wan
var G_WAN = [];
var n = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "X_TWSZ-COM_VLANID WANDSLLinkConfig.Enable WANDSLLinkConfig.LinkType WANDSLLinkConfig.DestinationAddress WANDSLLinkConfig.ATMEncapsulation"
`	G_WAN[n] = [];
	G_WAN[n][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$00";	//cur_index
	G_WAN[n][1] = "$01";	//X_TWSZ-COM_VLANID
	G_WAN[n][2] = "$02";	//WANDSLLinkConfig.Enable
	G_WAN[n][3] = "$03";	//WANDSLLinkConfig.LinkType
	G_WAN[n][4] = "$04";	//WANDSLLinkConfig.DestinationAddress
	G_WAN[n][5] = "$05";	//WANDSLLinkConfig.ATMEncapsulation
	n++;
`?>
var G_WANConn = [], G_V6Conn = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_ServiceList ConnectionStatus ConnectionType AddressingType ExternalIPAddress SubnetMask DefaultGateway DNSOverrideAllowed DNSServers X_TWSZ-COM_UsrDNSServers X_TWSZ-COM_ProtocolType"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00";   // Path
			G_WANConn[m][1] = "$01";   // Name
			G_WANConn[m][2] = "$02";   // X_TWSZ-COM_ServiceList
			G_WANConn[m][3] = "$03";   // ConnectionStatus
			G_WANConn[m][4] = "$04";   // ConnectionType
			G_WANConn[m][5] = "$05";   // AddressingType
			G_WANConn[m][6] = "$06";   // ExternalIPAddress
			G_WANConn[m][7] = "$07";   // SubnetMask
			G_WANConn[m][8] = "$08";   // DefaultGateway
            G_WANConn[m][9] = "$09";   // DNSOverrideAllowed
			G_WANConn[m][10] = "$0a";   // DNSServers
            G_WANConn[m][11] = "$0b";   // X_TWSZ-COM_UsrDNSServers
            G_WANConn[m][12] = "$0c";	// X_TWSZ-COM_ProtocolType
            G_V6Conn[m] = [];
            G_V6Conn[m][0] = [<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$30.WANIPConnection.$10.X_TWSZ-COM_IPv6Config.IPv6AddressList. "IPv6Address PrefixLength AddressScope" `["$01/$02","$03" ],`?>];
            <?mget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$30.WANIPConnection.$10.X_TWSZ-COM_IPv6Config. "IPv6DNSOverrideAllowed  IPv6DNSServers UsrIPv6DNSServers ConnectionStatus IPv6DefaultRouterList.1.DefaultRouter IPv6DefaultRouterList.2.DefaultRouter IPv6SitePrefixInfo.IPv6SitePrefix IPv6SitePrefixInfo.IPv6SitePrefixLength IPv6SitePrefixInfo.PrefixStatus" 
            `
                G_V6Conn[m][1]  = "$01";  // dns auto/manual switch
                G_V6Conn[m][2]  = "$02";  // auto dns info
                G_V6Conn[m][3]  = "$03";  // manual dns info
                G_V6Conn[m][4]  = "$04";  // ConnectionStatus
                G_V6Conn[m][5] = "$05,$06";  // IPv6DefaultRouterList.1.DefaultRouter,IPv6DefaultRouterList.2.DefaultRouter
                G_V6Conn[m][6] = "$07/$08";  // IPv6SitePrefixInfo.IPv6SitePrefix
                G_V6Conn[m][7] = "$09";     //IPv6SitePrefixInfo.PrefixStatus
            `?>
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_ServiceList ConnectionStatus ConnectionType ConnectionTrigger ExternalIPAddress RemoteIPAddress DNSOverrideAllowed DNSServers X_TWSZ-COM_UsrDNSServers X_TWSZ-COM_ProtocolType"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00";   // Path
			G_WANConn[m][1] = "$01";   // Name
			G_WANConn[m][2] = "$02";   // X_TWSZ-COM_ServiceList
			G_WANConn[m][3] = "$03";   // ConnectionStatus
			G_WANConn[m][4] = "$04";   // ConnectionType
			G_WANConn[m][5] = "$05";   // ConnectionTrigger
            G_WANConn[m][6] = "$06";   // ExternalIPAddress
            G_WANConn[m][7] = "255.255.255.255";   // PPP Mask
            G_WANConn[m][8] = "$07";   // RemoteIPAddress
            G_WANConn[m][9] = "$08";   // DNSOverrideAllowed
            G_WANConn[m][10] = "$09";   // DNSServers
            G_WANConn[m][11] = "$0a";   // X_TWSZ-COM_UsrDNSServers
            G_WANConn[m][12] = "$0b";   //X_TWSZ-COM_ProtocolType
            G_V6Conn[m] = [];
            G_V6Conn[m][0] = [<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$30.WANPPPConnection.$10.X_TWSZ-COM_IPv6Config.IPv6AddressList. "IPv6Address PrefixLength AddressScope" `["$01/$02","$03" ],`?>];
            <?mget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$30.WANPPPConnection.$10.X_TWSZ-COM_IPv6Config. "IPv6DNSOverrideAllowed  IPv6DNSServers UsrIPv6DNSServers ConnectionStatus IPv6DefaultRouterList.1.DefaultRouter IPv6DefaultRouterList.2.DefaultRouter IPv6SitePrefixInfo.IPv6SitePrefix IPv6SitePrefixInfo.IPv6SitePrefixLength IPv6SitePrefixInfo.PrefixStatus" 
            `
                G_V6Conn[m][1]  = "$01";  // dns auto/manual switch
                G_V6Conn[m][2]  = "$02";  // auto dns info
                G_V6Conn[m][3]  = "$03";  // manual dns info
                G_V6Conn[m][4]  = "$04";  // ConnectionStatus
                G_V6Conn[m][5] = "$05,$06";  // IPv6DefaultRouterList.1.DefaultRouter,IPv6DefaultRouterList.2.DefaultRouter
                G_V6Conn[m][6] = "$07/$08";  // IPv6SitePrefixInfo.IPv6SitePrefix
                G_V6Conn[m][7] = "$09";     //IPv6SitePrefixInfo.PrefixStatus
            `?>
			m++;
		`?>
	`?>
`?>

//wlan
var G_Wlan_Info = [];
var t = 0;
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "SSID BSSID BeaconType TotalAssociations Enable SSIDAdvertisementEnabled X_TWSZ-COM_RadioInterface"
`	G_Wlan_Info[t] = [];
	G_Wlan_Info[t][0] = "InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00";
	G_Wlan_Info[t][1] = "$01";		//SSID
	G_Wlan_Info[t][2] = "$02";		//BSSID
	G_Wlan_Info[t][3] = "$03";		//BeaconType
	G_Wlan_Info[t][4] = "$04";		//TotalAssociations
	G_Wlan_Info[t][5] = "$05";		//Enable
	G_Wlan_Info[t][6] = "$06";		//hide
    G_Wlan_Info[t][7] = "$07";      //X_TWSZ-COM_RadioInterface
	t++;
`?>
var G_WirelessEnable = ["<?get :InternetGatewayDevice.X_TWSZ-COM_Radio.1.Enable?>"
<?if eq 1 $var:mod_5GWIFI
`
                , "<?get :InternetGatewayDevice.X_TWSZ-COM_Radio.2.Enable?>"
`?>
                ];

//DSL
var G_InternetWanType = "Ethernet";
<?objget :InternetGatewayDevice.WANDevice. "WANCommonInterfaceConfig.WANAccessType"
`	<?if eq `DSL` $11
	`	G_InternetWanType = "$11";
		<?mget :InternetGatewayDevice.WANDevice.1.WANDSLInterfaceConfig. "ModulationType StandardUsed TrellisCoding Status"
		`	var	G_adsl_mode = "$01";
			var G_adsl_type = "$02";
			var G_line_code = "$03"=="Enable" ? SEcode[8000] : SEcode[8001];
			var G_status    = "$04";
		` ?>
		<?mget :InternetGatewayDevice.WANDevice.1.WANDSLInterfaceConfig. "UpstreamNoiseMargin DownstreamNoiseMargin UpstreamAttenuation DownstreamAttenuation UpstreamCurrRate DownstreamCurrRate Stats.Total.UpstreamCRCErrors Stats.Total.DownstreamCRCErrors"
		`	var G_up_margin 		= "$01";
			var G_down_margin 		= "$02";
			var G_up_attenuation 	= "$03";
			var G_down_attenuation 	= "$04";
			var G_up_rate 			= "$05";
			var G_down_rate 		= "$06";
			var G_up_crcerror 		= "$07";
			var G_down_crcerror		= "$08";
		`?>
	`?>
`?>

//协议类型
function findProtocol(xValue){
	/*
	if(xValue > 3){
		xValue = 3;
	}
	*/
	var LinkType = G_WAN[xValue][3];
	    ConnType = G_WANConn[xValue][0].indexOf('WANIPConnection') > -1 ? "IP" : "PPP";
	if(LinkType == "EoA" && ConnType == "IP"){
		if(G_WANConn[xValue][4] == "IP_Bridged"){
			return "Bridge";
		}else{
			return G_WANConn[xValue][5];
		}
	}else if(LinkType == "EoA" && ConnType == "PPP"){
		return "PPPoE";
	}else{
		return LinkType;
	}
}
//WAN SELECT
function crtWANSels(){
	var _text = [], _value = [];
	if (G_WANConn == ""){	
		return;
	}
	for(var i = 0; i < G_WANConn.length; i++){
		if (G_WANConn[i][1].indexOf('br') > -1 ) {
			continue;
		}
		_text.push(G_WANConn[i][1]);
		_value.push(G_WANConn[i][0]);
	}
	$S('SEL_WAN',_text,_value);	
    Form.Select('SEL_WAN', G_WANConn[0][0] || "0");
}

//WLAN SELECT
function crtWLANSels(){
	var _text = [], _value = [];
	for(var i = 0; i < G_Wlan_Info.length; i++){
		_text.push(G_Wlan_Info[i][1]);
		_value.push(G_Wlan_Info[i][0]);
	}
	$S('SEL_WLAN',_text,_value);
}

function getWANConnIndex(){
	var _wansel = Form.Select('SEL_WAN');
	if(_wansel == "" || _wansel == undefined){
		return;
	}
	var arr_num;
	for(var i=0; i<G_WANConn.length; i++){
		if(G_WANConn[i][0] == _wansel){
			return i;
			//continue;
		}
	}

	return 0;
}

//WAN
function ctrlWAN(){

	var arr_num = getWANConnIndex();
// create IP protocol select list
    if (G_WANConn[arr_num] == "" || G_WANConn[arr_num] === undefined){
        $('StatueIPv4').style.display = "none";
        $('StatueIPv6').style.display = "none";
        return;
    }  
     
    if (G_WANConn[arr_num][4] == "IP_Bridged" ){
        $('select_IPProtocol').style.display = "none";
        $S('WAN_IPProtocol', ['IPv4'], ['IPv4']);
    } else {
    	$('select_IPProtocol').style.display = "";
    	switch(G_WANConn[arr_num][12]){
	  	
        case"IPv4":
            $S('WAN_IPProtocol', ['IPv4'], ['IPv4']);
            break;

        case"IPv6":
            $S('WAN_IPProtocol', ['IPv6'], ['IPv6']);
            break;

        case"IPv4_6":
            $S('WAN_IPProtocol', ['IPv4','IPv6'], ['IPv4', 'IPv6']);
            break;

        default:
            break;
		  }
	}
    // set IP protocol default value;
    $('WAN_IPProtocol').selectedIndex = 0;
    ctrlWANIP();
	}
	
function ctrlWANIP () {
	// body...
	var wanIndex = getWANConnIndex();


	switch ($('WAN_IPProtocol').value){
		case "IPv4":
			$('StatueIPv4').style.display = "";
			$('StatueIPv6').style.display = "none";
		    var WanConnected = (G_WANConn[wanIndex][3] == "Connected" ? true : false);
    
	setJSONValue({
		'td_wanstatus' 		: WanConnected ? SEcode[8004] : SEcode[8005],
				'td_wanproto' 		: findProtocol(wanIndex),
				'td_wanip' 		    : (WanConnected ? G_WANConn[wanIndex][6] : SEcode[8007]) || SEcode[8007],
				'td_wanmask' 		: (WanConnected ? G_WANConn[wanIndex][7] : SEcode[8007]) || SEcode[8007],
				'td_defgateway' 	: (WanConnected ? G_WANConn[wanIndex][8] : SEcode[8007]) || SEcode[8007],
				'td_dnsserver' 		: (WanConnected ? (G_WANConn[wanIndex][9] == "0" ? G_WANConn[wanIndex][10] :G_WANConn[wanIndex][11]  ) : SEcode[8007]) || SEcode[8007]
	});
			break;
		case "IPv6":
			$('StatueIPv4').style.display = "none";
			$('StatueIPv6').style.display = "";
		//	var WanConnected = (G_V6Conn[wanIndex][4] == "Disconnected" ? false : true);
            switch(G_V6Conn[wanIndex][4]){
                case"GlobalConnected":
                    var WanConnected = true;

                    var v6IPAddress =   (G_V6Conn[wanIndex][0][0][0] == "/" ? '' : G_V6Conn[wanIndex][0][0][0] ) 
                                        + ',' 
                                        + (G_V6Conn[wanIndex][0][2][0] == "/" ? '' : G_V6Conn[wanIndex][0][2][0]);
                    v6IPAddress = v6IPAddress.delcomma();
                    break;
                case"LinkLocalConnected":
                    var WanConnected = true;
                    var v6IPAddress = G_V6Conn[wanIndex][0][1][0];
                    break;
                default:
                   var WanConnected = false;
                   var v6IPAddress = SEcode[8007];
                   break;
            }

            switch(G_V6Conn[wanIndex][7]){
                case 'Invalid':
                    var v6PrefixShow = SEcode[1017];
                    break;
                case 'Stale':
                    var v6PrefixShow = SEcode[1018];
                    break;
                case 'Valid':
                    var v6PrefixShow = G_V6Conn[wanIndex][6];
                    break;
                default:
                    var v6PrefixShow = SEcode[1017];
                    break;
            }

			setJSONValue({
                'td_v6WanStatus'    : WanConnected ? G_V6Conn[wanIndex][4] : SEcode[8005],
                'td_v6WanProto'     : findProtocol(wanIndex),
                'td_v6Address'      : WanConnected ? v6IPAddress : SEcode[8007],
                'td_v6GateWay'      : WanConnected ? G_V6Conn[wanIndex][5].delcomma() : SEcode[8007],
                'td_v6Prefix'       : WanConnected ? v6PrefixShow : SEcode[8007],
                'td_v6DNS'          : WanConnected ? (G_V6Conn[wanIndex][1] == "0" ? G_V6Conn[wanIndex][2] :G_V6Conn[wanIndex][3]): SEcode[8007]
			})
			break;

		default:
			break;
	}

}

//WLAN
function ctrlWLAN(){
	var _wlansel = Form.Select('SEL_WLAN');
	if(_wlansel == "" || _wlansel == undefined){
		return;
	}
	var arr_num;
	for(var i=0; i<G_Wlan_Info.length; i++){
		if(G_Wlan_Info[i][0] == _wlansel){
			arr_num = i;
			continue;
		}
	}
	
    var tmpWlSecMode = '';

    switch(G_Wlan_Info[arr_num][3]){
        case 'None':{
            tmpWlSecMode = 'None';
            break;
        }
        case 'Basic':{
            tmpWlSecMode = 'WEP';
            break;
        }
        case 'WPAand11i':{
            tmpWlSecMode = 'WPA/WPA2 Mixed';
            break;
        }
        case '11i':{
            tmpWlSecMode = 'WPA2 only';
            break;
        }
        case 'WPA':{
            tmpWlSecMode = 'WPA only';
            break;
        }
        default:{
            tmpWlSecMode = 'None';
            break;
        }
    }
	
	setJSONValue({
		'td_wlanmac' 		: G_Wlan_Info[arr_num][2] || SEcode[8007],
		'td_wlanstatus' 	: ((G_WirelessEnable[G_Wlan_Info[arr_num][7] - 1] == "1") && (G_Wlan_Info[arr_num][5] ==  '1')) ? SEcode[8000] : SEcode[8001],
		'td_wlanssid' 		: G_Wlan_Info[arr_num][1] || SEcode[8007],
		'td_wlanvisibility' 	: G_Wlan_Info[arr_num][6] == "1" ? SEcode[8009] : SEcode[8008],
		'td_wlansecmode' 	: tmpWlSecMode
	});
}


function uiOnload(){
	crtWANSels();
	crtWLANSels();
	
	setJSONValue({
		'td_hardware' 		: G_HarewareVersion,
		'td_software' 		: G_SoftwareVersion,
		'td_modelname' 		: G_ModelName,
		'td_mac' 		: G_lan_mac,
		'td_lanip' 		: G_lan_ip_addr,
		'td_lanmask' 		: G_lan_mask,
		'td_dhcpenable' 	: G_lan_dhcp_enable == "1" ? SEcode[8000] : SEcode[8001]
	});
	
	
	ctrlWAN();
	Form.Select('SEL_WLAN', G_Wlan_Info[0][0] || "0");
	ctrlWLAN();
	
	setJSONValue({
		'td_adslversion' 		: G_ModemFirmwareVersion,
		'td_operstatus' 		: G_status == "Disabled" ? SEcode[8001] : SEcode[8000],
		'td_modulation' 		: G_adsl_mode,
		'td_annexmode' 			: G_adsl_type,
		'td_snrdownstream' 		: G_status == "Disabled" ? SEcode[8007] : G_down_margin,
		'td_snrupstream' 		: G_status == "Disabled" ? SEcode[8007] : G_up_margin,
		'td_attendownstream' 	: G_status == "Disabled" ? SEcode[8007] : G_down_attenuation,
		'td_attenupstream' 		: G_status == "Disabled" ? SEcode[8007] : G_up_attenuation,
		'td_drdownstream' 		: G_status == "Disabled" ? SEcode[8007] : G_down_rate,
		'td_drupstream' 		: G_status == "Disabled" ? SEcode[8007] : G_up_rate,
		'td_downCrcError' 		: G_status == "Disabled" ? SEcode[8007] : G_down_crcerror,
		'td_upCrcError' 		: G_status == "Disabled" ? SEcode[8007] : G_up_crcerror
	});
}





addListeners(uiOnload);
