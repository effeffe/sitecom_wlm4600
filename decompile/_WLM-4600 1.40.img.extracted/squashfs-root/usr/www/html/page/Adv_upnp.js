/*  在此添加JavaScript  */
<?mget :InternetGatewayDevice.X_TWSZ-COM_UPNP. "Enable WANPathName LANPathName"
`	var G_UpnpEnable  = "$01"; // Enable
	var G_WANPathName = "$02"; // WANPathName
	var G_LANPathName = "$03"; // LANPathName
`?>

var G_IPList = [];
var m = 0;
<?objget InternetGatewayDevice.X_TWSZ-COM_UPNP.Blacklist. "SrcIP Enable"
`	G_IPList[m] = [];
	G_IPList[m][0] = "InternetGatewayDevice.X_TWSZ-COM_UPNP.Blacklist.$00.";
	G_IPList[m][1] = "$01";
	G_IPList[m][2] = "$02";
	m++;
`?>

var G_Wanconns = [];
var n = 0;
//WAN Device

<?objget :InternetGatewayDevice.WANDevice. ""
`
<?objget :InternetGatewayDevice.WANDevice.$10.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_ServiceList ConnectionStatus  X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.ConnectionStatus"
		`	G_Wanconns[n] = [];
			G_Wanconns[n][0] = "$01";
			G_Wanconns[n][1] = "InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection.$00"
      G_Wanconns[n][2] = "$02";
      G_Wanconns[n][3] = "$03";//ConnectionStatus
      G_Wanconns[n][4] = "$04";//X_TWSZ-COM_ProtocolType
      G_Wanconns[n][5] = "$05";//X_TWSZ-COM_IPv6Config.ConnectionStatus
			n++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_ServiceList ConnectionStatus  X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.ConnectionStatus"
		`	G_Wanconns[n] = [];
			G_Wanconns[n][0] = "$01";
			G_Wanconns[n][1] = "InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANPPPConnection.$00"
      G_Wanconns[n][2] = "$02";
      G_Wanconns[n][3] = "$03";//ConnectionStatus
      G_Wanconns[n][4] = "$04";//X_TWSZ-COM_ProtocolType
      G_Wanconns[n][5] = "$05";//X_TWSZ-COM_IPv6Config.ConnectionStatus
			n++;
		`?>
	`?>
`?>
`?>
//LAN Device
<?objget :InternetGatewayDevice.LANDevice. "X_TWSZ-COM_DeviceName"
`	G_Wanconns[n] = [];
	G_Wanconns[n][0] = "$01";
	G_Wanconns[n][1] = "InternetGatewayDevice.LANDevice.$00";
	n++;
`?>

function uiOnload(){
	
	Form.Radio('RAD_upnp',G_UpnpEnable);
	wanAndLanPath();
	$('SEL_WanInterface').value = G_WANPathName;
	$('SEL_LanInterface').value = G_LANPathName;
	doUpnpActive();
}
function wanConnStatus(xValue){
  var Protocol = G_Wanconns[xValue][4] ;
  switch(Protocol){
      case "IPv4" :
          if ( G_Wanconns[xValue][3] == "Connected"){
          	 return "Connected";
          }
          break;
      case "IPv6" :
          if ( G_Wanconns[xValue][5] == "GlobalConnected"){
             return "Connected";
          }
          break;
      case "IPv4_6" : 
          if ( G_Wanconns[xValue][3] == "Connected"|| G_Wanconns[xValue][5] == "GlobalConnected"){
             return "Connected";
          }
          break;
      default :
          return "Disconnected";
  }	  
}
function wanAndLanPath(){ 
	var text_wan = [],value_wan = [];
	var text_lan = [],value_lan = [];
	
	for(var i = 0; i < G_Wanconns.length; i++){
		if(G_Wanconns[i][1].indexOf('WANDevice') > 0){
		    if(G_Wanconns[i][2]=="TR069" || G_Wanconns[i][0].indexOf('Bridge') > -1){
		    	continue;
			  }
		    if (wanConnStatus(i) != "Connected"){
		    	continue;
	      }
			  text_wan.push(G_Wanconns[i][0]);
			  value_wan.push(G_Wanconns[i][1]);		  
		}else if (G_Wanconns[i][1].indexOf('LANDevice') > 0){		
			text_lan.push(G_Wanconns[i][0]);
			value_lan.push(G_Wanconns[i][1]);
		}
	}
	$S('SEL_WanInterface',text_wan,value_wan);
	$S('SEL_LanInterface',text_lan,value_lan);
}

function uiSubmit(){
	var _node = $('SEL_WanInterface','SEL_LanInterface');
	
	$H({
		':InternetGatewayDevice.X_TWSZ-COM_UPNP.Enable'      : Form.Radio('RAD_upnp'),
		':InternetGatewayDevice.X_TWSZ-COM_UPNP.WANPathName' : _node[0].value == '' ? 'unknown' : _node[0].value,
		':InternetGatewayDevice.X_TWSZ-COM_UPNP.LANPathName' : _node[1].value == '' ? 'unknown' : _node[1].value,
		'var:menu'     : G_Menu,
		'var:page'     : 'Adv_upnp',
		'var:subpage'  : 'Adv_upnp',
		'var:errorpage': 'Adv_upnp',
		'obj-action':'set',
		'getpage'   :'html/index.html',
		'errorpage' :'html/index.html',
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function doUpnpActive()
{
	if(Form.Radio('RAD_upnp') == '0')
	{
		$('SEL_WanInterface').disabled = true;
		$('SEL_LanInterface').disabled = true;
	}
	else
	{
		$('SEL_WanInterface').disabled = false;
		$('SEL_LanInterface').disabled = false;
	}
}

function dealWithError(){
	if(G_Error != 1){
		return false;
	}
	
	var arrayHint = [];	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);

