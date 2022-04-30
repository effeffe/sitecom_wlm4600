/*  JavaScript Document:Adv_mld  */
var G_WANConn = [], G_LAN = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_ProtocolType X_TWSZ-COM_ServiceList"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00";   // Path
			G_WANConn[m][1] = "$01";   // Name
			G_WANConn[m][2] = "$02";   // X_TWSZ-COM_ProtocolType
			G_WANConn[m][3] = "$03";   // X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_ProtocolType X_TWSZ-COM_ServiceList"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00";   // Path
			G_WANConn[m][1] = "$01";   // Name
			G_WANConn[m][2] = "$02";   // X_TWSZ-COM_ProtocolType
			G_WANConn[m][3] = "$03";   // X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
`?>
// LAN Device
var G_LANDeviceName = "<?get :InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_DeviceName?>";
//IP Tunnel
var G_IPTunnel = [], G_4in6Tunnel = [], G_6in4Tunnel = [];
var n = 0, k = 0, t = 0;
<?objget :InternetGatewayDevice.X_TWSZ-COM_IPTunnel. "TunnelName Mode AssociatedWanIfName AssociatedLanIfName Activated TunnelCounter"
`	G_IPTunnel[n] = [];
	G_IPTunnel[n][0] = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel.$00.";
	G_IPTunnel[n][1] = "$01";
	G_IPTunnel[n][2] = "$02";
	G_IPTunnel[n][3] = "$03";
	G_IPTunnel[n][4] = "$04";
	G_IPTunnel[n][5] = "$05";
	G_IPTunnel[n][6] = "$06";
	G_IPTunnel[n][7] = "$00";
	<?if eq `4in6` $12
	`	<?objget :InternetGatewayDevice.X_TWSZ-COM_IPTunnel.$20.4in6Tunnel. "Mechanism Dynamic RemoteIpv6Address ConnStatus Select"
		`	G_4in6Tunnel[k] = [];
			G_4in6Tunnel[k][0] = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel.$20.4in6Tunnel.$00.";
			G_4in6Tunnel[k][1] = "$01";	//Mechanism 
			G_4in6Tunnel[k][2] = "$02";	//Dynamic 
			G_4in6Tunnel[k][3] = "$03";	//RemoteIpv6Address 
			G_4in6Tunnel[k][4] = "$04";	//ConnStatus 
			G_4in6Tunnel[k][5] = "$05";	//Select
			G_4in6Tunnel[k][6] = "$00";	//Index
			k++;
		`?>	
	`?>
	<?if eq `6in4` $12
	`	<?objget :InternetGatewayDevice.X_TWSZ-COM_IPTunnel.$20.6in4Tunnel. "Mechanism Dynamic IPv4MaskLen Prefix BorderRelayAddress ConnStatus Select"
		`	G_6in4Tunnel[t] = [];
			G_6in4Tunnel[t][0] = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel.$20.6in4Tunnel.$00.";
			G_6in4Tunnel[t][1] = "$01";	//Mechanism 
			G_6in4Tunnel[t][2] = "$02";	//Dynamic 
			G_6in4Tunnel[t][3] = "$03";	//IPv4MaskLen 
			G_6in4Tunnel[t][4] = "$04";	//Prefix 
			G_6in4Tunnel[t][5] = "$05";	//BorderRelayAddress 
			G_6in4Tunnel[t][6] = "$06";	//ConnStatus 
			G_6in4Tunnel[t][7] = "$07";	//Select
			G_6in4Tunnel[t][8] = "$00";	//Index
			t++;
		`?>	
	`?>
	n++;
`?>

//全局
var choose;
var action = "0";	//0 ==> 添加； 1 ==> 编辑
var editidx = "0";	//当前编辑实例在 get 值中的序列号

//crt wan select
function crtWANSelect(xMode){
	if(xMode == undefined){
		var xMode = "4";
	}
	
	var _text = [], _value = [];
	for(var i = 0; i < G_WANConn.length; i++){
		if (G_WANConn[i][3] == "TR069") {
			continue;
		}
		if (G_WANConn[i][2] != xMode) {
			continue;
		}
		_text.push(G_WANConn[i][1]);
		_value.push(G_WANConn[i][0]);
	}
	$S('SEL_WAN',_text,_value);
}
//crt lan select
function crtLANSelect(xValue){
	var _text = [] ,_value = [];
	_text.push(G_LANDeviceName);
	if(xValue == undefined){
		var xValue = "4in6";
	}
	
	if(xValue == "4in6"){
		_value.push("InternetGatewayDevice.LANDevice.1");
	}else{
		_value.push("InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1");
	}
	$S('SEL_LAN',_text,_value);
}

//
function onChgMode(xValue){
	if(xValue == undefined){
		var xValue = "4in6";
	}
	
	if(xValue == "4in6"){
		crtWANSelect("IPv6");
	}else{
		crtWANSelect("IPv4");
	}
	
	crtLANSelect(xValue);
}

//find connection name
function findConnName(xValue){
	var retValue;
	for(var i=0; i<G_WANConn.length; i++){
		if(xValue == G_WANConn[i][0]){
			retValue = G_WANConn[i][1];
			continue;
		}
	}
	
	return retValue;
}

//
function crtIPTunnelItems(){
	var value_array = [];
	for(var i=0; i<G_IPTunnel.length; i++){
		value_array[i] = [];
		value_array[i].push('<input type="radio" name="RAD_Choose" id="RAD_Choose'+i+'" value="'+ i +'" onClick="crt4in6List('+i+')">'); 	//choose
		value_array[i].push(G_IPTunnel[i][1]); 	//name
		value_array[i].push(G_IPTunnel[i][2]); //mode
		value_array[i].push(findConnName(G_IPTunnel[i][3])); //wan
		value_array[i].push(G_LANDeviceName); //lan
		value_array[i].push('<input type="checkbox" id="CHB_Activat'+i+'" onClick="onClkActivat('+ i +')">'); //activated
		value_array[i].push(G_IPTunnel[i][6]); //counter
		value_array[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="EditEntry('+ i +')"/>');
		value_array[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="RemoveEntry('+ G_IPTunnel[i][7] +')"/>');
	}	
	$T('tb_iptunnel',value_array);
	//默认选择第一条
	if($("RAD_Choose0"))
		$("RAD_Choose0").checked = true;
	//激活状态赋值
	for(var i=0; i<G_IPTunnel.length; i++){
		if(G_IPTunnel[i][5] == "1")
			$("CHB_Activat"+i).checked = true;
		else
			$("CHB_Activat"+i).checked = false;
	}
}
function crt4in6List(xValue){
	var _firIndex = G_IPTunnel[xValue][7];
	var _mode = G_IPTunnel[xValue][2];
	//alert(_firIndex + " | " + _mode);
	var value_array = [];
	if(_mode == "4in6"){
		for(var i=0; i<G_4in6Tunnel.length; i++){
			value_array[i] = [];
			if(G_4in6Tunnel[i][0].split(".")[2] != _firIndex)
				continue;
			value_array[i].push(G_4in6Tunnel[i][1]); 	//mechanism
			value_array[i].push(G_4in6Tunnel[i][2]); 	//Dynamic
			value_array[i].push(G_4in6Tunnel[i][3]); 	//IPv6
			value_array[i].push(G_4in6Tunnel[i][4] == "Disconnected" ? SEcode[8005] : SEcode[8004]); //connstatus
			value_array[i].push('<input type="checkbox" id="CHB_4in6Select'+i+'" onClick="onClkSelect('+ i +')">'); //select
			value_array[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="EditEntryList('+ i +')"/>');
			value_array[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="RemoveEntry4in6('+ G_4in6Tunnel[i][6] +')"/>');
		}
		Table.Clear("tb_4in6list");
		$T('tb_4in6list',value_array);
		//赋值 Select
		for(var j=0; j<G_4in6Tunnel.length; j++){
			if(G_4in6Tunnel[j][0].split(".")[2] != _firIndex)
				continue;
			Form.Checkbox("CHB_4in6Select"+j , G_4in6Tunnel[j][5]);
		}
		//灰显控制
		$("tb_dslite").style.display = "";
		$("tb_4in6list").style.display = "";
		$("tb_6rdlist").style.display = "none";
		$("tb_6in4list").style.display = "none";
	}else if(_mode == "6in4"){
		for(var i=0; i<G_6in4Tunnel.length; i++){
			value_array[i] = [];
			if(G_6in4Tunnel[i][0].split(".")[2] != _firIndex)
				continue;
			value_array[i].push(G_6in4Tunnel[i][1]); 	//mechanism
			value_array[i].push(G_6in4Tunnel[i][2]); 	//Dynamic
			value_array[i].push(G_6in4Tunnel[i][3]); 	//IPv4MaskLen
			value_array[i].push(G_6in4Tunnel[i][4]); 	//Prefix
			value_array[i].push(G_6in4Tunnel[i][5]); 	//BorderRelayAddress
			value_array[i].push(G_6in4Tunnel[i][6] == "Disconnected" ? SEcode[8005] : SEcode[8004]); 	//connstatus
			value_array[i].push('<input type="checkbox" id="CHB_6in4Select'+i+'" onClick="onClkSelect('+ i +')">'); //select
			value_array[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="EditEntryList('+ i +')"/>');
			value_array[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="RemoveEntry6in4('+ G_6in4Tunnel[i][8] +')"/>');
		}
		Table.Clear("tb_6in4list");
		$T('tb_6in4list',value_array);
		//赋值 Select
		for(var j=0; j<G_6in4Tunnel.length; j++){
			if(G_6in4Tunnel[j][0].split(".")[2] != _firIndex)
				continue;
			Form.Checkbox("CHB_6in4Select"+j , G_6in4Tunnel[j][7]);
		}
		//灰显控制
		$("tb_dslite").style.display = "none";
		$("tb_4in6list").style.display = "none";
		$("tb_6rdlist").style.display = "";
		$("tb_6in4list").style.display = "";
	}
}

//加载初始化
function uiOnload(){
//	crtWANSelect();
//	crtLANSelect();
	//creat iptunnel table
	crtIPTunnelItems();
	if(G_IPTunnel != ""){//存在条目
		var _iptunnel = Form.Radio("RAD_Choose");	//选择那个条目,这里不是实例号，是get值时的序列号
		crt4in6List(_iptunnel);
		$("DIV_Tunnellists").style.display = "";
	}
}

//add iptunnel items
function uiAdd(){
	var _mode = Form.Select("SEL_Mode");
	onChgMode(_mode);
	$("DIV_TB_IPTunnel").style.display = "none";
	$("DIV_IPTunnel").style.display = "";
}
function uiListAdd(){
	var _firidx = Form.Radio("RAD_Choose");
	var _mode = G_IPTunnel[_firidx][2];
	if(_mode == "4in6"){
		$("DIV_TB_IPTunnel").style.display = "none";
		$("DIV_4in6IPTunnel").style.display = "";
	}else if(_mode == "6in4"){
		$("DIV_TB_IPTunnel").style.display = "none";
		$("DIV_6in4IPTunnel").style.display = "";
	}
}
//编辑
function EditEntry(Idx){
	action = 1;	//标记标志
	editidx=Idx;
	setJSONValue({
		"INPUT_TunnelName" 	: G_IPTunnel[Idx][1],
		"SEL_Mode" 		: G_IPTunnel[Idx][2],
		"SEL_WAN" 		: G_IPTunnel[Idx][3],
		"SEL_LAN" 		: G_IPTunnel[Idx][4]
	});
	
	$("SEL_Mode").disabled = true;
	$("DIV_TB_IPTunnel").style.display = "none";
	$("DIV_IPTunnel").style.display = "";
	onChgMode(G_IPTunnel[Idx][2]);
}
function EditEntryList(Idx){
	action = 1;
	editidx = Idx;
	var _firidx = Form.Radio("RAD_Choose");
	var _mode = G_IPTunnel[_firidx][2];
	//alert(_mode);
	if(_mode == "4in6"){
		setJSONValue({
			"SEL_4in6DualStackLite" : G_4in6Tunnel[Idx][1],
			"SEL_4in6Dynamic" 	: G_4in6Tunnel[Idx][2],
			"INPUT_4in6IPv6Address" : G_4in6Tunnel[Idx][3]
		});		
		$("DIV_TB_IPTunnel").style.display = "none";
		$("DIV_4in6IPTunnel").style.display = "";
	}else if(_mode == "6in4"){
		setJSONValue({
			"SEL_6in4Mechanism" 	: G_6in4Tunnel[Idx][1],
			"SEL_6in4Dynamic" 	: G_6in4Tunnel[Idx][2],
			"INPUT_6in4MaskLen" 	: G_6in4Tunnel[Idx][3],
			"INPUT_6in4Prefix" 	: G_6in4Tunnel[Idx][4],
			"INPUT_6in4BDRAddress" 	: G_6in4Tunnel[Idx][5]
		});
		$("DIV_TB_IPTunnel").style.display = "none";
		$("DIV_6in4IPTunnel").style.display = "";
	}
}

//激活
function onClkActivat(Idx){
	if(!confirm(SEcode[2005])){
		uiPageRefresh();
		return false;
	}
	var cur_index = G_IPTunnel[Idx][7];
	var cur_mode  = G_IPTunnel[Idx][2];
	
	$H({
		"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	},true);
	//如果当前为激活状态，这将其关闭即可
	if(G_IPTunnel[Idx][5] == "1"){
		$F(":" + G_IPTunnel[Idx][0] + "Activated", "0");
	}else{//否则查找是否有相同模式的激活条目，有则将其关闭，并激活当前条目，否则激活当前条目
		var act_idx = -1;	//激活的条目
		for(var i=0; i<G_IPTunnel.length; i++){
			if(G_IPTunnel[i][5] == "1" && G_IPTunnel[i][7] != cur_index && G_IPTunnel[i][2] == cur_mode){
				act_idx = i;
				continue;
			}
		}
		//alert("cur_index = " + cur_index + " | act_idx = " + act_idx + " | Idx = " + Idx);
		if(act_idx != -1){
			$F(":InternetGatewayDevice.X_TWSZ-COM_IPTunnel." + G_IPTunnel[act_idx][7] + ".Activated", "0");
		}
		$F(":" + G_IPTunnel[Idx][0] + "Activated", "1");
	}
	
	$('uiPostForm').submit();
}

//Select
function onClkSelect(Idx){
	if(!confirm(SEcode[2005])){
		uiPageRefresh();
		return false;
	}
	var _firIndex = Form.Radio('RAD_Choose');
	var _mode = G_IPTunnel[_firIndex][2];			
	$H({
		"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	},true);
	//如果当前为激活状态，这将其关闭即可
	
	if(_mode == "4in6"){
		var cur_index = G_4in6Tunnel[Idx][6];
		if(G_4in6Tunnel[Idx][5] == "1"){
			$F(":" + G_4in6Tunnel[Idx][0] + "Select", "0");
		}else{//否则查找是否有激活的条目，有则将其关闭，并激活当前条目，否则激活当前条目
			var act_idx = -1;	//激活的条目
			for(var i=0; i<G_4in6Tunnel.length; i++){
				if(G_4in6Tunnel[i][0].indexOf(G_IPTunnel[_firIndex][0]) > -1 && G_4in6Tunnel[i][5] == "1" && G_4in6Tunnel[i][6] != cur_index){
					act_idx = i;
					continue;
				}
			}
			//alert("cur_index = " + cur_index + " | act_idx = " + act_idx + " | Idx = " + Idx);
			if(act_idx != -1){
				$F(":InternetGatewayDevice.X_TWSZ-COM_IPTunnel." + G_IPTunnel[_firIndex][7] +".4in6Tunnel." + G_4in6Tunnel[act_idx][6] + ".Select", "0");
			}
			$F(":" + G_4in6Tunnel[Idx][0] + "Select", "1");
		}
	}else if(_mode == "6in4"){
		var cur_index = G_6in4Tunnel[Idx][8];
		if(G_6in4Tunnel[Idx][7] == "1"){
			$F(":" + G_6in4Tunnel[Idx][0] + "Select", "0");
		}else{//否则查找是否有激活的条目，有则将其关闭，并激活当前条目，否则激活当前条目
			var act_idx = -1;	//激活的条目
			for(var i=0; i<G_6in4Tunnel.length; i++){
				if(G_6in4Tunnel[i][0].indexOf(G_IPTunnel[_firIndex][0]) > -1 && G_6in4Tunnel[i][7] == "1" && G_6in4Tunnel[i][8] != cur_index){
					act_idx = i;
					continue;
				}
			}
			//alert("cur_index = " + cur_index + " | act_idx = " + act_idx + " | Idx = " + Idx);
			if(act_idx != -1){
				$F(":InternetGatewayDevice.X_TWSZ-COM_IPTunnel." + G_IPTunnel[_firIndex][7] +".6in4Tunnel." + G_6in4Tunnel[act_idx][8] + ".Select", "0");
			}
			$F(":" + G_6in4Tunnel[Idx][0] + "Select", "1");
		}
	}
	//return false;
	$('uiPostForm').submit();
}

//删除
function RemoveEntry(Idx){
	if(!confirm(SEcode[1001])){
		return false;
	}
	var _path = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel." + Idx + '.';
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
function RemoveEntry4in6(Idx){
	if(!confirm(SEcode[1001])){
		return false;
	}
	var _firidx = Form.Radio("RAD_Choose");
	var _path = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel."+ G_IPTunnel[_firidx][7] +".4in6Tunnel." + Idx + '.';
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
function RemoveEntry6in4(Idx){
	if(!confirm(SEcode[1001])){
		return false;
	}
	var _firidx = Form.Radio("RAD_Choose");
	var _path = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel."+ G_IPTunnel[_firidx][7] +".6in4Tunnel." + Idx + '.';
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
	//新增与编辑	
	if(action == "0"){
		$H({
			"add-obj" 		: "InternetGatewayDevice.X_TWSZ-COM_IPTunnel.",
			':TunnelName' 		: $('INPUT_TunnelName').value,
			':Mode' 		: Form.Select("SEL_Mode"),
			':AssociatedWanIfName' 	: Form.Select("SEL_WAN"),
			':AssociatedLanIfName' 	: Form.Select("SEL_LAN"),
			"obj-action" 		: "add-set",
			"getpage" 		: "html/index.html",
			"errorpage" 		: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" 	: G_Page,
			"var:CacheLastData" 	: ViewState.Save()
		}, true);		
	}else if(action == "1"){
		var _path = ":InternetGatewayDevice.X_TWSZ-COM_IPTunnel."+G_IPTunnel[editidx][7]+".";
		$H({
			"obj-action" 		: "set",
			"getpage" 		: "html/index.html",
			"errorpage" 		: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" 	: G_Page,
			"var:CacheLastData" 	: ViewState.Save()
		}, true);
		$F(_path + "TunnelName", 		$('INPUT_TunnelName').value);
		$F(_path + "Mode", 			Form.Select("SEL_Mode"));
		$F(_path + "AssociatedWanIfName", 	Form.Select("SEL_WAN"));
		$F(_path + "AssociatedLanIfName", 	Form.Select("SEL_LAN"));
	}	
	
	$('uiPostForm').submit();
}

function ui4in6Submit(){
	var _firidx = Form.Radio("RAD_Choose");
	var _path;
	$H({	   	
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
	if(action == "0"){
		_path = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel."+ G_IPTunnel[_firidx][7] +".4in6Tunnel.";
		$F("obj-action", 	"add-set");
		$F("add-obj", 		_path);
		$F(':Mechanism', 	Form.Select("SEL_4in6DualStackLite"));
		$F(':Dynamic', 		Form.Select("SEL_4in6Dynamic"));
		$F(':RemoteIpv6Address', $('INPUT_4in6IPv6Address').value);
	}else if(action == "1"){
		_path = ":InternetGatewayDevice.X_TWSZ-COM_IPTunnel."+ G_IPTunnel[_firidx][7] +".4in6Tunnel."+G_4in6Tunnel[editidx][6];
		$F("obj-action", 		"set");
		$F(_path+'.Mechanism', 		Form.Select("SEL_4in6DualStackLite"));
		$F(_path+'.Dynamic', 		Form.Select("SEL_4in6Dynamic"));
		$F(_path+'.RemoteIpv6Address', 	$('INPUT_4in6IPv6Address').value);
	}
	//return false;
	$('uiPostForm').submit();
}

function ui6in4Submit(){
	var _firidx = Form.Radio("RAD_Choose");	
	var _path;
	$H({
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
	if(action == "0"){
		_path = "InternetGatewayDevice.X_TWSZ-COM_IPTunnel."+ G_IPTunnel[_firidx][7] +".6in4Tunnel.";
		$F('obj-action', 		'add-set');
		$F("add-obj", 			_path);
		$F(':Mechanism', 		Form.Select("SEL_6in4Mechanism"));
		$F(':Dynamic', 			Form.Select("SEL_6in4Dynamic"));
		$F(':IPv4MaskLen', 		$('INPUT_6in4MaskLen').value);
		$F(':Prefix', 			$('INPUT_6in4Prefix').value);
		$F(':BorderRelayAddress', 	$('INPUT_6in4BDRAddress').value);
	}else if(action == "1"){
		_path = ":InternetGatewayDevice.X_TWSZ-COM_IPTunnel."+ G_IPTunnel[_firidx][7] +".6in4Tunnel."+G_6in4Tunnel[editidx][8];
		$F('obj-action', 		'set');
		$F(_path + '.Mechanism', 	Form.Select("SEL_6in4Mechanism"));
		$F(_path + '.Dynamic', 		Form.Select("SEL_6in4Dynamic"));
		$F(_path + '.IPv4MaskLen', 	$('INPUT_6in4MaskLen').value);
		$F(_path + '.Prefix', 		$('INPUT_6in4Prefix').value);
		$F(_path + '.BorderRelayAddress', $('INPUT_6in4BDRAddress').value);
	}
	//return false;
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