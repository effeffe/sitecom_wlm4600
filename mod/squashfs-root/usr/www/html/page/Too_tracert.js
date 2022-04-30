<?setvaronce var:state 0?>
<?mget :InternetGatewayDevice.TracerouteDiagnostics. "Host TracerouteState MaxTTL WaitTime Interface TracertResult"
`	var G_Host                = "$01";
	var G_TracerouteState     = "$02";
	var G_MaxTTL              = "$03";
	var G_WaitTime            = "$04";	
	var G_Interface           = "$05";
	var G_TracertResult       = "$06";
`?>

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

	for(var i = 0; i < G_Connection.length; i++){
		if(G_Connection[i][4] != "IPv6"){
                _text.push(G_Connection[i][2]);
                _value.push(G_Connection[i][0]);
        }		 
	}
	
	$S('SELECT_Conns', _text, _value);
	
	if('<?echo $var:path?>' != '-'){
		$('SELECT_Conns').value = '<?echo $var:path?>';
	}
	
	$('SELECT_Conns').value = _text[0];//value = G_Interface;selectedIndex
}

/*
function TTLCtrlDisplay(){
	var _nodes = $('DIV_MAXTTL1','DIV_MAXTTL2');
  var _proType = $('SELECT_Protocol').value;

	if(_proType == 'IPv4'){
		_nodes[0].style.display = 'block';
		_nodes[1].style.display = 'none';
		//$('lang_maxttl1').innerHTML = '最大TTL';
	} else if(_proType == 'IPv6'){
		_nodes[0].style.display = 'none';
		_nodes[1].style.display = 'block';
		//$('lang_maxttl2').innerHTML = 'Hop Limit';
	}
}
*/
function ctrlTracert(){
	var wan_conn = $('SELECT_Conns').value;
	
	if(wan_conn == ''){
		$('TRAC008').disabled = true;
	} else {
		for(var i = 0; i < G_Connection.length; i++){
			//alert(G_Connection[i][1]);
			if(wan_conn == G_Connection[i][0] && G_Connection[i][1].indexOf('Connected') > -1){
				$('TRAC008').disabled = false;
				break;
			}
			else {
				$('TRAC008').disabled = true;
			}
		}
	}
}

function uiOnload(){
	var Node_Output = SEcode.lang_tracert_status;
	
	supplyValue('INPUT_Host',G_Host);
	supplyValue('INPUT_MAXTTL',G_MaxTTL);
	supplyValue('INPUT_WaitTime',G_WaitTime);
    
	createConnsOpt();
//	TTLCtrlDisplay();
	with(SEcode){
		switch (G_TracerouteState){
			case 'Finished':{
				Node_Output += ': '+ lang_finished + unescape("%0a");
				Node_Output +=  Base64.Decode(G_TracertResult)+ unescape("%0a");				
				break;
			}
			case 'No_Error':{
				Node_Output += ': '+ lang_running + unescape("%0a");
				Node_Output +=  Base64.Decode(G_TracertResult)+ unescape("%0a");	
				setTimer();			
				break;
			}
			case 'Error_UnknowHost':{
				Node_Output +=  ': ' + lang_cannot_resolve_hostname;
				break;
			}
			case 'Error_NoRoute':{
				Node_Output +=  ': ' + lang_unreachable_dest_net;
				break;
			}
			case 'Error_Interal':{
				Node_Output +=  ': ' + lang_internal_error + unescape("%0a");
				Node_Output +=  Base64.Decode(G_TracertResult) + unescape("%0a");
				break;
			}
			case 'Requested':{
				Node_Output +=  ': ' + lang_running;
				setTimer();
				break;
			}
			case 'None': break;
		}
	}
	
	$('TEXTAREA_Output').value = Node_Output;
	
	ctrlTracert();
	
	dealWithError();
}



function uiSubmit(){
	var value_array = $('INPUT_Host','INPUT_MAXTTL','INPUT_WaitTime','SELECT_Conns');
	//alert(value_array[4].value);
	$H({		
		':InternetGatewayDevice.TracerouteDiagnostics.Host'             :value_array[0].value,
		':InternetGatewayDevice.TracerouteDiagnostics.MaxTTL'			:value_array[1].value,
		':InternetGatewayDevice.TracerouteDiagnostics.WaitTime'         :value_array[2].value,
		':InternetGatewayDevice.TracerouteDiagnostics.TracerouteState'  :'Requested',
		':InternetGatewayDevice.TracerouteDiagnostics.Interface'          :value_array[3].value,
		'var:state' :'1',
		'var:menu'  :'toolbox',
		'var:page'  :'Too_tracert',
		'var:errorpage':'Too_tracert',
		'var:CacheLastData':ViewState.Save(),
		'obj-action':'set'
	});
	$('uiPostForm').submit();
}

function setTimer(){
	var Timer = setTimeout('uiPageRefresh()',5000);
	if(G_TracerouteState != 'Requested' && G_TracerouteState != 'No_Error'){
		clearTimeout(Timer);
	} else {
		$('TRAC008').disabled = true;
	}
}

function uiPageRefresh(){
	document.location.href = '/cgi-bin/webproc?getpage=html/index.html&var:menu=toolbox&var:page=Too_tracert&var:state=1';
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	arrayHint['Host']          	= 'INPUT_Host';
	arrayHint['MaxTTL'] 		= 'INPUT_MAXTTL';
	arrayHint['WaitTime']       = 'INPUT_WaitTime';
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,Form.Action);

