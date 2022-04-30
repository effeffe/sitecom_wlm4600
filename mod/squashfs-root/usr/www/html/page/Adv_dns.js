var connection = [];
var m = 0;

<?objget :InternetGatewayDevice.WANDevice. ""
`
	<?objget :InternetGatewayDevice.WANDevice.$10.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
	`	<?if gt $11 0
		`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.<?echo $30?>.WANIPConnection. "DNSServers Name DNSOverrideAllowed X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.IPv6DNSOverrideAllowed X_TWSZ-COM_IPv6Config.IPv6DNSServers AddressingType X_TWSZ-COM_UsrDNSServers X_TWSZ-COM_IPv6Config.UsrIPv6DNSServers"
			`	connection[m] = new Array(); 
				connection[m][0] = m; 
				connection[m][1] = "$01"; //DNSServers
				connection[m][2] = ":InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.<?echo $30?>.WANIPConnection.<?echo $10?>.";
				connection[m][3] = "$02"; //Name
				connection[m][4] = "$03"; //DNSOverrideAllowed
				connection[m][5] = "$04"; //X_TWSZ-COM_ProtocolType  
				connection[m][6] = "$05"; //IPv6DNSOverrideAllowed
			 	connection[m][7] = "$06"; //IPv6DNSServers
                connection[m][8] = "$07"; //AddressingType
                connection[m][9] = "$08"; //X_TWSZ-COM_UsrDNSServers
                connection[m][10] = "$09"; //UsrIPv6DNSServers
				++m;
			`?>
		`?>
		<?if gt $12 0
		`	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.<?echo $30?>.WANPPPConnection. "DNSServers Name DNSOverrideAllowed X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.IPv6DNSOverrideAllowed X_TWSZ-COM_IPv6Config.IPv6DNSServers X_TWSZ-COM_UsrDNSServers X_TWSZ-COM_IPv6Config.UsrIPv6DNSServers"
			`	connection[m] = new Array();
				connection[m][0] = m; 
				connection[m][1] = "$01"; //DNSServers
				connection[m][2] = ":InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.<?echo $30?>.WANPPPConnection.<?echo $10?>.";
				connection[m][3] = "$02"; //Name
				connection[m][4] = "$03"; //DNSOverrideAllowed
				connection[m][5] = "$04"; //X_TWSZ-COM_ProtocolType
				connection[m][6] = "$05"; //IPv6DNSOverrideAllowed
			 	connection[m][7] = "$06"; //IPv6DNSServers
                connection[m][8] = ""; 
                connection[m][9] = "$07"; //X_TWSZ-COM_UsrDNSServers
                connection[m][10] = "$08"; //UsrIPv6DNSServers
				++m;
			`?>
		`?>
	`?>
`?>
<?setvaronce var:wanSel 0?>
var G_wanSel = <?echo $var:wanSel?>; 
var G_WanIsStatic = false;

function createWanTable(){
    var _len = connection.length;
    if (_len == 0){ 
        return false;
    }
        
	var text_dns = [], value_dns = [], count=0;
	for (var i = 0; i < _len; i++){
        if (connection[i][3].indexOf('Bridge') > -1) {
            continue;
        }
		text_dns.push(connection[i][3]);
		value_dns.push(connection[i][0]);
	}
	$S('selectConnectionName', text_dns, value_dns);
	
}

function uiOnload(){

    createWanTable();
	$('selectConnectionName').value = G_wanSel;
    onChangeSelected();
    

}


function onChangeSelected(){
    
    G_wanSel = $('selectConnectionName').value;
    G_WanIsStatic = (connection[Number(G_wanSel)][8] == 'Static') ? true : false   

    $('IPv4_DNS_Setting').style.display = "none";
	$('IPv6_DNS_Setting').style.display = "none";	

	if(connection[Number(G_wanSel)][5] != 'IPv6' )
	{
		$('IPv4_DNS_Setting').style.display = "";
        $('IPv4DNSModeManual').checked = ((connection[Number(G_wanSel)][4] == '1') || G_WanIsStatic ) ? true : false;
        ClickIPv4DNSMode();
                
        if (G_WanIsStatic){
           // 静态连接不允许取消选择勾
            $('IPv4DNSModeManual').disabled = true;
        }else{
            $('IPv4DNSModeManual').disabled = false;
        }
	}
    
	if(connection[Number(G_wanSel)][5] != 'IPv4' )
	{
		$('IPv6_DNS_Setting').style.display = "";
        $('IPv6DNSModeManual').checked = ((connection[Number(G_wanSel)][6] == '1') || G_WanIsStatic ) ? true : false;
        ClickIPv6DNSMode();
        
        if (G_WanIsStatic){
            // 静态连接不允许取消选择勾
            $('IPv6DNSModeManual').disabled = true;
        }else{
            $('IPv6DNSModeManual').disabled = false;
        }
	}

	var node_dns  = $('INPUT_IPv4_DNS1','INPUT_IPv4_DNS2','INPUT_IPv6_DNS1','INPUT_IPv6_DNS2');
	var tmpIPv4DNS = [];
    var tmpIPv6DNS = [];
    if (G_WanIsStatic){
        tmpIPv4DNS = connection[Number(G_wanSel)][1].split(',');
        tmpIPv6DNS = connection[Number(G_wanSel)][7].split(',');
    }else{
        tmpIPv4DNS = connection[Number(G_wanSel)][9].split(',');
        tmpIPv6DNS = connection[Number(G_wanSel)][10].split(',');
    }
    
    node_dns[0].value = (tmpIPv4DNS[0] === undefined) ? '' : tmpIPv4DNS[0]; 
    node_dns[1].value = (tmpIPv4DNS[1] === undefined) ? '' : tmpIPv4DNS[1];
    node_dns[2].value = (tmpIPv6DNS[0] === undefined) ? '' : tmpIPv6DNS[0];
    node_dns[3].value = (tmpIPv6DNS[1] === undefined) ? '' : tmpIPv6DNS[1];
    
    
}


function uiSubmit(){

    var ipv4_node_dns  = $('INPUT_IPv4_DNS1','INPUT_IPv4_DNS2');
    var ipv4_value_dns = ipv4_node_dns[0].value.strip() + ',' + ipv4_node_dns[1].value.strip();
    var ipv6_node_dns  = $('INPUT_IPv6_DNS1','INPUT_IPv6_DNS2');
    var ipv6_value_dns = ipv6_node_dns[0].value.strip() + ',' + ipv6_node_dns[1].value.strip();
	
    if( connection[Number(G_wanSel)][5] != 'IPv6'){ /* 只有ipv4有效时才生成 ipv4的保存项目 */
        if (G_WanIsStatic){
            $F(connection[Number(G_wanSel)][2] + 'DNSServers' ,ipv4_value_dns.delcomma());
        }else{
            $F(connection[Number(G_wanSel)][2] + 'DNSOverrideAllowed' ,($('IPv4DNSModeManual').checked ? 1 : 0));
            if ( Form.Checkbox('IPv4DNSModeManual') ){
                $F(connection[Number(G_wanSel)][2] + 'X_TWSZ-COM_UsrDNSServers' ,ipv4_value_dns.delcomma());
            }
        }
    }
	
    if ( connection[Number(G_wanSel)][5] != 'IPv4'){  /* 只有ipv6有效时才生成 ipv6的保存项目 */
        if (G_WanIsStatic){
            $F(connection[Number(G_wanSel)][2] + 'X_TWSZ-COM_IPv6Config.IPv6DNSServers' ,ipv6_value_dns.delcomma());
        }else{
            $F(connection[Number(G_wanSel)][2] + 'X_TWSZ-COM_IPv6Config.IPv6DNSOverrideAllowed' ,($('IPv6DNSModeManual').checked ? 1 : 0));
            if ( Form.Checkbox('IPv6DNSModeManual') ){
                $F(connection[Number(G_wanSel)][2] + 'X_TWSZ-COM_IPv6Config.UsrIPv6DNSServers' ,ipv6_value_dns.delcomma());
            }
        }
    }
	
	$H({
		'var:wanSel': G_wanSel,
		'obj-action':'set',
		'getpage'   :'html/index.html',
		'errorpage' :'html/index.html',
		'var:menu'  :'advanced',
		'var:page'  :'Adv_dns',
		'var:errorpage'    : 'Adv_dns',
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function ClickIPv4DNSMode(){
    if ( $('IPv4DNSModeManual').checked ){
        $("INPUT_IPv4_DNS1").disabled = false;
        $("INPUT_IPv4_DNS2").disabled = false;
    }else{
        $("INPUT_IPv4_DNS1").disabled = true;
        $("INPUT_IPv4_DNS2").disabled = true;
    }
}

function ClickIPv6DNSMode(){
    if ( $('IPv6DNSModeManual').checked ){
        $("INPUT_IPv6_DNS1").disabled = false;
        $("INPUT_IPv6_DNS2").disabled = false;
    }else{
        $("INPUT_IPv6_DNS1").disabled = true;
        $("INPUT_IPv6_DNS2").disabled = true;
    }
}

function dealWithError(){

         if (G_Error != 1){ return false; }
         var arrayHint = [];
         dealErrorMsg(arrayHint, G_Error_Msg);
}


addListeners(uiOnload, dealWithError, Form.Action);
