/* JavaScript Document */
var G_WanConns = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name ConnectionType X_TWSZ-COM_ProtocolType"
		`	G_WanConns[m] = ["$01", "$02", "$03", "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00"];
			++m;
		`?>
	`?>
    <?if gt $12 0
	`	
        <?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name ConnectionType X_TWSZ-COM_ProtocolType"
		`	G_WanConns[m] = ["$01", "$02", "$03", "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00"];
			++m;
		`?>
	`?>
`?>

<?mget :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement. "DHCPServerEnable DHCPRelay MinAddress MaxAddress DHCPLeaseTime X_TWSZ-COM_DNSRelayEnable DNSServers DomainName X_TWSZ-COM_DHCPRelayAddress X_TWSZ-COM_UseIPRoutersAsDNSServer"
`	G_DSEnable 	= "$01";
	G_DHCPRelay 	= "$02";
	G_MinAddress 	= "$03";
	G_MaxAddress 	= "$04";
	G_DHCPLeaseTime = "$05";
	G_DNSRelayEnable= "$06";
	G_DNSServers 	= "$07";
	G_DomainName 	= "$08";
	G_DHCPRelayAddr = "$09";
    G_UseIPRoutersAsDNSServer = "$0a";
`?>
//预留IP
var G_DHCPResAddr = [];
var n = 0;
<?objget :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.X_TWSZ-COM_DHCPFilter.WhiteList. "FilterIP FilterMAC PerEnabled FilterPCName"
`	G_DHCPResAddr[n] = [];
	G_DHCPResAddr[n][0] = "$00";
	G_DHCPResAddr[n][1] = "$01";
	G_DHCPResAddr[n][2] = "$02";
	G_DHCPResAddr[n][3] = "$03";
	G_DHCPResAddr[n][4] = "$04";
	n++;
`?>
//Radvd
var G_RadvdEnabled = "<?get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.RADVD.Enabled?>";
var G_PreGetMode = "<?get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.IPv6SitePrefixConfigType.StaticDelegated?>";
<?mget :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.RadVDConfigManagement.ULAPrefixInfo. "Prefix PreferredLifeTime ValidLifeTime"
`	G_RadPrefix 	= "$01";
	G_RadPretime 	= "$02";
	G_Radvalidtime 	= "$03";
`?>
//DHCPv6
var G_DHCPv6Enable = "<?get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.AutoConfigurationAddress?>";

var G_DHCPv6Relay = "<?get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.IPv6DNSRelayEnable?>"
var G_Stateless = "<?get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.Stateless?>";
var G_IPv6DNSWanConnectionInterface = '<? get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.IPv6DNSWanConnection ?>'

<?mget :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.StatefullDHCPv6. "MinInterfaceID MaxInterfaceID DHCPv6LeaseTime DHCPv6ValidTime IPv6DNSConfigType IPv6DNSServers"
`	G_MinID 		= "$01";
	G_MaxID 		= "$02";
	G_DHCPv6time 		= "$03";
	G_DHCPv6ValidTime 	= "$04";
	G_IPv6DNSConfigType 	= "$05";
	G_DHCPv6DNS 		= "$06";
`?>

//全局变量
var action = 0;		//0 ==> 新增；1 ==> 编辑
var cur_index 		//当前编辑实例
//加载初始化
function uiOnload(){
	createWanSelect();
	//DHCP Mode
	if(G_DSEnable == '1'){
		Form.Radio('RAD_dhcpmode', 'dhcpserver');
	}else if(G_DHCPRelay == '1'){
		Form.Radio('RAD_dhcpmode', 'dhcprelay');
	}else
		Form.Radio('RAD_dhcpmode', 'dhcpnone');
	
	var Pir_DNS = G_DNSServers.split(',')[0], Sec_DNS = G_DNSServers.split(',')[1];
	var DHCPv6Pir_DNS = G_DHCPv6DNS.split(',')[0], DHCPv6Sec_DNS = G_DHCPv6DNS.split(',')[1];
	var Pre_Prefix = G_RadPrefix.split('/')[0], Pre_Length = 64;
	setJSONValue({
		"INPUT_DHCPRelay" 	: G_DHCPRelayAddr,
		"INPUT_StartIP" 	: G_MinAddress,
		"INPUT_EndIP" 		: G_MaxAddress,
		"INPUT_Leasetime" 	: G_DHCPLeaseTime,
		"INPUT_DomainName" 	: G_DomainName,
		"INPUT_pridns" 		: Pir_DNS || "",
		"INPUT_secdns" 		: Sec_DNS || "",
		"INPUT_RadvdPreferred" 	: G_RadPretime,
		"INPUT_RadvdLifetime" 	: G_Radvalidtime,
		"INPUT_StartID" 	: G_MinID || "1",
		"INPUT_EndID" 		: G_MaxID || "ff",
		"INPUT_V6Preferred" 	: G_DHCPv6time,
		"INPUT_V6Lifetime" 	: G_DHCPv6ValidTime,
		"INPUT_V6PriDNS" 	: DHCPv6Pir_DNS || "",
		"INPUT_V6SecDNS" 	: DHCPv6Sec_DNS || "",
		"INPUT_RadvdPrefix" 	: Pre_Prefix || "",
		"INPUT_RadvdLength" 	: Pre_Length || ""
	});
	//DHCP Mode
	onClkDHCPMode();
	//DNS Relay
	Form.Radio('RAD_dnsrelay', G_DNSRelayEnable || '1');
    //DNS mode
 //   Form.Radio('DNS_mode', G_UseIPRoutersAsDNSServer || '1');
	onClkDNSMode();
	//Radvd
	Form.Radio('RAD_radvd', G_RadvdEnabled || '0');
	onClkRadvd()
	//DHCPv6
	Form.Radio('RAD_dhcpv6s', G_DHCPv6Enable || '0');
	Form.Radio('RAD_State', G_Stateless || '1');
	Form.Radio('RAD_getDNSMode', G_IPv6DNSConfigType || "DHCP");
	Form.Radio('RAD_getMode', G_PreGetMode || "0");
	onClkDHCPv6S();
	onClkgetMode();
	//created reservation table
	createResTb();
}

function createWanSelect(){
    var wan_text = [];
    var wan_dnsvalue = [];
    wan_dnsvalue[0] = '';
    wan_text[0] = 'None';

    for (var i = 0; i < G_WanConns.length; i++){
        if (G_WanConns[i][1].indexOf('Bridged') > -1 ||  /* pass bridged connection  */
            G_WanConns[i][2] == 'IPv4' ){   /* pass  only ipv4  conncetion */
            continue;
        }
        wan_text.push( G_WanConns[i][0] );
        wan_dnsvalue.push( G_WanConns[i][3] );
    }

   // 选择已经绑定的wan interface,如果节点已经被删除, 那么这里会默认为null.
    $S('SELECT_DNS_Wan', wan_text, wan_dnsvalue);
    Form.Select('SELECT_DNS_Wan',G_IPv6DNSWanConnectionInterface); 

}

//DHCP Mode
function onClkDHCPMode(xValue){
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio('RAD_dhcpmode');
	}
	//HTML 触发
	if(xValue == 'dhcpserver'){
		$('tb_dhcpmode').style.display = '';
		$('DIV_ModeNone').style.display = '';
		$('tb_dhcprelay').style.display = 'none';
	}else if(xValue == 'dhcprelay'){
		$('tb_dhcpmode').style.display = 'none';
		$('DIV_ModeNone').style.display = 'none';
		$('tb_dhcprelay').style.display = '';
	}else{
		$('tb_dhcpmode').style.display = 'none';
		$('DIV_ModeNone').style.display = 'none';
		$('tb_dhcprelay').style.display = 'none';
	}
}

//DNS Relay
function onClkDNSMode(xValue){

    xValue = Form.Radio('RAD_dnsrelay');
    
	if(xValue == '0'){
		$('INPUT_pridns').disabled = false;
		$('INPUT_secdns').disabled = false;
	}else{		
		$('INPUT_pridns').disabled = true;
		$('INPUT_secdns').disabled = true;
	}
}

//Radvd
function onClkRadvd(xValue){
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio("RAD_radvd");
	}
	//HTML 触发
	if(xValue == '1'){
		$('tb_radvdmode').style.display = '';		
		$('tb_prefix').style.display = '';
	}else{
		$('tb_radvdmode').style.display = 'none';
		if(Form.Radio("RAD_dhcpv6s") == "0"){
			$('tb_prefix').style.display = 'none';
		}
	}
}

//DHCPv6
function onClkDHCPv6S(xValue){
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio('RAD_dhcpv6s');
	}
	//HTML 触发
	if(xValue == '1'){
		$('tb_v6dhcpmode').style.display = '';
		$('tb_prefix').style.display = '';
	}else{
		$('tb_v6dhcpmode').style.display = 'none';
		if(Form.Radio("RAD_radvd") == "0"){
			$('tb_prefix').style.display = 'none';
		}
	}
	//
	onClklanAddrMode();
	onClkgetDNSMode();
}

//DHCPv6 DNSServer
function onClklanAddrMode(xValue){
	//DHCP6 Server disable ==> Statless
	if(Form.Radio('RAD_dhcpv6s') == '0'){
		Form.Radio('RAD_State', "1");
	}
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio('RAD_State');
	}
	
	if(xValue == "1"){
		$('INPUT_StartID').disabled = true;
		$('INPUT_EndID').disabled = true;
		$('INPUT_V6Preferred').disabled = true;
		$('INPUT_V6Lifetime').disabled = true;
	}else{
		$('INPUT_StartID').disabled = false;
		$('INPUT_EndID').disabled = false;
		$('INPUT_V6Preferred').disabled = false;
		$('INPUT_V6Lifetime').disabled = false;
	}
}

//DHCPv6 DNS Server 
function onClkgetDNSMode(xValue){
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio('RAD_getDNSMode');
	}	
	if(xValue == "DHCP"){
		$('SELECT_DNS_Wan').disabled = false;
		$('INPUT_V6PriDNS').disabled = true;
		$('INPUT_V6SecDNS').disabled = true;
	}else{
		$('SELECT_DNS_Wan').disabled = true;
		$('INPUT_V6PriDNS').disabled = false;
		$('INPUT_V6SecDNS').disabled = false;
	}
}

//Prefix 隐藏条件 : 因为前缀是两个公用
function onClkgetMode(xValue){	
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio('RAD_getMode');
	}
	if(xValue == "0"){
		$('INPUT_RadvdPrefix').disabled = true;
		$('INPUT_RadvdLength').disabled = true;
	}else{
		$('INPUT_RadvdPrefix').disabled = false;
		$('INPUT_RadvdLength').disabled = false;
	}
}

//创建保留地址列表
function createResTb(){
	var value_array = [];
	for(var i=0; i<G_DHCPResAddr.length; i++){
		value_array[i] = [];
		value_array[i].push(i+1); //#
		value_array[i].push(G_DHCPResAddr[i][1]); //IP
		value_array[i].push(G_DHCPResAddr[i][2]); //MAC
		value_array[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="EditEntry('+ i +')"/>');
		value_array[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="RemoveEntry('+ G_DHCPResAddr[i][0] +')"/>');
	}	
	$T('ta_dhcplist',value_array);
}

//添加
function uiRedirect(){
	action = 0;
	$('DIV_DHCP').style.display = "none";
	$('RESERVATION').style.display = "";
}
function uiApply(){
	//判断新增实例还是编辑实例
	if(action == 0){
		$H({
			"add-obj" 		: "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.X_TWSZ-COM_DHCPFilter.WhiteList.",
			":FilterIP" 		: $('INPUT_ReservationIP').value,
			":FilterMAC" 		: $('INPUT_ReservationMAC').value,
            ":PerEnabled"       :   "1",
			"obj-action" 		: "add-set",
			"getpage" 		: "html/index.html",
			"errorpage" 		: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" 	: G_Page,
			"var:CacheLastData" 	: ViewState.Save()
		}, true);
	}else{
		var _path = ":InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.X_TWSZ-COM_DHCPFilter.WhiteList." + cur_index;
		$H({
			"obj-action" 		: "set",
			"getpage" 		: "html/index.html",
			"errorpage" 		: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" 	: G_Page,
			"var:CacheLastData" 	: ViewState.Save()
		}, true);
		//路径中包含变量，必须使用$F
		$F(_path + ".FilterIP", 	$('INPUT_ReservationIP').value);
		$F(_path + ".FilterMAC", 	$('INPUT_ReservationMAC').value);
        $F(_path + ".PerEnabled", 	"1");
	}
	$('uiPostForm').submit();
}

//编辑
function EditEntry(Idx){
	action = 1;
	$('DIV_DHCP').style.display = "none";
	$('RESERVATION').style.display = "";
	cur_index = G_DHCPResAddr[Idx][0];
	$('INPUT_ReservationIP').value = G_DHCPResAddr[Idx][1];
	$('INPUT_ReservationMAC').value = G_DHCPResAddr[Idx][2];
}

//删除
function RemoveEntry(Idx){
	if(!confirm(SEcode[1001])){
		return false;
	}
	var _path = "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.X_TWSZ-COM_DHCPFilter.WhiteList." + Idx + '.';
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

//提交配置
function uiSubmit(){
	var _DNSServer = $('INPUT_pridns').value + ',' + $('INPUT_secdns').value;
	$H({
	   	':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPServerEnable' 		: Form.Radio("RAD_dhcpmode") == 'dhcpserver' ? '1' : '0',
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPRelay' 			: Form.Radio("RAD_dhcpmode") == 'dhcprelay' ? '1' : '0',
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.X_TWSZ-COM_DHCPRelayAddress': Form.Radio("RAD_dhcpmode") == 'dhcprelay' ? $('INPUT_DHCPRelay').value : undefined,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MinAddress' 		: $('INPUT_StartIP').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MaxAddress' 		: $('INPUT_EndIP').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DHCPLeaseTime' 		: $('INPUT_Leasetime').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DomainName' 		: $('INPUT_DomainName').value,
		':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.X_TWSZ-COM_DNSRelayEnable' 	: Form.Radio("RAD_dnsrelay"),
      //  ':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.X_TWSZ-COM_UseIPRoutersAsDNSServer'  : Form.Radio("DNS_mode"),
		':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.RADVD.Enabled' 				: Form.Radio('RAD_radvd'),
		':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.AutoConfigurationAddress' 			: Form.Radio('RAD_dhcpv6s'),
		':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.Stateless' 			: Form.Radio('RAD_State'),
		':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.IPv6SitePrefixConfigType.StaticDelegated' 	: Form.Radio('RAD_getMode'),
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
    if ( Form.Radio("RAD_dnsrelay") == "0" ){
        $F(':InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.DNSServers' , _DNSServer.delcomma());
    }
	//Radvd
	if(Form.Radio('RAD_radvd') == '1'){
		$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.RadVDConfigManagement.ULAPrefixInfo.PreferredLifeTime', 	$('INPUT_RadvdPreferred').value);
		$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.RadVDConfigManagement.ULAPrefixInfo.ValidLifeTime', 	$('INPUT_RadvdLifetime').value);
	}
	//DHCPv6
	if(Form.Radio('RAD_dhcpv6s') == '1'){
		$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.StatefullDHCPv6.IPv6DNSConfigType', Form.Radio('RAD_getDNSMode'));
		if(Form.Radio('RAD_State') == '0'){			
			$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.StatefullDHCPv6.MinInterfaceID', 	$('INPUT_StartID').value);
			$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.StatefullDHCPv6.MaxInterfaceID', 	$('INPUT_EndID').value);
			$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.StatefullDHCPv6.DHCPv6LeaseTime', 	$('INPUT_V6Preferred').value);
			$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.StatefullDHCPv6.DHCPv6ValidTime', 	$('INPUT_V6Lifetime').value);
		}
		if(Form.Radio('RAD_getDNSMode') == 'Static'){
			var _DHCPv6_DNS = $('INPUT_V6PriDNS').value + ',' + $('INPUT_V6SecDNS').value;
			$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.ServerType.StatefullDHCPv6.IPv6DNSServers', 	_DHCPv6_DNS.delcomma());
		}else{
			$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.IPv6DNSWanConnection'  , Form.Select('SELECT_DNS_Wan'));
		}
	}
	//Prefix
	if(Form.Radio('RAD_getMode') == '1'){
		var _Prefix_length = $('INPUT_RadvdPrefix').value + '/64';
		$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_IPv6LANHostConfigManagement.RadVDConfigManagement.ULAPrefixInfo.Prefix', 		_Prefix_length);
		
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