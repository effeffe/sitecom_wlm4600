//DMZ模块
var G_Dmz = [];
var m = 0;
//
<?objget :InternetGatewayDevice.WANDevice. ""
`
<?objget :InternetGatewayDevice.WANDevice.$10.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_DMZEnabled X_TWSZ-COM_DMZHost X_TWSZ-COM_ServiceList"
		`	G_Dmz[m] = [];
			G_Dmz[m][0] = "$01";   // Name
			G_Dmz[m][1] = "$02";   // Enable
			G_Dmz[m][2] = "$03";   // Host
			G_Dmz[m][3] = ":InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection.$00.";   // Path
			G_Dmz[m][4] = "$04";
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_DMZEnabled X_TWSZ-COM_DMZHost X_TWSZ-COM_ServiceList"
		`	G_Dmz[m] = [];
			G_Dmz[m][0] = "$01";   // Name
			G_Dmz[m][1] = "$02";   // Enable
			G_Dmz[m][2] = "$03";   // Host
			G_Dmz[m][3] = ":InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANPPPConnection.$00.";   // Path
			G_Dmz[m][4] = "$04";
			m++;
		`?>
	`?>
`?>
`?>

//用来记录当前的Wan连接
var wanConIndex = '<?echo $var:wanConIndex?>';

function onClkDmz(){
	//DMZ 触发

		xValue = Form.Radio("RAD_DmzEnable");
	//DMZ 触发
	if(xValue == '1'){
		$('TE_DmzHostTpAddr').disabled = false;
	}else{		
		$('TE_DmzHostTpAddr').disabled = true;
	}
}

function uiOnload(){
	var _text = [], _value = [];
	for(var i = 0; i < G_Dmz.length; i++){
	    setJSONValue({
		    "RAD_DmzEnable" 	: G_Dmz[i][1]|| "1",
		    "TE_DmzHostTpAddr" 	: G_Dmz[i][2]
	    });
	}
	
	for(var i = 0; i < G_Dmz.length; i++){
		if (G_Dmz[i][0].indexOf('br') > -1||G_Dmz[i][4]=="TR069" || G_Dmz[i][0].indexOf('Bridge') > -1) {
			continue;
		}
		_text.push(G_Dmz[i][0]);
		_value.push(G_Dmz[i][3]);
	}
	$S('SELECT_WanConnection',_text,_value);
    $('SELECT_WanConnection').selectedIndex=0;
	setDmzValue(); 
	onClkDmz();
    
	
	

}

function setDmzValue(){
	var value_wanConn = $('SELECT_WanConnection').value;
	//根据wan连接来寻找对应的值
	for(var i = 0; i < G_Dmz.length; i++){
		if(value_wanConn == G_Dmz[i][3]){
	        Form.Radio('RAD_DmzEnable', G_Dmz[i][1]);
			$('TE_DmzHostTpAddr').value = G_Dmz[i][2];
			break;
		}
	}
	onClkDmz();
}

function uiSubmit(){
	var wanConn = $('SELECT_WanConnection').value;
	if(wanConn == ''){
		DealWith.Wrong('SELECT_WanConnection',SEcode[1002]);
		return false;
	}
	
	$H({
	   "obj-action" 		: "set",
			"getpage" 		: "html/index.html",
			"errorpage" 	: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" : G_Page,
		'var:wanConIndex'   : wanConn,
		'var:CacheLastData' : ViewState.Save()
	},true);
	$F(wanConn + 'X_TWSZ-COM_DMZEnabled',Form.Radio('RAD_DmzEnable'));
	$F(wanConn + 'X_TWSZ-COM_DMZHost',$('TE_DmzHostTpAddr').value);
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);