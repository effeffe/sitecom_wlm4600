/*  JavaScript Document:Hom_statistics  */
/*---  WLAN  ---*/
var G_WirelessStatus = [];
var m = 0;
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "Enable TotalBytesSent TotalBytesReceived TotalPacketsSent TotalPacketsReceived Stats.ErrorsReceived Stats.ErrorsSent Stats.UnicastPacketsReceived Stats.DiscardPacketsSent SSID"
`	G_WirelessStatus[m] = [];
	G_WirelessStatus[m][0] = "$01"; //Enable
	G_WirelessStatus[m][1] = "$02"; //byteSent
	G_WirelessStatus[m][2] = "$03"; //BytesReceive
	G_WirelessStatus[m][3] = "$04"; //PacketsSent
	G_WirelessStatus[m][4] = "$05"; //PacketsReceived
	G_WirelessStatus[m][5] = "$06"; //RxError
	G_WirelessStatus[m][6] = "$07"; //TxError
	G_WirelessStatus[m][7] = "$08"; //RxDrop
	G_WirelessStatus[m][8] = "$09"; //TxDrop
	G_WirelessStatus[m][9] = "$0a"; //SSID
	m++;
`?>
/*---  LAN  ---*/
var G_LanStatus = [];
var m = 0;
<?objget :InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig. "Status Stats.BytesSent Stats.BytesReceived Stats.PacketsSent Stats.PacketsReceived MACAddress X_TWSZ-COM_Description"
`	G_LanStatus[m] = [];
	G_LanStatus[m][0] = "$01"; //status
	G_LanStatus[m][1] = "$02"; //bytesSent
	G_LanStatus[m][2] = "$03"; //BytesReceived
	G_LanStatus[m][3] = "$04"; //PacketsSent
	G_LanStatus[m][4] = "$05"; //PacketsReceived
	G_LanStatus[m][5] = "0"; //RxError
	G_LanStatus[m][6] = "0"; //TxError
	G_LanStatus[m][7] = "0"; //RxDrop
	G_LanStatus[m][8] = "0"; //TxDrop
	G_LanStatus[m][9] = "$06";
	G_LanStatus[m][10] = "$07";
	m++;
`?>

/*---  WAN  ---*/
//Wan Conns List
var G_WanConns = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name ConnectionType AddressingType ConnectionStatus Stats.EthernetBytesReceived Stats.EthernetPacketsReceived Stats.EthernetDiscardPacketsReceived Stats.EthernetErrorsReceived Stats.EthernetBytesSent Stats.EthernetPacketsSent Stats.EthernetDiscardPacketsSent Stats.EthernetErrorsSent"
		`	G_WanConns[m] = ["InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection.$00.", //Path
					 "$01",   	//name
					 "$02",		//connection type
					 "$03",		//address type
                     "$04",     //ConnectionStatus
					 "$05",		//r_byte
					 "$06",		//r_pkts
					 "$07",		//r_drop
					 "$08",		//r_error
					 "$09",		//t_type
					 "$0a",		//t_pkts
					 "$0b",		//t_drop
					 "$0c"		//t_error
					];			
			G_WanConns[m].push("<?get :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$30.WANIPConnection.$10.X_TWSZ-COM_IPv6Config.ConnectionStatus ?>");
			++m;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name ConnectionType ConnectionStatus Stats.EthernetBytesReceived Stats.EthernetPacketsReceived Stats.EthernetDiscardPacketsReceived Stats.EthernetErrorsReceived Stats.EthernetBytesSent Stats.EthernetPacketsSent Stats.EthernetDiscardPacketsSent Stats.EthernetErrorsSent"
		`	G_WanConns[m] = ["InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANPPPConnection.$00.", //Path
					 "$01",   	//name
					 "$02" ,    //connection type
					 "pppoe",   //address type
                     "$03",     //ConnectionStatus
					 "$04",	 	//r_byte
					 "$05",     //r_pkts
					 "$06",		//r_drop
					 "$07",		//r_error
					 "$08",		//t_type
					 "$09",		//t_pkts
					 "$0a",		//t_drop
					 "$0b"		//t_error
					 ];
			G_WanConns[m].push("<?get :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$30.WANPPPConnection.$10.X_TWSZ-COM_IPv6Config.ConnectionStatus ?>");
			++m;
		`?>
	`?>
`?>

//初始化
function uiOnload(){
	crtWlanTable();
	ctrLANTable();	
	ctrWANTable();
}
//WLAN Table
function crtWlanTable(){
	var value_array = [];
	for(var j = 0; j< G_WirelessStatus.length;j++){
		if (G_WirelessStatus[j][0] == '1') {
			value_array[j] = [
				(G_WirelessStatus[j][9] == "")? '0' : G_WirelessStatus[j][9],
				(G_WirelessStatus[j][1] == "")? '0' : G_WirelessStatus[j][1],
				(G_WirelessStatus[j][3] == "")? '0' : G_WirelessStatus[j][3],
				(G_WirelessStatus[j][6] == "")? '0' : G_WirelessStatus[j][6],
				(G_WirelessStatus[j][8] == "")? '0' : G_WirelessStatus[j][8],
				(G_WirelessStatus[j][2] == "")? '0' : G_WirelessStatus[j][2],
				(G_WirelessStatus[j][4] == "")? '0' : G_WirelessStatus[j][4],
				(G_WirelessStatus[j][5] == "")? '0' : G_WirelessStatus[j][5],
				(G_WirelessStatus[j][7] == "")? '0' : G_WirelessStatus[j][7]
			];
		}
	}
	$T('tb_wlan', value_array);
}
//LAN Table
function ctrLANTable(){
	var value_array = [];
	for(var j = 0; j< G_LanStatus.length;j++){
		if (G_LanStatus[j][0] == 'Up') {
			value_array[j] = [
				G_LanStatus[j][10],
				G_LanStatus[j][1],
				G_LanStatus[j][3],
				G_LanStatus[j][6],
				G_LanStatus[j][8],
				G_LanStatus[j][2],
				G_LanStatus[j][4],
				G_LanStatus[j][5],
				G_LanStatus[j][7]
			];
		}
	}
	$T('tb_lan', value_array);
}
function get_conn_type_Ethnet(){
	var i = arguments[0];
	if (G_WanConns[i][0].indexOf('IP') > -1) {
		if (G_WanConns[i][2] == 'IP_Bridged')
			return 'BRIDGE';
		else 
			return G_WanConns[i][3].toUpperCase();
		}
	else
		return 'PPPOE';
}
//WAN Table
function ctrWANTable(){
	var value_array = [];
	for(var i=0, j=0, _len = G_WanConns.length; i < _len; i++){
		// 
        if (G_WanConns[i][4] == "Disconnected" && G_WanConns[i][13] == "Disconnected"){
            continue;
        }
		type = get_conn_type_Ethnet(i);
		value_array[i] = [		
                            G_WanConns[i][1].ellipsis(12), //Service Name
                            type, //Protocol
                            G_WanConns[i][9], //t_type
                            G_WanConns[i][10], //t_pkts
                            G_WanConns[i][11],//t_drop
                            G_WanConns[i][12], //t_error
                            G_WanConns[i][5], //r_byte
                            G_WanConns[i][6], //r_pkts
                            G_WanConns[i][7], //r_drop
                            G_WanConns[i][8]  //r_error
                        ];
	}
	$T('tb_wan', value_array);
}

//监听加载
addListeners(uiOnload);