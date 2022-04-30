/*add javascript*/
var G_Enable=G_Name=G_TriggerProtocol=G_TriggerStartPort=G_TriggerEndPort=G_OpenProtocol=G_OpenStartPort=G_OpenEndPort=G_TriggerStartIP=G_TriggerEndIP='';
<? if neq `-` `$var:nodeIndex`
`	<?mget :InternetGatewayDevice.X_TWSZ-COM_PortTrigger.TriggerList.<?echo $var:nodeIndex?>. "Enable Description TriggerProtocol TriggerStartPort TriggerEndPort OpenProtocol OpenStartPort OpenEndPort TriggerStartIP TriggerEndIP" 
	`	G_Enable				="$01";
		G_Name					= "$02";
		G_TriggerProtocol		="$03";
		G_TriggerStartPort		="$04";
		G_TriggerEndPort		="$05";
		G_OpenProtocol			="$06";
		G_OpenStartPort			="$07";
		G_OpenEndPort			="$08";
		G_TriggerStartIP		="$09";
		G_TriggerEndIP			="$0a";
	`?>	
`?>

var LanHosts = [];
var m = 0;
<?objget :InternetGatewayDevice.LANDevice. "Hosts.HostNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.LANDevice.$20.Hosts.Host. "MACAddress IPAddress HostName"
		`	LanHosts[m] = ["$01","$02",Base64.Decode("$03")];
			m++;
		`?>
	`?>
`?>
//LAN IP
var G_IPRouters = "<?get :InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.IPInterface.1.IPInterfaceIPAddress?>";
var G_CurrentIP = "<?echo $var:sys_RemoteAddr ?>";

//if the ip value is same with the gateway ip, then alert and return false.
function pfCheckIpValue(forCheckIp,gatewayIp)
{
	if(forCheckIp==gatewayIp)
		return false;
	else
		return true;
}

function onSupplyIPValue(_value){
	var arr_lanhost = _value.toUpperCase().split('.');
	for(var i=1; i<5; i++)
		supplyValue('TE_IpAddr_'+i, arr_lanhost[i-1]);

	$('TA_lanip').style.display = "none";
}

function onClickSearchIP(){
	$('TA_lanip').style.display = "";
}

//CreateLanIPTable
function CreateLanIPTable()
{
	var arr_LanHost = [], temp_curip;
	var temp_lanip = G_IPRouters.substr(0, G_IPRouters.lastIndexOf('.'));
	
	for(var i=0; i<LanHosts.length; i++){
		temp_curip = LanHosts[i][1].substr(0, LanHosts[i][1].lastIndexOf('.'));
		if(temp_lanip != temp_curip) //exclude the current ip
			continue;
		arr_LanHost[i] = [];
		arr_LanHost[i].push(i+1);
		arr_LanHost[i].push(LanHosts[i][1]);
		arr_LanHost[i].push(LanHosts[i][2]);
		arr_LanHost[i].push('<input type="radio" name="RAD_Checked" value="'+LanHosts[i][1]+'" onClick="onSupplyIPValue(this.value)">');
	}
	$T('TA_lanip', arr_LanHost);
}

function ServiceUser_Onchange()
{
	if($('SEL_ServiceUser').value=='Any')
	{
		$('TE_IpAddr_1').disabled=true;
		$('TE_IpAddr_2').disabled=true;
		$('TE_IpAddr_3').disabled=true;
		$('TE_IpAddr_4').disabled=true;
		$('BUT_searchIP').disabled=true;
	}
	else
	{
		$('TE_IpAddr_1').disabled=false;
		$('TE_IpAddr_2').disabled=false;
		$('TE_IpAddr_3').disabled=false;
		$('TE_IpAddr_4').disabled=false;
		$('BUT_searchIP').disabled=false;
	}
}


function uiOnload()
{
 	setJSONValue({
		'TE_ServiceName'			: G_Name,
		'SEL_ServiceType'			: G_TriggerProtocol == ''?'TCP':G_TriggerProtocol,
		'SEL_ConnType'				: G_OpenProtocol == ''?'TCP':G_OpenProtocol,
		'TE_PortStart' 				: G_TriggerStartPort,
		'TE_PortEnd'				: G_TriggerEndPort,
		'TE_OpenPortStart'			: G_OpenStartPort,
		'TE_OpenPortEnd'			: G_OpenEndPort
	});

	if ((G_TriggerStartIP=='')||(G_TriggerStartIP=='0.0.0.0'))
	{
		$('SEL_ServiceUser').value='Any'
	}
	else
	{
		//alert(G_TriggerStartIP);
		
		$('SEL_ServiceUser').value='Single address'
		onSupplyIPValue(G_TriggerStartIP);
	}
		
	ServiceUser_Onchange();
	CreateLanIPTable();
}

function uiSubmit()
{
	<?setvar var:Path <?if eq `-` `$var:nodeIndex` `` `InternetGatewayDevice.X_TWSZ-COM_PortTrigger.TriggerList.$var:nodeIndex.`?>?>
	
	var startip;
	var endif;
	if($('SEL_ServiceUser').value=='Any')
	{
		startip='0.0.0.0';
		endip='255.255.255.255';
	}
	else
	{
		startip=$('TE_IpAddr_1').value+'.'+ $('TE_IpAddr_2').value +'.'+ $('TE_IpAddr_3').value +'.'+ $('TE_IpAddr_4').value;
		endip=startip;

		if((startip == "0.0.0.0") || (startip == "255.255.255.255"))
		{
			alert(SEcode[2014]);
			return false;
		}
	}

	if(!pfCheckIpValue(startip, G_IPRouters))
	{
		alert(SEcode[2015]);
		return false;
	}
	
	if($('TE_ServiceName').value == '')
	{
		alert(SEcode[2016]);
		return false;
	}
	
	$H({         
		':<?echo $var:Path?>Enable'     			: '1',
		':<?echo $var:Path?>Description'			: $('TE_ServiceName').value,
		':<?echo $var:Path?>TriggerProtocol'        : $('SEL_ServiceType').value,
		':<?echo $var:Path?>TriggerStartPort'     	: $('TE_PortStart').value,
		':<?echo $var:Path?>TriggerEndPort'    	 	: $('TE_PortEnd').value,
		':<?echo $var:Path?>OpenProtocol'     		: $('SEL_ConnType').value,
		':<?echo $var:Path?>OpenStartPort'     		: $('TE_OpenPortStart').value,
		':<?echo $var:Path?>OpenEndPort'     		: $('TE_OpenPortEnd').value,
		':<?echo $var:Path?>TriggerStartIP'     	: startip,
		':<?echo $var:Path?>TriggerEndIP'     		: endip,
		'var:page'	: G_Page,
		'var:menu'	: G_Menu,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'var:CacheLastData': ViewState.Save()
	},true);

	if('<?echo $var:nodeIndex?>' == '-'){
		$F('add-obj','InternetGatewayDevice.X_TWSZ-COM_PortTrigger.TriggerList.');
		$F('obj-action','add-set');
	} else {
		$F('var:nodeIndex','<?echo $var:nodeIndex?>');
		$F('obj-action','set');
	}

	$('uiPostForm').submit();
}


function uiCancel(){
	$G('/cgi-bin/webproc',{
		'var:page'         : G_Page,
		'var:menu'         : G_Menu,
		'getpage'          : 'html/index.html',
		'errorpage'        : 'html/index.html'
	});
}
function dealWithError(){
	if (G_Error != 1){
		return false;
	}

	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);

}
addListeners(uiOnload, dealWithError);

