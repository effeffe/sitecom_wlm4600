/*alg configuration*/
<?mget :InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility. "TFTPEnabled FTPEnabled PPTPEnabled RTSPEnabled L2TPEnabled H323Enabled SIPEnabled IPSECEnabled IRCEnabled AmandaEnabled"
`
	var G_TFTPEnabled 	= "$01";
	var G_FTPEnabled 	= "$02";
	var G_PPTPEnabled 	= "$03";
	var G_RTSPEnabled 	= "$04";
	var G_L2TPEnabled  	= "$05";
	var G_H323Enabled  	= "$06";
	var G_SIPEnabled  	= "$07";
	var G_IPSECEnabled  	= "$08";
	var G_IRCEnabled      	= "$09";
	var G_AmandaEnabled     = "$0a";
`?>
function uiOnload(){
	setJSONValue({
		'CHE_tftp'		: G_TFTPEnabled,
		'CHE_ftp'  		: G_FTPEnabled,
		'CHE_pptp' 		: G_PPTPEnabled,
		'CHE_rtsp' 		: G_RTSPEnabled,
		'CHE_l2tp' 		: G_L2TPEnabled,
		'CHE_h323' 		: G_H323Enabled,
		'CHE_sip'  		: G_SIPEnabled,
		'CHE_ipsec'		: G_IPSECEnabled,
		'CHE_irc'		: G_IRCEnabled,
		'CHE_amanda'		: G_AmandaEnabled
	});
	
	dealWithError();
}


function uiSubmit(){
	var array_node = $('CHE_tftp','CHE_ftp','CHE_pptp','CHE_rtsp','CHE_l2tp','CHE_h323','CHE_sip','CHE_ipsec','CHE_irc','CHE_amanda');
	$H({
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.TFTPEnabled'  :(array_node[0].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.FTPEnabled' :(array_node[1].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.PPTPEnabled' :(array_node[2].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.RTSPEnabled' :(array_node[3].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.L2TPEnabled' :(array_node[4].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.H323Enabled' :(array_node[5].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.SIPEnabled'  :(array_node[6].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.IPSECEnabled':(array_node[7].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.IRCEnabled'  :(array_node[8].checked ? 1 : 0),
	   ':InternetGatewayDevice.Services.X_TWSZ-COM_ALGAbility.AmandaEnabled'  :(array_node[9].checked ? 1 : 0),
	   'var:menu'         :G_Menu,
	   'var:page'         :G_Page,
	   'obj-action'       :'set',
	   'var:errorpage'    :G_Page,
	   'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	arrayHint['FTPEnabled']  = 'CHE_tftp';
	arrayHint['TFTPEnabled'] = 'CHE_ftp';
	arrayHint['PPTPEnabled'] = 'CHE_pptp';
	arrayHint['RTSPEnabled'] = 'CHE_rtsp';
	arrayHint['L2TPEnabled'] = 'CHE_l2tp';
	arrayHint['H323Enabled'] = 'CHE_h323';
	arrayHint['SIPEnabled']  = 'CHE_sip';
	arrayHint['IPSECEnabled']= 'CHE_ipsec';
	arrayHint['IRCEnabled']  = 'CHE_irc';
	arrayHint['AmandaEnabled']  = 'CHE_amanda';

	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload);
