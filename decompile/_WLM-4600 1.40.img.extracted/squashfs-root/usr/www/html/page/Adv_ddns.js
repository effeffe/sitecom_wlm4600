/*  ڴJavaScript  */
//DDNS
var G_DDNS = [];
var m = 0;
var buttoncheck=0;
<?objget :InternetGatewayDevice.X_TWSZ-COM_DDNS. "DDNSProvider Hostname WANConnectionID Username Password Email Key DDNSState DdnsHost"
`	G_DDNS[m] = ['$01', //DDNSProvider
				 '$02', //Hostname
				 '$03', //WAN Connection path
				 '$04', //Username
				 '$05', //Password
				 '$06', //Email
				 '$07', //Key
				 '$08',//DDNSState
				 '$09',
				 'InternetGatewayDevice.X_TWSZ-COM_DDNS.$00.']; 
	m++;                                                       
`?>
//Wan Connection
var G_WanConns = [];
var n = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.<?echo $30?>.WANIPConnection. " Name X_TWSZ-COM_ServiceList"
		`	G_WanConns[n] = ['<?echo $11?>',
							 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.<?echo $30?>.WANIPConnection.<?echo $10?>'];
            G_WanConns[n][2]="$02";
			n++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.<?echo $30?>.WANPPPConnection. " Name X_TWSZ-COM_ServiceList"
		`	G_WanConns[n] = ['<?echo $11?>',
							 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.<?echo $30?>.WANPPPConnection.<?echo $10?>'];
		    G_WanConns[n][2]="$02";
			n++;
		`?>
	`?>
`?>

var DDNS_PeanuthullClient = 0;
<?if eq 1 $var:mod_DDNS_PEANUTHULLCLIENT
`
   DDNS_PeanuthullClient = 1;
`?>
var option = '-';
var edit_index = -1;

/*get the wan connection name*/
function transform_name()
{
	var path = arguments[0];
	for (var i = 0; i < G_WanConns.length; i++)
	{
		if (G_WanConns[i][1] == path)
			return G_WanConns[i][0];
	}
	return "unknown";
}

function uiOnload(){	
	var array_ddns = [];
	var   WANConnectionname = [];
	//create ddns list table
	for(var i = 0, _len = G_DDNS.length; i < _len; i++){
		array_ddns[i] = [
						 i+1,
						G_DDNS[i][1].replace(/;/g,'<br>'), //Hostname
						G_DDNS[i][3], //USERNME
						G_DDNS[i][0], //DDNSProvider
						transform_name(G_DDNS[i][2]),
						'<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="doEditEntry('+ i +')"/>',
						'<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="doRemoveEntry('+ i +')"/>'
						];
	}
	$T('TA_Ddns_List',array_ddns);
	
    if (1 == DDNS_PeanuthullClient)
	    $S('SEL_DdnsProvider',['DynDNS.org','TZO', 'GnuDIP','www.oray.cn']);
	else
		$S('SEL_DdnsProvider',['DynDNS.org','3322.org', 'no-ip.com', 'freedns.afraid.org']);

	createWanConns();
	chooseDDNSProvider();
}

function createWanConns(){
	var _text = [], _value = [];
//	var k = 0;
	
	for(var i = 0, _len = G_WanConns.length; i < _len; i++){
		if (G_WanConns[i][0].indexOf('br') > -1||G_WanConns[i][2]=="TR069" || G_WanConns[i][0].indexOf('Bridge') > -1) {
			continue;
		}
		_text.push(G_WanConns[i][0]);
		_value.push(G_WanConns[i][1]);
	//	k++;
	}
	$S('SEL_interface',_text,_value);
}

function chooseDDNSProvider(){
	var provider = $('SEL_DdnsProvider').value;

	//hidden all the text item
	$('TR_hostname').style.display = 'none';
	$('DynDNS.org').style.display = 'none';
	$('DynDNS.org_2').style.display = 'none';
	$('freedns.afraid.org').style.display = 'none';
	$('TZO').style.display = 'none';
	$('TZO_2').style.display = 'none';
	$('GnuDIP').style.display = 'none';
	$('GnuDIP_2').style.display = 'none';
	$('GnuDIP_3').style.display = 'none';

    if (provider != 'www.oray.cn')
    {
        $('TR_hostname').style.display = '';
    }
   
	if (1 == DDNS_PeanuthullClient)
	{
		if(provider == 'www.oray.cn')
		{
			$('TR_hostname').style.display = 'none';
			$('DynDNS.org').style.display = '';
			$('DynDNS.org_2').style.display = '';
		}
		else if(provider == 'TZO')
		{
			$('TZO').style.display = '';
			$('TZO_2').style.display = '';
		}
		else if(provider == 'GnuDIP')
		{
			$('GnuDIP').style.display = '';
			$('GnuDIP_2').style.display = '';
			$('GnuDIP_3').style.display = '';
		}
		else
		{
			$('DynDNS.org').style.display = '';
			$('DynDNS.org_2').style.display = '';
		}
	}
	else
	{
		if(provider == 'freedns.afraid.org')
		{
			$('freedns.afraid.org').style.display = '';
		}
		else
		{
			$('DynDNS.org').style.display = '';
			$('DynDNS.org_2').style.display = '';
		}
	}
	
}

/*add a new ddns item*/
function uiAddDdns()
{
	option = "add";
	$('DIV_DdnsList').style.display = 'none';
	$('TA_AddDdns').style.display = '';
	$('TA_AddDdns_2').style.display = '';
	
	if (1 == DDNS_PeanuthullClient)
		$S('SEL_DdnsProvider',['DynDNS.org','TZO', 'GnuDIP','www.oray.cn']);
	else
		$S('SEL_DdnsProvider',['DynDNS.org','3322.org', 'no-ip.com', 'freedns.afraid.org']);
			
	createWanConns();
	chooseDDNSProvider(); 
}

function doEditEntry(Idx)
{
	option = "edit";
	edit_index = Idx;
	$('DIV_DdnsList').style.display = 'none';
	$('TA_AddDdns').style.display = '';
	$('TA_AddDdns_2').style.display = '';
	
	$('SEL_DdnsProvider').value = G_DDNS[Idx][0];
	$('TE_hostname').value = G_DDNS[Idx][1];	
	
	if(G_DDNS[Idx][0]=='DynDNS.org' || G_DDNS[Idx][0]=='3322.org' || G_DDNS[Idx][0]=='no-ip.com' || G_DDNS[Idx][0]=='www.oray.cn')
	{
		 $('TE_username').value = G_DDNS[Idx][3];
		 $('TE_password').value = G_DDNS[Idx][4];
	}
	else if(G_DDNS[Idx][0]=='TZO')
	{
		 $('TE_email').value = G_DDNS[Idx][5];
		 $('TE_key').value = G_DDNS[Idx][6];	
	}
	else if(G_DDNS[Idx][0]=='GnuDIP')
	{		
		 $('TE_UsernameGnudip').value = G_DDNS[Idx][3];
		 $('TE_PasswordGnudip').value = G_DDNS[Idx][4];		
		 $('TE_DdnsServer').value = G_DDNS[Idx][8];
	}
	else if(G_DDNS[Idx][0]=='freedns.afraid.org')
	{
		 $('TE_hashkey').value = G_DDNS[Idx][6];
	}
	
	$('SEL_interface').value=G_DDNS[Idx][2];
	chooseDDNSProvider();  
}

function doRemoveEntry(Idx)
{
	if(!confirm(SEcode[1008])){
		return false;
	}
	
	$H({
			'del-obj'    		: G_DDNS[Idx][9] ,
			'obj-action' 		: 'del',
			'var:menu'  		: G_Menu,
			'var:page'   		: G_Page,
			'getpage'    		: 'html/index.html',
			'errorpage'  		: 'html/index.html',
			'var:errorpage' 	: G_SubPage,
			'var:CacheLastData' : ViewState.Save()
	});
	$('uiPostForm').submit();
}

function uiSubmit()
{
	var node_ddns=$('SEL_DdnsProvider',
					'TE_hostname',
					'SEL_interface',
					'TE_username',
					'TE_password',
					'TE_hashkey',
					'TE_email',
					'TE_key',
					'TE_DdnsServer',
					'TE_UsernameGnudip',
					'TE_PasswordGnudip'
					);
	var ddnsProvider = node_ddns[0].value;
	
	if(option == 'add')
	{
		if(ddnsProvider == 'www.oray.cn')
		{
			$H({
		    'add-obj'         : 'InternetGatewayDevice.X_TWSZ-COM_DDNS.',
		    ':DDNSProvider'   : node_ddns[0].value,
		    ':Hostname'       : '_',
		    ':WANConnectionID': node_ddns[2].value	
	    	}, true);
		}
		else
		{
			$H({
		    'add-obj'         : 'InternetGatewayDevice.X_TWSZ-COM_DDNS.',
		    ':DDNSProvider'   : node_ddns[0].value,
		    ':Hostname'       : node_ddns[1].value,
		    ':WANConnectionID': node_ddns[2].value		
	    	}, true);
		}
		
		if (ddnsProvider == 'DynDNS.org' || ddnsProvider == '3322.org' || ddnsProvider == 'no-ip.com' || ddnsProvider == 'www.oray.cn')
		{
			
			$H({
				':Username'       : node_ddns[3].value,
				':Password'       : node_ddns[4].value
			});
		}
		else if (ddnsProvider == 'freedns.afraid.org')
		{
			$H({
				':Username'     : '-',
				':Key'          : node_ddns[5].value
			});
		}
		else if (ddnsProvider == 'TZO')
		{
			$H({
				':Email'          : node_ddns[6].value,
				':Key'            : node_ddns[7].value
			});
		}
		else if (ddnsProvider == 'GnuDIP')
		{
			$H({
				':Username'       : node_ddns[9].value,
				':Password'       : node_ddns[10].value,
				':DdnsHost'       :  node_ddns[8].value
			});
		}
	 	
		$H({'obj-action'       : 'add-set'});
	}
	else
	{
		var path = ':' + G_DDNS[edit_index][9];
		
		$F(path + 'DDNSProvider',  node_ddns[0].value);
		
		if (ddnsProvider == 'www.oray.cn')
		{
			$F(path + 'Hostname', '_');
		}
		else
		{
			$F(path + 'Hostname',  node_ddns[1].value);
		}

		$F(path + 'WANConnectionID',  node_ddns[2].value);
	
		if (ddnsProvider == 'DynDNS.org' || ddnsProvider == '3322.org' || ddnsProvider == 'no-ip.com' || ddnsProvider == 'www.oray.cn')
		{
		
			$F(path + 'Username',  node_ddns[3].value);
			$F(path + 'Password',  node_ddns[4].value);	
	
		}
		else if (ddnsProvider == 'freedns.afraid.org')
		{
			$F(path +   'Username'      ,   '-');
			$F(path +   'Key'           ,   node_ddns[5].value);
		}
		else if (ddnsProvider == 'TZO')
		{
	
			$F(path + 'Email',  node_ddns[6].value);
			$F(path + 'Key',  node_ddns[7].value);				
		}
		else if (ddnsProvider == 'GnuDIP')
		{		
			$F(path + 'Username',  node_ddns[9].value);
			$F(path + 'Password',  node_ddns[10].value);					
			$F(path + 'DdnsHost',  node_ddns[8].value);		
		}

		$F('obj-action' ,'set');
	}
	
	$H({
		'getpage'          :'html/index.html',
		'errorpage'        :'html/index.html',
		'var:menu'         :G_Menu,
		'var:page'         :G_Page,
		'var:errorpage'    :G_Page,
		'var:CacheLastData': ViewState.Save()
	});
	
	$('uiPostForm').submit();
}

function uiBack()
{
	option = "-";
	edit_index = -1;
	$('DIV_DdnsList').style.display = '';
	$('TA_AddDdns').style.display = 'none';
	$('TA_AddDdns_2').style.display = 'none';
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);

