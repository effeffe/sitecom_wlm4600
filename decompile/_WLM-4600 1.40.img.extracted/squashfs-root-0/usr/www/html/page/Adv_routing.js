/*  ڴJavaScript  */
<?if neq `-` $var:staticRoutingIdx
`	var G_Enable          = '<?get :InternetGatewayDevice.Layer3Forwarding.Forwarding.<?echo $var:staticRoutingIdx?>.Enable?>';
	var G_DestIPAddress   = '<?get :InternetGatewayDevice.Layer3Forwarding.Forwarding.<?echo $var:staticRoutingIdx?>.DestIPAddress?>';
	var G_DestSubnetMask  = '<?get :InternetGatewayDevice.Layer3Forwarding.Forwarding.<?echo $var:staticRoutingIdx?>.DestSubnetMask?>';
	var G_GatewayIPAddress= '<?get :InternetGatewayDevice.Layer3Forwarding.Forwarding.<?echo $var:staticRoutingIdx?>.GatewayIPAddress?>';
	var G_ForwardingMetric= '<?get :InternetGatewayDevice.Layer3Forwarding.Forwarding.<?echo $var:staticRoutingIdx?>.ForwardingMetric?>';
`?>

<?if neq `-` $var:V6_StaticRoutingIdx
`	var G_Enable          = '<?get :InternetGatewayDevice.X_TWSZ-COM_IPv6Layer3Forwarding.IPv6Forwarding.<?echo $var:V6_StaticRoutingIdx?>.Enable?>';
	var G_DestIPAddress   = '<?get :InternetGatewayDevice.X_TWSZ-COM_IPv6Layer3Forwarding.IPv6Forwarding.<?echo $var:V6_StaticRoutingIdx?>.DestIPv6Address?>';
	var G_GatewayIPAddress= '<?get :InternetGatewayDevice.X_TWSZ-COM_IPv6Layer3Forwarding.IPv6Forwarding.<?echo $var:V6_StaticRoutingIdx?>.GatewayIPv6Address?>';
	var G_ForwardingMetric= '<?get :InternetGatewayDevice.X_TWSZ-COM_IPv6Layer3Forwarding.IPv6Forwarding.<?echo $var:V6_StaticRoutingIdx?>.ForwardingMetric?>';
`?>

var wanConnection = new Array();
var n = 0;

<?objget :InternetGatewayDevice.WANDevice. ""
	`
<?objget :InternetGatewayDevice.WANDevice.$10.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_ServiceList X_TWSZ-COM_ProtocolType"
		`	wanConnection[n] = new Array();
			wanConnection[n][0] = "$01";//name
			wanConnection[n][1] = "InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection.$00";//path
            		wanConnection[n][2] = "$02";
			wanConnection[n][3] = "$03"; //X_TWSZ-COM_ProtocolType
			++n;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_ServiceList X_TWSZ-COM_ProtocolType"
		`	wanConnection[n] = new Array();
			wanConnection[n][0] = "$01";//name
			wanConnection[n][1] = "InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANPPPConnection.$00";//path
            		wanConnection[n][2] = "$02";
			wanConnection[n][3] = "$03"; //X_TWSZ-COM_ProtocolType
			++n;
		`?>
	`?>
`?>
`?>

//获取桥连接名
var m = 0;
<?objget :InternetGatewayDevice.LANDevice. "X_TWSZ-COM_DeviceName"
`	wanConnection[n] = new Array();
	wanConnection[n][0] = "LAN Group" + (m+1);//name
	wanConnection[n][1] = "InternetGatewayDevice.LANDevice.$00";//path
	wanConnection[n][2] = "";
	wanConnection[n][3] = "1";
	++n;
	++m;
`?>

//获取静态路由信?
var staticRoutingList = new Array();
var n = 0;
<?objget :InternetGatewayDevice.Layer3Forwarding.Forwarding. "Enable Status DestIPAddress DestSubnetMask GatewayIPAddress Interface ForwardingMetric StaticRoute X_TWSZ-COM_ErrorInfo"
`	staticRoutingList[n] = new Array();
	staticRoutingList[n][0] = "$01"; //Enable
	staticRoutingList[n][1] = "$02"; //Status
	staticRoutingList[n][2] = "$03"; //DestIPAddress
	staticRoutingList[n][3] = "$04"; //DestSubnetMask
	staticRoutingList[n][4] = "$05"; //GatewayIPAddress
	staticRoutingList[n][5] = "$06"; //Interface
	staticRoutingList[n][6] = "$07"; //ForwardingMetric
	staticRoutingList[n][7] = "$08"; //StaticRoute
	staticRoutingList[n][8] = "$09"; //ErrorInfo
	staticRoutingList[n][9] = "InternetGatewayDevice.Layer3Forwarding.Forwarding.$00.";	//path
	n++;
`?>

//get route info
var G_RouteInfo = new Array();
var m = 0;

<?objget :InternetGatewayDevice.X_TWSZ-COM_RouteInfo. "DestIPAddress GatewayIPAddress DestSubnetMask  Flags Ref ForwardingMetric Interface"
`	G_RouteInfo[m] = new Array();
	G_RouteInfo[m][0] = "$01"; //DestIPAddress
	G_RouteInfo[m][1] = "$02"; //GatewayIPAddress
	G_RouteInfo[m][2] = "$03"; //DestSubnetMask
	G_RouteInfo[m][3] = "$04"; //Flags
	G_RouteInfo[m][4] = "$05"; //Ref
	G_RouteInfo[m][5] = "$06"; //ForwardingMetric
	G_RouteInfo[m][6] = "$07"; //Interface
	G_RouteInfo[m][7] = "$00"; //index
	m++;
`?>


//获取V6静态路由信?
var V6_StaticRoutingList = new Array();
var n = 0;
<?objget :InternetGatewayDevice.X_TWSZ-COM_IPv6Layer3Forwarding.IPv6Forwarding. "Enable Status DestIPv6Address DestPrefixLength GatewayIPv6Address Interface ForwardingMetric"
`	V6_StaticRoutingList[n] = new Array();
	V6_StaticRoutingList[n][0] = "$01"; //Enable
	V6_StaticRoutingList[n][1] = "$02"; //Status
	V6_StaticRoutingList[n][2] = "$03"; //DestIPv6Address
	V6_StaticRoutingList[n][3] = "$04"; //DestPrefixLength
	V6_StaticRoutingList[n][4] = "$05"; //GatewayIPv6Address
	V6_StaticRoutingList[n][5] = "$06"; //Interface
	V6_StaticRoutingList[n][6] = "$07"; //ForwardingMetric
	V6_StaticRoutingList[n][7] = "InternetGatewayDevice.X_TWSZ-COM_IPv6Layer3Forwarding.IPv6Forwarding.$00.";	//path
	n++;
`?>


var option = '-';
var edit_index = -1;

function doAddRoute()
{
	$('DIV_AddRoute').style.display = 'block';
	$('DIV_RouteList').style.display = 'none';
	$('V6_DIV_RouteList').style.display = 'none';
	
	var _text = [], _value = [];
	var  k = 0;
	option = "add";
	
	$('TE_DestIp').value = "";//destination ip
	$('TE_mask').value = "";//mask
	$('TE_gateway').value = "";//gw
	
	for (var i = 0; i < wanConnection.length; i++)
	{   
	    if(wanConnection[i][2]=="TR069" || wanConnection[i][0].indexOf('Bridge') > -1){
	        continue;
		}
        
		if (wanConnection[i][3] != 'IPv6')
		{
			_text[k]  = wanConnection[i][0];
			_value[k] = i;
			k++;
		}
	}
	
	$S('SEL_interface', _text, _value);
	$('TE_metric').value = "";//metric
}

function doEditEntry(Idx)
{
	var _text = [], _value = [];
	var  k = 0;
	
	option = 'edit';
	edit_index = Idx;
	$('DIV_AddRoute').style.display = 'block';
	$('DIV_RouteList').style.display = 'none';
	$('V6_DIV_RouteList').style.display = 'none';
	
	$('TE_DestIp').value = staticRoutingList[Idx][2];//destination ip
	$('TE_mask').value = staticRoutingList[Idx][3];//mask
	$('TE_gateway').value = staticRoutingList[Idx][4];//gw
	
	for (var i = 0; i < wanConnection.length; i++)
	{   
	    if(wanConnection[i][2]=="TR069" || wanConnection[i][0].indexOf('Bridge') > -1){
	        continue;
		}
        
		if (wanConnection[i][3] != 'IPv6')
		{
			_text[k]  = wanConnection[i][0];
			_value[k] = i;
			k++;
		}
	}
	
	$S('SEL_interface', _text, _value);
	
	for (var i = 0; i < wanConnection.length; i++)
	{
		if(staticRoutingList[Idx][5] == wanConnection[i][1])
			$('SEL_interface').value = i;//interface
	}
	
	$('TE_metric').value = staticRoutingList[Idx][6];//metric
}

function doRemoveEntry(Idx)
{
	if(!confirm(SEcode[1008]))
    {
        return false;
    }

	$H({
		'del-obj'    		:staticRoutingList[Idx][9],
		'obj-action' 		:'del',
		'getpage'    		:'html/index.html',
		'errorpage'  		:'html/index.html',
		'var:menu'   		:G_Menu,
		'var:page'   		:G_Page,
		'var:errorpage'		:G_Page,
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function uiSubmit()
{
	var _node = $('TE_DestIp','TE_mask','TE_gateway','SEL_interface','TE_metric');
	var _path = wanConnection[_node[3].value][1];
	var nodeAddress = _node[0].value.split('.');
	var nodeMask = _node[1].value.split('.');
	//alert(nodeAddress[0]);
    var nodeAddress0 = parseInt(nodeAddress[0]);
    var nodeAddress1 = parseInt(nodeAddress[1]);
	var nodeAddress2 = parseInt(nodeAddress[2]);
	var nodeAddress3 = parseInt(nodeAddress[3]);
	var nodeMask0 = parseInt(nodeMask[0]);
	var nodeMask1 = parseInt(nodeMask[1]);
	var nodeMask2 = parseInt(nodeMask[2]);
	var nodeMask3 = parseInt(nodeMask[3]);
	
	
	if((nodeAddress0&nodeMask0)!=nodeAddress0||(nodeAddress1&nodeMask1)!=nodeAddress1||(nodeAddress2&nodeMask2)!=nodeAddress2||(nodeAddress3&nodeMask3)!=nodeAddress3)
		{
		alert("Please enter the right destination address and the right subnet mask.");
		return false;
		}
	
	var i = (nodeMask0<<24)|(nodeMask1<<16)|(nodeMask2<<8)|(nodeMask3);
	
	
	var b;
	var c;
	var flag = 0;
	//alert('i:'+i);
	for(b=0;b<32;b++)
	{
		if(i&(0x1<<b))
		{
			flag = 1;
		}
		else
		{
			if (flag == 1)
			{
				alert("Please enter the right subnet mask.");
				return false;
			}
		}		
		
	}
	
	if(option == 'add')
	{
		$H({
			'add-obj'          : 'InternetGatewayDevice.Layer3Forwarding.Forwarding.',
			':Enable'          : 1,
			':DestIPAddress'   : _node[0].value != '' ? _node[0].value : "undefine",
			':DestSubnetMask'  : _node[1].value != '' ? _node[1].value : "undefine",
			':GatewayIPAddress': _node[2].value != '' ? _node[2].value : "undefine",
			':Interface'       : _path,
			':ForwardingMetric': _node[4].value != '' ? _node[4].value : "16",
			'obj-action'       : 'add-set'
		});
	} 
	else 
	{
		$F(':'+staticRoutingList[edit_index][9]+'Enable',1);
		$F(':'+staticRoutingList[edit_index][9]+'DestIPAddress',_node[0].value != '' ? _node[0].value : "undefine");
		$F(':'+staticRoutingList[edit_index][9]+'DestSubnetMask',_node[1].value != '' ? _node[1].value : "undefine");
		$F(':'+staticRoutingList[edit_index][9]+'GatewayIPAddress',_node[2].value != '' ? _node[2].value : "undefine");
		$F(':'+staticRoutingList[edit_index][9]+'Interface',_path);
		$F(':'+staticRoutingList[edit_index][9]+'ForwardingMetric',_node[4].value != '' ? _node[4].value : "16");
		$F('obj-action' ,'set');
	}
	
	$H({
		'var:ConnIdx'      : _node[3].value,
		'getpage'          :'html/index.html',
		'errorpage'        :'html/index.html',
		'var:menu'         :G_Menu,
		'var:page'         :G_Page,
		'var:errorpage'    :G_Page,
		'var:CacheLastData': ViewState.Save()
	});
	
	$('uiPostForm').submit();
}

function uiCancel()
{
	option = "-";
	edit_index = -1;
	
	$('TE_DestIp').value = "";//destination ip
	$('TE_mask').value = "";//mask
	$('TE_gateway').value = "";//gw
	$('SEL_interface').selectedIndex = 0;
	$('TE_metric').value = "";//metric
}

function uiBack()
{
	option = '-';
	edit_index = -1;
	$('DIV_AddRoute').style.display = 'none';
	$('DIV_RouteList').style.display = 'block';
	$('V6_DIV_RouteList').style.display = 'block';
}

//由于RouteList显示的路由条目重复，需加入RouteInfo中已有staticRoutingList的过滤
function createTable()
{
	var array_value = [];
	var len=0;
	Table.Clear('TA_RouteList');
	
	for(var i = 0; i < staticRoutingList.length; i++){
	  array_value[len] = [];
		array_value[len].push(len+1);
		array_value[len].push(staticRoutingList[i][2]); //DestIPAddress
		array_value[len].push(staticRoutingList[i][3]); //DestSubnetMask
		array_value[len].push(staticRoutingList[i][4]); //GatewayIPAddress
		array_value[len].push(staticRoutingList[i][6]); //metric
		
		for (var x = 0; x < wanConnection.length; x++){
			 if(staticRoutingList[i][5] == wanConnection[x][1])
				array_value[i].push(wanConnection[x][0]); //interface
		}
		
		array_value[len].push(staticRoutingList[i][1]); //use
		array_value[len].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" align="center" onclick="doEditEntry('+ i +')"/>'); //Edit
		array_value[len].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" align="center" onclick="doRemoveEntry('+ i +')"/>'); //Drop
		len++;
	}
	
	for(var m = 0; m<G_RouteInfo.length; m++){
		var findMark = false;
		
		for (var n = 0; n<staticRoutingList.length; n++)
		{
		  if ( (G_RouteInfo[m][0] ==staticRoutingList[n][2]) &&
					 (G_RouteInfo[m][2] ==staticRoutingList[n][3]) &&
					 (G_RouteInfo[m][1] ==staticRoutingList[n][4]) )
			{
					findMark = true;
					break;
			}
		}
		  
	  if (findMark){
		  	continue;
	  }
	  else
    {
      array_value[len] = [];
		  array_value[len].push(len+1);
		  array_value[len].push(G_RouteInfo[m][0]); //DestIPAddress
		  array_value[len].push(G_RouteInfo[m][2]); //DestSubnetMask
		  array_value[len].push(G_RouteInfo[m][1]); //GatewayIPAddress
		  array_value[len].push(G_RouteInfo[m][5]); //metric
		  array_value[len].push(G_RouteInfo[m][6]); //interface
		  array_value[len].push(G_RouteInfo[m][4]); //Ref
		  array_value[len].push("&nbsp;"); //
		  array_value[len].push("&nbsp;"); //
		  len++;  
		}
	}
	$T('TA_RouteList',array_value);
}


function V6_doAddRoute()
{
	$('V6_DIV_AddRoute').style.display = 'block';
	$('DIV_RouteList').style.display = 'none';
	$('V6_DIV_RouteList').style.display = 'none';
	
	var _text = [], _value = [];
	var  k = 0;
	option = "v6_add";
	
	$('V6_TE_DestIp').value = "";//destination ip
	$('V6_TE_Prefix').value = "128";//
	$('V6_TE_gateway').value = "";//gw
	
	for (var i = 0; i < wanConnection.length; i++)
	{   
	    if(wanConnection[i][2]=="TR069" || wanConnection[i][0].indexOf('Bridge') > -1){
	        continue;
		}
        
		if (wanConnection[i][3] != 'IPv4')
		{
			_text[k]  = wanConnection[i][0];
			_value[k] = i;
			k++;
		}
	}
	
	$S('V6_SEL_interface', _text, _value);
	V6_interfaceChanged();
}

function V6_doEditEntry(Idx)
{
	var _text = [], _value = [];
	var  k = 0;
	
	option = 'v6_edit';
	edit_index = Idx;
	$('V6_DIV_AddRoute').style.display = 'block';
	$('DIV_RouteList').style.display = 'none';
	$('V6_DIV_RouteList').style.display = 'none';
	
	Form.Checkbox('V6_staticRoutingEnable', V6_StaticRoutingList[Idx][0]); //Enable
	$('V6_TE_DestIp').value = V6_StaticRoutingList[Idx][2];//destination ip
	$('V6_TE_Prefix').value = V6_StaticRoutingList[Idx][3];//destination ip
	$('V6_TE_gateway').value = V6_StaticRoutingList[Idx][4];//gw
	
	for (var i = 0; i < wanConnection.length; i++)
	{   
	    if(wanConnection[i][2]=="TR069" || wanConnection[i][0].indexOf('Bridge') > -1){
	        continue;
		}
        
		if (wanConnection[i][3] != 'IPv4')
		{
			_text[k]  = wanConnection[i][0];
			_value[k] = i;
			k++;
		}
	}
	
	$S('V6_SEL_interface', _text, _value);
	
	for (var i = 0; i < wanConnection.length; i++)
	{
		if(V6_StaticRoutingList[Idx][5] == wanConnection[i][1])
			$('V6_SEL_interface').value = i;//interface
	}
	V6_interfaceChanged();
}

function V6_doRemoveEntry(Idx)
{
	if(!confirm(SEcode[1008]))
    {
        return false;
    }

	$H({
		'del-obj'    		:V6_StaticRoutingList[Idx][7],
		'obj-action' 		:'del',
		'getpage'    		:'html/index.html',
		'errorpage'  		:'html/index.html',
		'var:menu'   		:G_Menu,
		'var:page'   		:G_Page,
		'var:errorpage'		:G_Page,
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function V6_uiCancel()
{
	option = "-";
	edit_index = -1;
	
	$('V6_staticRoutingEnable').value = false;//
	$('V6_TE_DestIp').value = "";//destination ip
	$('V6_TE_Prefix').value = "128";//
	$('V6_TE_gateway').value = "";//gw
	$('V6_SEL_interface').selectedIndex = 0;
}

function V6_uiBack()
{
	option = '-';
	edit_index = -1;
	$('V6_DIV_AddRoute').style.display = 'none';
	$('DIV_RouteList').style.display = 'block';
	$('V6_DIV_RouteList').style.display = 'block';
}

function V6_interfaceChanged()
{
	var V6_SEL_interfaceID = $('V6_SEL_interface').value;
	if(V6_SEL_interfaceID.length == 0)
	{
		return;	
	}
	var V6_interfacePath =wanConnection[V6_SEL_interfaceID][1] ;
	if(V6_interfacePath.indexOf('WANPPPConnection')>-1) 		
	{
		$('V6_TR_Gateway').style.display = 'none';
		$('V6_TE_gateway').value = "";		
	}
	else
	{
		$('V6_TR_Gateway').style.display = 'block';
	}
}

function createV6Table()
{
	var array_value = [];
	var len=0;
	Table.Clear('V6_TA_RouteList');
	
	for(var i = 0; i < V6_StaticRoutingList.length; i++){
	  array_value[len] = [];
		array_value[len].push(len+1);
		array_value[len].push(V6_StaticRoutingList[i][2]); //DestIPAddress
		array_value[len].push(V6_StaticRoutingList[i][3]); //prefix length
		array_value[len].push(V6_StaticRoutingList[i][4]==''?'&nbsp':V6_StaticRoutingList[i][4]); //GatewayIPAddress
		
		for (var x = 0; x < wanConnection.length; x++){
			 if(V6_StaticRoutingList[i][5] == wanConnection[x][1])
				array_value[len].push(wanConnection[x][0]); //interface
		}
		
		array_value[len].push(V6_StaticRoutingList[i][1]); //use
		array_value[len].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" align="center" onclick="V6_doEditEntry('+ i +')"/>'); //Edit
		array_value[len].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" align="center" onclick="V6_doRemoveEntry('+ i +')"/>'); //Drop
		len++;
	}

	$T('V6_TA_RouteList',array_value);
}


function V6_uiSubmit()
{
	var _node = $('V6_TE_DestIp','V6_TE_gateway','V6_SEL_interface','V6_TE_Prefix');
	var _path = wanConnection[_node[2].value][1];

	if(option == 'v6_add')
	{
		$H({
			'add-obj'          : 'InternetGatewayDevice.X_TWSZ-COM_IPv6Layer3Forwarding.IPv6Forwarding.',
			':Enable'          : Form.Checkbox('V6_staticRoutingEnable'),
			':DestIPv6Address'   : _node[0].value != '' ? _node[0].value : "undefine",
			':DestPrefixLength'  : _node[3].value != '' ? _node[3].value : "128",
			':GatewayIPv6Address': _node[1].value != '' ? _node[1].value : "",
			':Interface'       : _path,
			':ForwardingMetric': 256,
			'obj-action'       : 'add-set'
		});
	} 
	else if(option == 'v6_edit')
	{
		$F(':'+V6_StaticRoutingList[edit_index][7]+'Enable',Form.Checkbox('V6_staticRoutingEnable'));
		$F(':'+V6_StaticRoutingList[edit_index][7]+'DestIPv6Address',_node[0].value != '' ? _node[0].value : "undefine");
		$F(':'+V6_StaticRoutingList[edit_index][7]+'DestPrefixLength',_node[3].value != '' ? _node[3].value : "128");
		$F(':'+V6_StaticRoutingList[edit_index][7]+'GatewayIPv6Address',_node[1].value != '' ? _node[1].value : "");
		$F(':'+V6_StaticRoutingList[edit_index][7]+'Interface',_path);
		$F(':'+V6_StaticRoutingList[edit_index][7] + 'ForwardingMetric', 256);
		$F('obj-action' ,'set');
	}
	
	$H({
		'var:ConnIdx'      : _node[2].value,
		'getpage'          :'html/index.html',
		'errorpage'        :'html/index.html',
		'var:menu'         :G_Menu,
		'var:page'         :G_Page,
		'var:errorpage'    :G_Page,
		'var:CacheLastData': ViewState.Save()
	});
	
	$('uiPostForm').submit();
}




function uiOnload()
{
	createTable();
	createV6Table();
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);
