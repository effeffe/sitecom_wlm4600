//ipv6 filter
var G_IPFilterEnable = "<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.IPFilterEnable?>"; // filter enable
var G_SecurityLevel  = "<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.SecurityLevel?>";  // security level
var G_LanFilterTable = "<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.CurrentLANFilterTable?>";
var G_WanFilterTable = "<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.CurrentWANFilterTable?>";

var m = 0;
var G_Wan_Black = [];
<? if gt `<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.WanBlackFilterNumberOfEntries?>` 0
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.WanBlackFilter. "Enable SrcIP SrcPrefixLen SrcPort DestIP DstPrefixLen DestPort Protocol Description DevPath"
	`	G_Wan_Black[m] = [];
		G_Wan_Black[m][0] = "$01"; //Enable
		G_Wan_Black[m][1] = "$02"; //SrcIP
		G_Wan_Black[m][2] = "$03"; //SrcPrefixLen
		G_Wan_Black[m][3] = "$04"; //SrcPort
		G_Wan_Black[m][4] = "$05"; //DestIP
		G_Wan_Black[m][5] = "$06"; //DstPrefixLen
		G_Wan_Black[m][6] = "$07"; //DestPort
		G_Wan_Black[m][7] = "$08"; //Protocol
		G_Wan_Black[m][8] = "$09"; //Description
		G_Wan_Black[m][9] = "$0a"; //DevPath
		G_Wan_Black[m][10] = "InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.WanBlackFilter.$00.";
		m++;
	`?>
`?>

var y = 0;
var G_Wan_White = [];
<? if gt `<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.WanWhiteFilterNumberOfEntries?>` 0
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.WanWhiteFilter. "Enable SrcIP SrcPrefixLen SrcPort DestIP DstPrefixLen DestPort Protocol Description DevPath"
	`	G_Wan_White[y] = [];
		G_Wan_White[y][0] = "$01"; //Enable
		G_Wan_White[y][1] = "$02"; //SrcIP
		G_Wan_White[y][2] = "$03"; //SrcPrefixLen
		G_Wan_White[y][3] = "$04"; //SrcPort
		G_Wan_White[y][4] = "$05"; //DestIP
		G_Wan_White[y][5] = "$06"; //DstPrefixLen
		G_Wan_White[y][6] = "$07"; //DestPort
		G_Wan_White[y][7] = "$08"; //Protocol
		G_Wan_White[y][8] = "$09"; //Description
		G_Wan_White[y][9] = "$0a"; //DevPath
		G_Wan_White[y][10] = "InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.WanWhiteFilter.$00.";
		y++;
	`?>
`?>

var n = 0;
var G_Lan_Black = [];
<? if gt `<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.LanBlackFilterNumberOfEntries?>` 0
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.LanBlackFilter. "Enable SrcIP SrcPrefixLen SrcPort DestIP DstPrefixLen DestPort Protocol Description DevPath"
	`	G_Lan_Black[n] = [];
		G_Lan_Black[n][0] = "$01"; //Enable
		G_Lan_Black[n][1] = "$02"; //SrcIP
		G_Lan_Black[n][2] = "$03"; //SrcPrefixLen
		G_Lan_Black[n][3] = "$04"; //SrcPort
		G_Lan_Black[n][4] = "$05"; //DestIP
		G_Lan_Black[n][5] = "$06"; //DstPrefixLen
		G_Lan_Black[n][6] = "$07"; //DestPort
		G_Lan_Black[n][7] = "$08"; //Protocol
		G_Lan_Black[n][8] = "$09"; //Description
		G_Lan_Black[n][9] = "$0a"; //DevPath
		G_Lan_Black[n][10] = "InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.LanBlackFilter.$00.";
		n++;
	`?>
`?>

var w = 0;
var G_Lan_White = [];
<? if gt `<?get :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.LanWhiteFilterNumberOfEntries?>` 0
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.LanWhiteFilter. "Enable SrcIP SrcPrefixLen SrcPort DestIP DstPrefixLen DestPort Protocol Description DevPath"
	`	G_Lan_White[w] = [];
		G_Lan_White[w][0] = "$01"; //Enable
		G_Lan_White[w][1] = "$02"; //SrcIP
		G_Lan_White[w][2] = "$03"; //SrcPrefixLen
		G_Lan_White[w][3] = "$04"; //SrcPort
		G_Lan_White[w][4] = "$05"; //DestIP
		G_Lan_White[w][5] = "$06"; //DstPrefixLen
		G_Lan_White[w][6] = "$07"; //DestPort
		G_Lan_White[w][7] = "$08"; //Protocol
		G_Lan_White[w][8] = "$09"; //Description
		G_Lan_White[w][9] = "$0a"; //DevPath
		G_Lan_White[w][10] = "InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.LanWhiteFilter.$00.";
		w++;
	`?>
`?>
// WanDevice
var G_wanConnction = [];
var s = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name"
		`	G_wanConnction[s] = [];
			G_wanConnction[s][0] = "$01"; // name;
			G_wanConnction[s][1] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00"; // about Path
			++s;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name"
		`	G_wanConnction[s] = [];
			G_wanConnction[s][0] = "$01"; // wan's name;
			G_wanConnction[s][1] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00"; // about Path;
			++s;
		`?>
	`?>
`?>
// LanDevice
var t = 0;
<?objget :InternetGatewayDevice.LANDevice. "X_TWSZ-COM_DeviceName"
`	G_wanConnction[s] = [];
	G_wanConnction[s][0] = "Lan" + (t+1) ; // lan's name
	G_wanConnction[s][1] = "InternetGatewayDevice.LANDevice.$00";
	++s;
	++t;
`?>
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "SSID"
`	G_wanConnction[s] = [];
	G_wanConnction[s][0] = "$01"; // lan's name
	G_wanConnction[s][1] = "InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00";
	++s;
`?>

function uiOnload(sLevel){
	//IP Fliter
	Form.Checkbox('CHE_ipfilter',G_IPFilterEnable);
	//ȫ
	G_SecurityLevel = sLevel || G_SecurityLevel; 
	$('SEL_SecurLevel').value = G_SecurityLevel;
  //  Form.Checkbox( 'INPUT_SPI', G_SPI);
	//ڰ׵Ľڵ
	var radio_node = $('RAD_wanTolan_white','RAD_wanTolan_black','RAD_lanTowan_white','RAD_lanTowan_black');
	var lang_node  = $('6FIL009','6FIL010','6FIL012','6FIL013');
	//ʼRadio״̬
	for(var i = 0; i < 4; i++){
		radio_node[i].disabled = false;
		lang_node[i].style.color = "#000000";
	}
	
	//ָڰֵ
	if(G_SecurityLevel == '0'){ //ûԶ
		Form.Radio('RAD_wanTolan',Number(G_WanFilterTable) - 3);
		Form.Radio('RAD_wanTolan',Number(G_LanFilterTable));
	} else { // ϵͳָ
		switch(G_SecurityLevel){
			case '3' : {
				G_WanFilterTable = 1;
				G_LanFilterTable = 1;
				radio_node[1].disabled = true;
				radio_node[3].disabled = true;
				lang_node[1].style.color = "#aaaaaa";
				lang_node[3].style.color = "#aaaaaa";
				break;
			}
			case '2' : {
				G_WanFilterTable = 1;
				G_LanFilterTable = 2;
				radio_node[1].disabled = true;
				radio_node[2].disabled = true;
				lang_node[1].style.color = "#aaaaaa";
				lang_node[2].style.color = "#aaaaaa";
				break;
			}
			case '1' : {
				G_WanFilterTable = 2;
				G_LanFilterTable = 2;
				radio_node[0].disabled = true;
				radio_node[2].disabled = true;
				lang_node[0].style.color = "#aaaaaa";
				lang_node[2].style.color = "#aaaaaa";
				break;
			}
		}
		
		Form.Radio('RAD_wanTolan',G_WanFilterTable);
		Form.Radio('RAD_lanTowan',G_LanFilterTable);
	}
	//̬IP Filterб
	createTable();
}

function createTable(){
	//ʼtable,
	Table.Clear('TA_ipfilter_List');
	
	//ȡûҪ
	var G_FilterLists = $('SEL_direct').value == '1' ? (Form.Radio('RAD_wanTolan') == '1' ? G_Wan_White : G_Wan_Black) : (Form.Radio('RAD_lanTowan') == '1' ? G_Lan_White : G_Lan_Black);
	
	//ָFILTER
	var array_value = [];
	for(var i = 0; i < G_FilterLists.length; i++){
		array_value[i] = [];
		array_value[i].push(i+1);//
		array_value[i].push(G_FilterLists[i][0]); //Enable
		array_value[i].push(G_FilterLists[i][1] + '/' + G_FilterLists[i][3]); //Source IP and Port
		array_value[i].push(G_FilterLists[i][4] + '/' + G_FilterLists[i][6]); //Dest IP and Port
		array_value[i].push(G_FilterLists[i][7]); //protocol
		array_value[i].push(G_FilterLists[i][8] == '' ? '-' : G_FilterLists[i][8]); //description
		array_value[i].push(searchDevPath(G_FilterLists[i][9])); //DevPath
		array_value[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="doEditEntry('+ i +')"/>'); //Edit
		array_value[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="doRemoveEntry('+ i +')"/>'); //Delete
	}
	$T('TA_ipfilter_List',array_value);
}
//DevPath·תΪӵName
function searchDevPath(DevPath){
	for(var i = 0; i < G_wanConnction.length; i++){
		if(G_wanConnction[i][1] == DevPath){
			return G_wanConnction[i][0];
		}
	}
	return '';
}

function uiSubmit(){
	var WanFilterNum = Number(Form.Radio('RAD_wanTolan')) + 2;
	var LanFilterNum = Number(Form.Radio('RAD_lanTowan'));
	
	//˰(ֵ1ΪֵΪ2ʱWAN  LANǰ)ʾ
	if ($('SEL_SecurLevel').value > 1)
	{
		if (confirm(SEcode[3000]) == false)
		{
			return false;
		}
	}
	
	
	$H({
		':InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.IPFilterEnable'			: Form.Checkbox('CHE_ipfilter'),
		':InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.SecurityLevel' 			: $('SEL_SecurLevel').value,
		':InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.CurrentLANFilterTable' 	: G_SecurityLevel == '0' ? LanFilterNum : undefined,
		':InternetGatewayDevice.X_TWSZ-COM_IP6Firewall.CurrentWANFilterTable' 	: G_SecurityLevel == '0' ? WanFilterNum : undefined,
		'obj-action'       : 'set',
		'var:menu'         : G_Menu,
		'var:page'         : G_Page,
		'getpage'          : 'html/index.html',
		'errorpage'        : 'html/index.html',
		'var:errorpage'    : G_Page,
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function doEditEntry(Idx){
	
	var G_FilterLists = $('SEL_direct').value == '1' ? (Form.Radio('RAD_wanTolan') == '1' ? G_Wan_White : G_Wan_Black) : (Form.Radio('RAD_lanTowan') == '1' ? G_Lan_White : G_Lan_Black);
	var _split = G_FilterLists[Idx][10].split('.');

	
	$H({
		'var:IPfilterType':_split[2].substring(0,8),
		'var:nodePath'    :_split[3],
		'getpage'         :'html/index.html',
		'errorpage'       :'html/index.html',
		'var:menu'        : G_Menu,
		'var:page'        : G_Page,
		'var:subpage'     : 'Fir_addipv6filter'
	});
	$('uiPostForm').submit();	
}

function doRemoveEntry(Idx){
	var G_FilterLists = $('SEL_direct').value == '1' ? (Form.Radio('RAD_wanTolan') == '1' ? G_Wan_White : G_Wan_Black) : (Form.Radio('RAD_lanTowan') == '1' ? G_Lan_White : G_Lan_Black);
	
	if(!confirm(SEcode[1001])){ return false;}
	
	$H({
		'del-obj'   	:G_FilterLists[Idx][10],
		'obj-action'	:'del',
		'var:menu'  	: G_Menu,
		'var:page'  	: G_Page,
		'getpage'   	:'html/index.html',
		'errorpage' 	:'html/index.html',
		'var:errorpage'	: G_Page
	});
	$('uiPostForm').submit();	
}

function uiAddRule(){
	//ѡWAN->LAN(1),LAN->WAN(2)
	var listType = $('SEL_direct').value;
	var filterType;
	
	switch(G_SecurityLevel){
		case '3' : {
			filterType = listType == '1' ? 'WanWhite' : 'LanWhite';
			break;
		}
		case '2' : {
			filterType = listType == '1' ? 'WanWhite' : 'LanBlack';
			break;
		}
		case '1' : {
			filterType = listType == '1' ? 'WanBlack' : 'LanBlack';
			break;
		}
		case '0' : {
			filterType = listType == '1' ? (Form.Radio('RAD_wanTolan') == '1' ? 'WanWhite' : 'WanBlack') : (Form.Radio('RAD_lanTowan') == '1' ? 'LanWhite' : 'LanBlack');
			break;
		}
	}
	
	$H({
		'var:IPfilterType' : filterType,
		'var:menu'         : G_Menu,
		'var:page'         : G_Page,
		'var:subpage'      : 'Fir_addipv6filter',
		'getpage'          : 'html/index.html',
		'errorpage'        : 'html/index.html'
	});
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);
