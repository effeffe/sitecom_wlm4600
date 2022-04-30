/* JavaScript Document */
var G_WAN = [], G_WANConn = [];
var G_SelWan = 0; //保存当前选定路由的条件,用在切换路由时的状态恢复
var n = 0, m = 0;
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

<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Enable Name ConnectionStatus ConnectionType AddressingType X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.ConnectionStatus X_TWSZ-COM_ServiceList"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00.";	//Path
			G_WANConn[m][1] = "$01";	//Enable
			G_WANConn[m][2] = "$02";	//Name
			G_WANConn[m][3] = "$03";	//ConnectionStatus
			G_WANConn[m][4] = "$04";	//ConnectionType
			G_WANConn[m][5] = "$05";	//AddressingType
			G_WANConn[m][6] = "$06";	//X_TWSZ-COM_ProtocolType
			G_WANConn[m][7] = "$07";	//X_TWSZ-COM_IPv6Config.ConnectionStatus
			G_WANConn[m][8] = "$08";	//X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Enable Name ConnectionStatus ConnectionType ConnectionTrigger X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.ConnectionStatus X_TWSZ-COM_ServiceList"
		`	G_WANConn[m] = [];
			G_WANConn[m][0] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00.";	//Path
			G_WANConn[m][1] = "$01";	//Enable
			G_WANConn[m][2] = "$02";	//Name
			G_WANConn[m][3] = "$03";	//ConnectionStatus
			G_WANConn[m][4] = "$04";	//ConnectionType
			G_WANConn[m][4] = "$05";	//ConnectionTrigger
			G_WANConn[m][6] = "$06";	//X_TWSZ-COM_ProtocolType
			G_WANConn[m][7] = "$07";	//X_TWSZ-COM_IPv6Config.ConnectionStatus
			G_WANConn[m][8] = "$08";	//X_TWSZ-COM_ServiceList
			m++;
		`?>
	`?>
`?>

//默认网关
var G_DefaultRouter = "<?get :InternetGatewayDevice.Layer3Forwarding.DefaultConnectionService?>";
var G_GWMode = "<?get :InternetGatewayDevice.X_TWSZ-COM_DEFAULT_GW.Active?>"

//加载初始值
function uiOnload(){
    Form.Radio("AutoGW_Switch", G_GWMode);
	var arr_value = [];
	for(var i=0, len=G_WANConn.length; i<len; i++){
		arr_value[i] = [];
		arr_value[i].push(G_WAN[i][4]); //VPI/VCI
		arr_value[i].push(G_WAN[i][1]); //VLAN ID
		arr_value[i].push(findProtocol(i)); //Protocol
		arr_value[i].push(G_WAN[i][5]); //ENCAP
		arr_value[i].push(findStatus(i)); //Status
		arr_value[i].push('<input type="radio" name="RAD_dfRoute" id="RAD_dfRoute'+ i +'" onClick="doDfRoute('+ i +')" ' + ( ( (G_GWMode == 'UserInIf') && (G_WANConn[i][6] != 'IPv6')) ? '' : 'disabled') +  '>');
		arr_value[i].push(findPPPManual(i)); //Action
		arr_value[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="EditEntry('+ i +')"/>');
		arr_value[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="RemoveEntry('+ i +')"/>');
	}
	$T('ta_wanlists',arr_value);
	//默认路由初始值
	var _dfroute;
	for(var i=0, len=G_WANConn.length; i<len; i++){
		_dfroute = G_WANConn[i][0].replace(/\.$/,"");
		if(G_DefaultRouter == _dfroute){
			$('RAD_dfRoute'+i).checked = true;
            G_SelWan = i;
		}else{
			$('RAD_dfRoute'+i).checked = false;
		}
		if(G_WANConn[i][4] == "IP_Bridged")
		{
			$('RAD_dfRoute'+i).disabled = true;
		}
		if(G_WANConn[i][8] == "TR069")
		{
			$('RAD_dfRoute'+i).disabled = true;
		}
	}
}

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

//连接状态
function findStatus(xValue){
	var Protocol = G_WANConn[xValue][6];
	var ConnStatus_v4 ;
	var ConnStatus_v6 ;
	var ConnStatus_v4_6 ;
	
	if(G_WANConn[xValue][3] == "Connected") {
		ConnStatus_v4 = SEcode[8004];
	}
	else{
		ConnStatus_v4 = SEcode[8005];
  }
  
  if (G_WANConn[xValue][7] == "GlobalConnected"){
  	ConnStatus_v6 = SEcode[8011] ;
  }else if (G_WANConn[xValue][7] == "LinkLocalConnected"){
  	ConnStatus_v6 = SEcode[8010] ;
  }else{
  	ConnStatus_v6 = SEcode[8005];
  }
  
	switch(Protocol){
		case "IPv4" :
			return ConnStatus_v4;
			break;
		case "IPv6" :
		  return ConnStatus_v6;
			break;
		case "IPv4_6" : 
			ConnStatus_v4_6 = ConnStatus_v4 +"/"+ConnStatus_v6 ;
			return ConnStatus_v4_6;
			break;
		default :
			return SEcode[8005];
	}
}

//默认路由
function doDfRoute(xValue){
	if(!confirm(SEcode[1008])){
        $('RAD_dfRoute'+G_SelWan).checked = true;
		return false;
	}
    G_SelWan = xValue; // 保存新的路由条目
	var _dfRoute = G_WANConn[xValue][0].replace(/\.$/,"");
	if(_dfRoute == G_DefaultRouter){
		_dfRoute = '';
	}
	
	$H({
		':InternetGatewayDevice.Layer3Forwarding.DefaultConnectionService' : _dfRoute,
		'obj-action'    : 'set',
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	},true);
	$('uiPostForm').submit();
}

//Action: PPP手动连接
function findPPPManual(xValue){
	var Connect = '<img src="/html/skin/dial.gif" style="cursor:pointer;" title="Connect" value="'+xValue+'" onClick="ctrlConnect('+xValue+''+",1"+')"/>',
	    Disconnect = '<img src="/html/skin/fault.gif" style="cursor:pointer;" title="Disconnect" value="'+xValue+'" onClick="ctrlConnect('+xValue+''+",0"+')"/>';
	var ConnType = G_WANConn[xValue][0].indexOf('WANIPConnection') > -1 ? "IP" : "PPP";
	
	if(ConnType == "PPP" && G_WANConn[xValue][4] == "Manual"){
		if(findStatus(xValue).indexOf("Connected") > -1 )
			return Disconnect;
		else
			return Connect;
		
	}else{
		return "N/A";
	}
}

function uiSubmit(){
    $H({
		':InternetGatewayDevice.X_TWSZ-COM_DEFAULT_GW.Active' : Form.Radio("AutoGW_Switch"),
		'obj-action'    : 'set',
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	},true);
	$('uiPostForm').submit();
}

//PPP手动连接控制函数
function ctrlConnect(xValue, xFlag){
	var _Path = G_WANConn[xValue][0];
	$H({
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'obj-action'    : 'set'
	},true);
	$F(':' + _Path + 'ConnectionTrigger', 'Manual');
	$F(':' + _Path + 'X_TWSZ-COM_ConnectionAction', xFlag == '1' ? "Connect" : "Disconnect");
	
	$('uiPostForm').submit();	
}

//删除
function RemoveEntry(xValue){
	if(!confirm(SEcode[1001])){
		return false;
	}
	//alert(G_WANConn[xValue][0]);
	$H({
		'mid'           : '0430',
		'del-obj'       : G_WANConn[xValue][0],
		'obj-action'    : 'del',
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	},true);
	$('uiPostForm').submit();
}

//编辑
function EditEntry(xValue){
	var Path = G_WANConn[xValue][0];
	$H({
		'var:conn_type' : Path.indexOf('PPP') > -1 ? 'PPP' : 'IP', //IP/PPP
		'var:secIdx'    : Path.split('.')[4],
		'var:thdIdx'    : Path.split('.')[6],
		'var:action' 	: "1",
		'var:menu'      : G_Menu,
		'var:page' 	    : G_Page,
		'var:subpage' 	: "Bas_wan",
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	});
	
	$('uiPostForm').submit();
}
//添加
function uiAdd(){	
    if (G_WANConn.length == 0 ){
        var newIndex = 0;
    }else{
        var newIndex = G_WANConn[G_WANConn.length - 1][0].split('.')[4]; //get the last wanconnection index
    }
    newIndex = Number(newIndex); // convert to number
	$H({
	   	"obj-action" 		: "set",
		"getpage" 		    : "html/index.html",
		"errorpage" 		: "html/index.html",
        'var:secIdx'        : newIndex + 1 ,   // last index + 1
		"var:action" 		: "0",
		"var:menu" 		    : G_Menu,
		"var:page" 		    : G_Page,
		'var:subpage' 		: "Bas_wan",
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" : ViewState.Save()
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
//监听加载与错误处理函数
addListeners(uiOnload, dealWithError);