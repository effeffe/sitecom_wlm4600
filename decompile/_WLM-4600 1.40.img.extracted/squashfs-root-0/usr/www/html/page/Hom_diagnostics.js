/*  JavaScript Document:Hom_diagnostics  */
var WANConn = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_ServiceList"
		`	WANConn[m] = [];
			WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00";   // Path
			WANConn[m][1] = "$01";   // Name
			WANConn[m][2] = "$02";   // X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_ServiceList"
		`	WANConn[m] = [];
			WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00";   // Path
			WANConn[m][1] = "$01";   // Name
			WANConn[m][2] = "$02";   // X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
`?>
//test lan
var G_test_lan_status = [], G_Lan_Description = [];;
<?mget :InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig. "1.Status 2.Status 3.Status 4.Status"  
`	G_test_lan_status[0] = "$01";
	G_test_lan_status[1] = "$02";
	G_test_lan_status[2] = "$03";
	G_test_lan_status[3] = "$04";
`?>
<?mget :InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig. "1.X_TWSZ-COM_Description 2.X_TWSZ-COM_Description 3.X_TWSZ-COM_Description 4.X_TWSZ-COM_Description "  
`	G_Lan_Description[0] = "$01";
	G_Lan_Description[1] = "$02";
	G_Lan_Description[2] = "$03";
	G_Lan_Description[3] = "$04";
`?>
//wlan test status
var G_wlan_status = "<?get :InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.Enable ?>" 
//DSL
var G_adslsyn_status = G_atmf5seg_status = G_atmf5end_status = G_atmf4seg_status = G_atmf4end_status = "N/A";
var G_pinggw_status = "<?get :InternetGatewayDevice.X_TWSZ-COM_Diagnostics.Status.IPPingGateway?>" || "N/A";
var G_pingdns_status = "<?get :InternetGatewayDevice.X_TWSZ-COM_Diagnostics.Status.IPPingPrimaryDNS?>" || "N/A";
var G_InternetWanType = "Ethernet";
<?objget :InternetGatewayDevice.WANDevice. "WANCommonInterfaceConfig.WANAccessType"
`	<?if eq `DSL` $11
	`	<?mget :InternetGatewayDevice.X_TWSZ-COM_Diagnostics.Status. "ADSLSynchronization ATMF5SegmentLoopback ATMF5EndToEndLoopback ATMF4SegmentLoopback ATMF4EndToEndLoopback"  
		`	G_adslsyn_status	= "$01";
			G_atmf5seg_status	= "$02";
			G_atmf5end_status	= "$03";
			G_atmf4seg_status	= "$04";
			G_atmf4end_status	= "$05";
		`?>
		G_InternetWanType = "DSL";
	`?>
`?>
<?mget :InternetGatewayDevice.X_TWSZ-COM_Diagnostics. "DiagnosticsState Interface"
`	var G_DiagnosticsState	= "$01";
	var G_Interface		= "$02";
`?>
var G_wanpath			= "<?echo $var:wanpath?>";
var G_lan_status=[];


function uiOnload(){
	var _text = [], _value = [];
	for(var i = 0; i < WANConn.length; i++){
		if (WANConn[i][1].indexOf('br') > -1||WANConn[i][2]=="TR069" || WANConn[i][1].indexOf('Bridge') > -1) {
			continue;
		}
		_text.push(WANConn[i][1]);
		_value.push(WANConn[i][0]);
	}
	$S('SEL_WAN',_text,_value);
	G_wanpath == "-" ? $('SEL_WAN').selectedIndex = 0 : Form.Select('SEL_WAN', G_wanpath);
	
	load_lan_status();
	load_dsl_status();
	load_wan_status();	
	set_colors();
}

//color
function set_colors(){
	var objs = $('td_lan1','td_lan2','td_lan3','td_lan4','td_wlan','td_adsl','td_atm1','td_atm2','td_atm3','td_atm4','td_defgw','td_pridns');
	for(var i=0; i<objs.length; i++){
		if (objs[i] != null){
			set_color(objs[i], objs[i].innerHTML);
		}
	}
}
function set_color(obj, text){
//	obj.style.color = (text == "PASS" || text == "Up" || text == "1") ? "green" : "red";
	obj.style.color = (text == SEcode[8002]) ? "green" : "red";
}

//lan
function change_lan_status(){
 	var i = 0;
 	for( i=0; i < 4; i++)
	{
	       var index = 1+i;
		if(G_Lan_Description[i].indexOf(index) > 0){
			G_lan_status[i] = G_test_lan_status[i];
		}else{
			G_lan_status[i] = G_test_lan_status[3-i];  
		}              
	}	
}

function load_lan_status(){
	change_lan_status();
	if('DSL' == G_InternetWanType)
		setJSONValue({
			'td_lan1' : G_lan_status[0] == "Up" ? SEcode[8002] : SEcode[8003],
			'td_lan2' : G_lan_status[1] == "Up" ? SEcode[8002] : SEcode[8003],
			'td_lan3' : G_lan_status[2] == "Up" ? SEcode[8002] : SEcode[8003],
			'td_lan4' : G_lan_status[3] == "Up" ? SEcode[8002] : SEcode[8003]
//			'td_wlan' : G_wlan_status == "1" ? SEcode[8002] : SEcode[8003]
		});
	else
		setJSONValue({
			'td_lan1' : G_lan_status[0] == "Up" ? SEcode[8002] : SEcode[8003],
			'td_lan2' : G_lan_status[1] == "Up" ? SEcode[8002] : SEcode[8003],
			'td_lan3' : G_lan_status[2] == "Up" ? SEcode[8002] : SEcode[8003]
//			'test_wlan' : G_wlan_status == "1" ? SEcode[8002] : SEcode[8003]
		});
}

//DSL
function load_dsl_status(){
	setJSONValue({
		'td_adsl' : G_adslsyn_status == 'PASS' ? SEcode[8002] : SEcode[8003],
		'td_atm1' : G_atmf5seg_status == 'PASS' ? SEcode[8002] : SEcode[8003],
		'td_atm2' : G_atmf5end_status == 'PASS' ? SEcode[8002] : SEcode[8003],
		'td_atm3' : G_atmf4seg_status == 'PASS' ? SEcode[8002] : SEcode[8003],
		'td_atm4' : G_atmf4end_status == 'PASS' ? SEcode[8002] : SEcode[8003]
	});
}

//Internet
function load_wan_status(){
	setJSONValue({
		'td_defgw'  : G_pinggw_status == 'PASS' ? SEcode[8002] : SEcode[8003],
		'td_pridns' : G_pingdns_status == 'PASS' ? SEcode[8002] : SEcode[8003]
	});
}

//提交
function uiSubmit(){	
	var wan_path = $('SEL_WAN').value;
	if (wan_path == ''){
		alert(SEcode[1009]);
		return false;
	}

	$H({
		':InternetGatewayDevice.X_TWSZ-COM_Diagnostics.DiagnosticsState' : 'Requested',
		':InternetGatewayDevice.X_TWSZ-COM_Diagnostics.Interface' : wan_path,
		'var:menu'	: G_Menu,
		'var:page'	: G_Page,
		'getpage'	: 'html/index.html',
		'errorpage'	: 'html/index.html',
		'obj-action'	: 'set',
		'var:wanpath'	: wan_path,
		'var:errorpage'	: G_Page,
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
	$('DIAG019').disabled = true;
}
function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);