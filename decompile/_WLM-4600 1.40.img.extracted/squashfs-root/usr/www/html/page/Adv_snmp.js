/*  ڴJavaScript  */
<?mget :InternetGatewayDevice.X_TWSZ-COM_SNMPAgent. "Enable Status ROCommunity RWCommunity TrapHost TrapCommunity TrapVersion"
`	var G_SNMPEnable 		= "$01";
	var G_SNMPStatus 		= "$02";
	var G_ROCommunity 		= "$03";
	var G_RWCommunity 		= "$04";
	var G_TrapHost    		= "$05";
	var G_TrapCommunity 	= "$06";
	var G_TrapVersion 		= "$07";
`?>

function uiOnload(){
	
	setJSONValue({
		'TE_ReadComm'  		: G_ROCommunity,
		'TE_SetComm'  		: G_RWCommunity,
		'TE_TrapIp'     	: G_TrapHost,
		'TE_TrapComm'		: G_TrapCommunity,
		'SEL_TrapVersion'  	: G_TrapVersion || '1'
	});
	
	Form.Radio("RAD_snmp", G_SNMPEnable);
	doSnmpActive();
}

function uiSubmit(){
	var node_snmp = $('TE_ReadComm','TE_SetComm','TE_TrapIp','TE_TrapComm','SEL_TrapVersion');
	
	$H({
		":InternetGatewayDevice.X_TWSZ-COM_SNMPAgent.Enable"       : Form.Radio('RAD_snmp') == '1' ? 1:0,
		":InternetGatewayDevice.X_TWSZ-COM_SNMPAgent.ROCommunity"  : node_snmp[0].value,
		":InternetGatewayDevice.X_TWSZ-COM_SNMPAgent.RWCommunity"  : node_snmp[1].value,
		":InternetGatewayDevice.X_TWSZ-COM_SNMPAgent.TrapHost"     : node_snmp[2].value,
		":InternetGatewayDevice.X_TWSZ-COM_SNMPAgent.TrapCommunity": node_snmp[3].value,
		":InternetGatewayDevice.X_TWSZ-COM_SNMPAgent.TrapVersion"  : node_snmp[4].value,
		'obj-action'   : 'set',
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:subpage'  : G_SubPage,
		'var:errorpage': G_SubPage,
		'getpage'      : 'html/index.html',
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function doSnmpActive()
{
	if(Form.Radio('RAD_snmp') == '1')
	{
		$('TE_ReadComm').disabled = false;
		$('TE_SetComm').disabled = false;
		$('TE_TrapIp').disabled = false;
		$('TE_TrapComm').disabled = false;
		$('SEL_TrapVersion').disabled = false;
	}
	else
	{
		$('TE_ReadComm').disabled = true;
		$('TE_SetComm').disabled = true;
		$('TE_TrapIp').disabled = true;
		$('TE_TrapComm').disabled = true;
		$('SEL_TrapVersion').disabled = true;
	}
}


function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,dealWithError);
