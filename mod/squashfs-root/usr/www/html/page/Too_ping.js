<?setvaronce var:state 0?>
<?mget :InternetGatewayDevice.IPPingDiagnostics. "Host DiagnosticsState NumberOfRepetitions Timeout DataBlockSize SuccessCount FailureCount AverageResponseTime MinimumResponseTime MaximumResponseTime Interface"
`	var G_Host                = "$01";
	var G_DiagnosticsState    = "$02";
	var G_NumberOfRepetitions = "$03";
	var G_Timeout             = "$04";
	var G_DataBlockSize       = "$05";
	
	var G_SuccessCount        = "$06";
	var G_FailureCount        = "$07";
	var G_AverageResponseTime = "$08";
	var G_MinimumResponseTime = "$09";
	var G_MaximumResponseTime = "$0a";
	var G_Interface           = "$0b";
`?>
//WAN连接
var G_Connection = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "ConnectionStatus Name ConnectionType X_TWSZ-COM_ProtocolType"
		`	G_Connection[m] = ["InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00", //path
							   "<?if eq `<?echo $24?>` `IPv4` `<?echo $21?>` `<?get :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.<?echo $50?>.WANIPConnection.<?echo $30?>.X_TWSZ-COM_IPv6Config.ConnectionStatus?>`?>", //ConnectionStatus
							   "$02", //Name
							   "$03", //ConnectionType
							   "$04", //X_TWSZ-COM_ProtocolType
							   ];
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "ConnectionStatus Name ConnectionType X_TWSZ-COM_ProtocolType"
		`	G_Connection[m] = ["InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00", //path
							   "<?if eq `<?echo $24?>` `IPv4` `<?echo $21?>` `<?get :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.<?echo $50?>.WANPPPConnection.<?echo $30?>.X_TWSZ-COM_IPv6Config.ConnectionStatus?>`?>", //ConnectionStatus
							   "$02", //Name
							   "$03", //ConnectionType
							   "$04", //X_TWSZ-COM_ProtocolType
							   ];
			m++;
		`?>
	`?>
`?>



function createConnsOpt(){
	var _text = [], _value = [];
//	var _proType = $('SELECT_Protocol').value;
	//var _proType = G_Connection[i][4];
	for(var i = 0; i < G_Connection.length; i++){
		//var _proType = G_Connection[i][4];
		if (G_Connection[i][3].indexOf('Bridge') > -1) {
            continue;
    }
    else
		if(G_Connection[i][4] != "IPv6"){

			_text.push(G_Connection[i][2]);
			_value.push(G_Connection[i][0]);
			 
		}
	}
	
	$S('SELECT_Conns', _text, _value);
	
	if('<?echo $var:path?>' != '-'){
		$('SELECT_Conns').value = '<?echo $var:path?>';
	}
	if (G_Interface != ""){
  	$('SELECT_Conns').value = G_Interface;//value = G_Interface;selectedIndex
  }
}

function ctrlPing(){
	var wan_conn = $('SELECT_Conns').value;
	
	if(wan_conn == ''){
		$('PING006').disabled = true;
	} else {
		for(var i = 0; i < G_Connection.length; i++){
			if(wan_conn == G_Connection[i][0] && G_Connection[i][1].indexOf('Connected') > -1){
				$('PING006').disabled = false;
				break;
			}
			else {
				$('PING006').disabled = true;
			}
		}
	}
}

function uiOnload(){
	var Node_Output = '';
	
	supplyValue('INPUT_Host',G_Host);
	supplyValue('INPUT_NumberOfRepetitions',G_NumberOfRepetitions);
	supplyValue('INPUT_TimeOut',G_Timeout/1000);
	supplyValue('INPUT_DataBlockSize',G_DataBlockSize);
	//生成WAN连接
	createConnsOpt();
	
	Node_Output += SEcode.lang_resolved_host + ': ' + G_Host;
//	if (G_ResolvedHost != '') {
//		Node_Output += '(' + G_ResolvedHost + ')';
//	}
	Node_Output += unescape("%0a");
	
	with(SEcode){
		switch (G_DiagnosticsState){
			case 'Complete':{
				Node_Output += lang_ping_status + ': '+ lang_finish+ unescape("%0a");
				Node_Output += lang_succ_times + ': '+ G_SuccessCount + unescape("%0a");
				Node_Output += lang_fail_times + ': '+ G_FailureCount + unescape("%0a");
				Node_Output += lang_response_time + ': '+ lang_max + G_MaximumResponseTime + ' ms , '+ lang_min + G_MinimumResponseTime +' ms , '+ lang_avg + G_AverageResponseTime +' ms';
				break;
			}
			case 'Error_CannotResolveHostName':{
				Node_Output += lang_ping_status + ': ' + lang_cannot_resolve_hostname;
				break;
			}
			case 'X_TWSZ-COM_Error_Unreachable':{
				Node_Output += lang_ping_status + ': ' + lang_unreachable_dest_net;
				break;
			}
			case 'Error_Interal':{
				Node_Output += lang_ping_status + ': ' + lang_internal_error;
				break;
			}
			case 'Requested':{
				Node_Output += lang_ping_status + ': ' + lang_pinging;
				setTimer();
				break;
			}
			case 'None': {
				Node_Output = '';
				break;
			}
		}
	}
	
	$('TEXTAREA_Output').value = Node_Output;
	//控制ping按钮
	ctrlPing();
	
	dealWithError();
}


function uiSubmit(){
	var value_array = $('INPUT_Host','INPUT_NumberOfRepetitions','INPUT_TimeOut','INPUT_DataBlockSize','SELECT_Conns');
	$H({
		':InternetGatewayDevice.IPPingDiagnostics.NumberOfRepetitions':value_array[1].value,
		':InternetGatewayDevice.IPPingDiagnostics.Timeout'            :value_array[2].value*1000,
		':InternetGatewayDevice.IPPingDiagnostics.DataBlockSize'      :value_array[3].value,
		':InternetGatewayDevice.IPPingDiagnostics.DiagnosticsState'   :'Requested',
		':InternetGatewayDevice.IPPingDiagnostics.Interface'          :value_array[4].value,
		':InternetGatewayDevice.IPPingDiagnostics.Host'               :value_array[0].value,
		'var:state' :'1',
		'var:menu'  :'toolbox',
		'var:page'  :'Too_ping',
		'var:errorpage':'Too_ping',
		'var:CacheLastData':ViewState.Save(),
		'obj-action':'set'
	});
	$('uiPostForm').submit();
}

function setTimer(){
	var Timer = setTimeout('uiPageRefresh()',5000);
	if(G_DiagnosticsState != 'Requested'){
		clearTimeout(Timer);
	} else {
		$('PING006').disabled = true;
	}
}

function uiPageRefresh(){
	document.location.href = '/cgi-bin/webproc?getpage=html/index.html&var:menu=toolbox&var:page=Too_ping';
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	arrayHint['Host']          = 'INPUT_Host';
	arrayHint['NumberOfRepetitions'] = 'INPUT_NumberOfRepetitions';
	arrayHint['Timeout']       = 'INPUT_TimeOut';
	arrayHint['DataBlockSize'] = 'INPUT_DataBlockSize';
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,Form.Action);

