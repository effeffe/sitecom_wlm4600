// ip filter$var:IPfilterType示<?echo $var:IPfilterType?>:<?echo $var:nodePath?>
var G_Description=G_Enable=G_SrcIP=G_DestIP=G_SrcPort=G_DestPort=G_Protocol=G_SrcMask=G_DstMask=G_DevPath='';
<? if neq `-` `$var:nodePath`
`	<?mget :InternetGatewayDevice.X_TWSZ-COM_Firewall.<?echo $var:IPfilterType?>Filter.<?echo $var:nodePath?>. "Description Enable SrcIP DestIP SrcPort DestPort Protocol SrcMask DstMask DevPath"
	`	G_Description = "$01";
		G_Enable     = "$02";
		G_SrcIP       = "$03";
		G_DestIP      = "$04";
		G_SrcPort     = "$05";
		G_DestPort    = "$06";
		G_Protocol    = "$07";
		G_SrcMask     = "$08";
		G_DstMask     = "$09";
		G_DevPath     = "$0a";
	`?>	
`?>

var G_wanConnction = [];
var m = 0;
//Wan Device
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name X_TWSZ-COM_ProtocolType"
		`	G_wanConnction[m] = [];
			G_wanConnction[m][0] = "$01"; // name;
			G_wanConnction[m][1] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00"; // about Path
			G_wanConnction[m][2] = "$02";
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name X_TWSZ-COM_ProtocolType"
		`	G_wanConnction[m] = [];
			G_wanConnction[m][0] = "$01"; // wan's name;
			G_wanConnction[m][1] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00"; // about Path;
			G_wanConnction[m][2] = "$02";
			m++;
            `?>
		`?>
	`?>
//Lan Device
var n = 0;
<?objget :InternetGatewayDevice.Layer2Bridging.Bridge. "BridgeName X_TWSZ-COM_AssociatedLANDevice"
`	<?setvar var:lanPath <?echo $22?> ?>
        <? if neq $var:lanPath ""
        `
            G_wanConnction[m] = [];
            G_wanConnction[m][0] = "<?get :<?echo $var:lanPath?>.X_TWSZ-COM_Name?>" ; // lan's name
            G_wanConnction[m][1] = "<? echo $22 ?>";
            G_wanConnction[m][2] = "IPv4&6";//no matter if it is v4 or v6
	n++;
	m++;
`?>
`?>

/*
</objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "SSID"
`	G_wanConnction[m] = [];
	G_wanConnction[m][0] = "$01"; // lan's name
	G_wanConnction[m][1] = "InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00";
	++m;
`/>
*/

function uiOnload(){
	//DevPath值
	var _text = [], _value = [];
	for(var i = 0; i < G_wanConnction.length; i++){
		//wan->lan只选wan说樱lan->wan只选lan说
		if(('<?echo $var:IPfilterType?>'.indexOf('Lan') > -1 && G_wanConnction[i][1].indexOf('LANDevice') > -1) || 
			(('<?echo $var:IPfilterType?>'.indexOf('Wan') > -1 && G_wanConnction[i][1].indexOf('WANDevice') > -1) && (G_wanConnction[i][2].indexOf('4') >= 0))
		){
			_text.push(G_wanConnction[i][0]);
			_value.push(G_wanConnction[i][1]);
		}
	}
	$S('SEL_conn',_text,_value);
	//没嗉彬，街姑晦窪evPath
	$('SEL_conn').disabled = G_DevPath == '' ? false : true; 
	
	//慕诘愀持?
	setJSONValue({
		'CHE_enable'     	:G_Enable || 1,
		'TE_description'	:G_Description,
		'TE_SrcIp'      	:G_SrcIP,
		'TE_SrcMask'    	:G_SrcMask,
		'TE_DestIp'     	:G_DestIP,
		'TE_DestMask'   	 :G_DstMask,
		'SEL_protocol'  	:(G_Protocol == '' ? 'TCP' : G_Protocol),
		'SEL_conn' 			:G_DevPath || G_wanConnction[0][1]
	});
	
	changeProtocol();
}

function uiSubmit(){	
	var Value_Nodes = $('TE_description','TE_SrcIp','TE_SrcMask','TE_SrcPort_start','TE_SrcPort_end','TE_DestIp','TE_DestMask','TE_DestPort_start','TE_DestPort_end','SEL_protocol','SEL_conn');
	//为眨峤?
	if(Value_Nodes[10].value == ''){
		DealWith.Wrong('SEL_conn', SEcode[1002]);
		return false;
	}
    
    if ( (Value_Nodes[9].value == 'ICMP' ) || (Value_Nodes[9].value == 'all')){
        var setPort = false;
    }else{
        var setPort = true;
    }
        
	<?setvar var:Path <?if eq `-` `$var:nodePath` `` `InternetGatewayDevice.X_TWSZ-COM_Firewall.<?echo $var:IPfilterType?>Filter.$var:nodePath.`?>?>
	$H({
		':<?echo $var:Path?>Enable'     : Form.Checkbox('CHE_enable'),
		':<?echo $var:Path?>Description': Value_Nodes[0].value,
		':<?echo $var:Path?>SrcIP'      : Value_Nodes[1].value,
		':<?echo $var:Path?>SrcMask'    : Value_Nodes[2].value,
		':<?echo $var:Path?>DestIP'     : Value_Nodes[5].value,
		':<?echo $var:Path?>DstMask'    : Value_Nodes[6].value,
		':<?echo $var:Path?>Protocol'   : Value_Nodes[9].value,
		':<?echo $var:Path?>SrcPort'    : setPort ? (Value_Nodes[3].value + ':' + Value_Nodes[4].value).replace(/(^:*)|(:*$)/g,'') : '',
		':<?echo $var:Path?>DestPort'   : setPort ? (Value_Nodes[7].value + ':' + Value_Nodes[8].value).replace(/(^:*)|(:*$)/g,'') : '',
		':<?echo $var:Path?>DevPath'    : Value_Nodes[10].value,
		'var:nodePath':'<?echo $var:nodePath?>',
		'getpage'  : 'html/index.html',
		'errorpage': 'html/index.html',
		'var:menu' : G_Menu,
		'var:page' : G_Page,
		'var:IPfilterType' : '<?echo $var:IPfilterType?>',
		'var:errorpage'    : G_Page,
		'var:CacheLastData': ViewState.Save()
	},true);
	//峤?实2嗉?
	if('<?echo $var:nodePath?>' == '-'){
		$F('add-obj','InternetGatewayDevice.X_TWSZ-COM_Firewall.<?echo $var:IPfilterType?>Filter.');
		$F('obj-action','add-set');
	} else {
		$F('obj-action','set');
	}
	$('uiPostForm').submit();
}

function changeProtocol(){
	var node_value = $('SEL_protocol','TE_SrcPort_start','TE_SrcPort_end','TE_DestPort_start','TE_DestPort_end','FI4A007','FI4A010');
	if(node_value[0].value == 'ICMP' || node_value[0].value == 'all'){
		node_value[1].disabled = true;
		node_value[2].disabled = true;
		node_value[3].disabled = true;
		node_value[4].disabled = true;
		node_value[5].style.color = '#aaa';
		node_value[6].style.color = '#aaa';
		supplyValue('TE_SrcPort_start','');
		supplyValue('TE_SrcPort_end','');
		supplyValue('TE_DestPort_start','');
		supplyValue('TE_DestPort_end','');
	} else {
		node_value[1].disabled = false;
		node_value[2].disabled = false;
		node_value[3].disabled = false;
		node_value[4].disabled = false;
		node_value[5].style.color = '#000';
		node_value[6].style.color = '#000';
		supplyValue('TE_SrcPort_start',G_SrcPort.split(':')[0]);
		supplyValue('TE_SrcPort_end',G_SrcPort.split(':')[1] || '');
		supplyValue('TE_DestPort_start',G_DestPort.split(':')[0]);
		supplyValue('TE_DestPort_end',G_DestPort.split(':')[1] || '');
	}
}

function uiPageRefresh(){
	document.location.href = '/cgi-bin/webproc?getpage=html/index.html&var:menu=firewall&var:page=Fir_ipv4filter&var:subpage=Fir_addipv4filter&var:IPfilterType=<?echo $var:IPfilterType?>&var:nodePath=<?echo $var:nodePath?>';
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	arrayHint['SrcIP']      = 'TE_SrcIp';
	arrayHint['SrcMask']    = 'TE_SrcMask';
	arrayHint['SrcPort']    = 'TE_SrcPort_start';
	arrayHint['DestIP']     = 'TE_DestIp';
	arrayHint['DstMask']    = 'TE_DestMask';
	arrayHint['DestPort']   = 'TE_DestPort_start';
	arrayHint['Enable']     = 'CHE_enable';
	arrayHint['Protocol']   = 'SEL_protocol';
	arrayHint['Description']= 'TE_description';
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);
