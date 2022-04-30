//Wan Connection
var G_wanConnction = [];
var m = 0;
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Name"
		`	G_wanConnction[m] = [];
			G_wanConnction[m][0] = "$01"; // name;
			G_wanConnction[m][1] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00";  // Path
			++m;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Name"
		`	G_wanConnction[m] = [];
			G_wanConnction[m][0] = "$01"; // name;
			G_wanConnction[m][1] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00";  // Path;
			++m;
		`?>
	`?>
`?>

// get LAN connectinons
var G_lanConnction = [];
var m = 0; 
<?objget :InternetGatewayDevice.Layer2Bridging.Bridge. "BridgeName X_TWSZ-COM_AssociatedLANDevice"
`	
    <?setvar var:lanPath <?echo $22?> ?>
    <? if neq $var:lanPath ""
    `
        G_lanConnction[m] = [];
        G_lanConnction[m][0] = "<?get :<?echo $var:lanPath?>.X_TWSZ-COM_Name?>" ; // lan's name
        G_lanConnction[m][1] = "<?echo $22?>";
        ++m;
    `?>
`?>


//***************************************************
var G_ACLWanGroup = []
var WanCount = 0;
<?setvar var:num <?get :InternetGatewayDevice.X_TWSZ-COM_ACL.RACLNumberOfEntries?>?>
<?if gt $var:num 0
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_ACL.RACL. "DevPath"
	`   <?objget :InternetGatewayDevice.X_TWSZ-COM_ACL.RACL.$10.Service. "Name Enable SrcIP SrcMask Protocol InternalPort ExternalPort"
		`   G_ACLWanGroup[WanCount] = [];
            G_ACLWanGroup[WanCount][0] = "$11"; //DevPath: used to match wan Interface
			G_ACLWanGroup[WanCount][1] = "$01"; //Name
			G_ACLWanGroup[WanCount][2] = "$02"; //enable
			G_ACLWanGroup[WanCount][3] = "$03"; //ip
			G_ACLWanGroup[WanCount][4] = "$04"; //mask
			G_ACLWanGroup[WanCount][5] = "$05"; //protocol
			G_ACLWanGroup[WanCount][6] = "$06"; //InternalPort
			G_ACLWanGroup[WanCount][7] = "$07"; //ExternalPort
            G_ACLWanGroup[WanCount][8] = "$10"; //RAclIndex
            WanCount++;
		`?>
		
	`?>
`?>

var G_ACLLanGroup = []
var LanCount = 0;

<?setvar var:num <?get :InternetGatewayDevice.X_TWSZ-COM_ACL.LACLNumberOfEntries?>?>
<?if gt $var:num 0
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_ACL.LACL. "DevPath"
	`	<?objget :InternetGatewayDevice.X_TWSZ-COM_ACL.LACL.$10.Service. "Name Enable SrcIP SrcMask Protocol InternalPort"
		`	G_ACLLanGroup[LanCount] = [];
            G_ACLLanGroup[LanCount][0] = "$11"; //DevPath: used to match wan Interface
			G_ACLLanGroup[LanCount][1] = "$01"; //Name
			G_ACLLanGroup[LanCount][2] = "$02"; //enable
			G_ACLLanGroup[LanCount][3] = "$03"; //ip
			G_ACLLanGroup[LanCount][4] = "$04"; //mask
			G_ACLLanGroup[LanCount][5] = "$05"; //protocol
			G_ACLLanGroup[LanCount][6] = "$06"; //InternalPort
            G_ACLLanGroup[LanCount][7] = "";
            G_ACLLanGroup[LanCount][8] = "$10"; //LAclIndex
			LanCount++;
		`?>
	`?>
`?>

//****************************************************

var pathIndex = '<?echo $var:pathIndex?>' == '-' ? 0 : '<?echo $var:pathIndex?>'; 

function createConnOptions(){
	var _len = G_wanConnction.length;
	var array_text = [], array_value = [];
	
	for(var i = 0; i < _len; i++){
        if ( G_wanConnction[i][0].indexOf('Bridge') > -1 ){
            continue;
        }
        array_text.push(G_wanConnction[i][0]); //Name
        array_value.push(G_wanConnction[i][1]); //Path
	}
	_len = G_lanConnction.length;
	for(var i = 0; i < _len; i++){
		array_text.push(G_lanConnction[i][0]); //Name
		array_value.push(G_lanConnction[i][1]); //Path
	}
	
	$S('SEL_connection',array_text,array_value);
}

function createTable(){
    var tmpPath = Form.Select("SEL_connection");
	if (tmpPath.indexOf("WANDevice") > 0)
	{
	//	var Num = (G_Path[pathIndex] || ',,0').split(',')[2];Num = Number(Num);
		var array_remote = [];
        var count = 0;
		var Num = G_ACLWanGroup.length
		for(var i = 0 ; i < Num; i++){
			//k = i + pathIndex*Num; //find the instance
            if (G_ACLWanGroup[i][0] == tmpPath && G_ACLWanGroup[i][1]!="DNS")
            {  
                array_remote[count] = [];
                array_remote[count].push(G_ACLWanGroup[i][1]); //Index
                array_remote[count].push('<input type="checkbox" id="Enable_' + count + '" ' + (G_ACLWanGroup[i][2] == '1' ? 'checked' : '') + ' onclick=\"ctrlEnable(' + count +')\">'); //Enable
                array_remote[count].push('<input type="text" id="IP_' + count + '"  value="' + G_ACLWanGroup[i][3] + '"' + (G_ACLWanGroup[i][2] == '1' ? '' : 'disabled') +'>'); //Ip
                array_remote[count].push('<input type="text" id="Mask_' + count + '" value="' + G_ACLWanGroup[i][4] +  '"' + (G_ACLWanGroup[i][2] == '1' ? '' : 'disabled') +'>'); //Mask
                array_remote[count].push(G_ACLWanGroup[i][5]); //Protocol
                array_remote[count].push(G_ACLWanGroup[i][6]); //InternalPort
                count++;
            }
		}
		$T('lang_AclTab',array_remote);
	}
	else
	{
		var Num = G_ACLLanGroup.length
		var array_local = [];
        var count = 0;
		for(var i = 0; i < Num; i++){
            if( G_ACLLanGroup[i][0] == tmpPath){
                array_local[count] = [];
                array_local[count].push(G_ACLLanGroup[i][1]); //Name
                array_local[count].push('<input type="checkbox" id="Enable_' + count + '" ' + (G_ACLLanGroup[i][2] == '1' ? 'checked' : '') + ' onclick=\"ctrlEnable(' + count +')\">'); //Enable
                array_local[count].push('<input type="text" id="IP_' + count + '" value="' + G_ACLLanGroup[i][3] + '"' + (G_ACLLanGroup[i][2] == '1' ? '' : 'disabled') +'>'); //Ip
                array_local[count].push('<input type="text" id="Mask_' + count + '" value="' + G_ACLLanGroup[i][4] + '"' + (G_ACLLanGroup[i][2] == '1' ? '' : 'disabled') +'>'); //Mask
                array_local[count].push(G_ACLLanGroup[i][5]); //Protocol
                array_local[count].push(G_ACLLanGroup[i][6]); //InternalPort
                count++;
            }
		}
		$T('lang_AclTab',array_local);
	}
}

function onChgIntf(select_lan){

	Table.Clear('lang_AclTab');
	createTable();
}

function ctrlEnable(index){
    _node = $('Enable_' + index,'IP_' + index,'Mask_' + index);
    if (_node[0].checked == true){
        _node[1].disabled = false;
        _node[2].disabled = false;
    }else{
        _node[1].disabled = true;
        _node[2].disabled = true;
    }
    
}

function uiOnload()
{
	createConnOptions();
	$('SEL_connection').selectedIndex = pathIndex;
	Table.Clear('lang_AclTab');
	createTable();
}

function uiSubmit()
{
    var tmpPath = Form.Select("SEL_connection");
	$H({
		"obj-action" 		: "set",
        "getpage" 		    : "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		    : G_Menu,
		"var:page" 		    : G_Page,
		"var:errorpage" 	: G_Page,
		'var:pathIndex'   	: $("SEL_connection").selectedIndex,
		'var:CacheLastData'	: ViewState.Save()
		},true);
	
	if(tmpPath != null){
           
		if (tmpPath.indexOf("WANDevice") > 0)
		{
            for (var i = 0; i < G_ACLWanGroup.length ; i++){
                if ( G_ACLWanGroup[i][0] == tmpPath ){
                    var localPath = ':InternetGatewayDevice.X_TWSZ-COM_ACL.RACL.' + G_ACLWanGroup[i][8] + '.Service.'; 
                    break;
                }
            }
	//		var localPath = ':InternetGatewayDevice.X_TWSZ-COM_ACL.RACL.' + _split[1] + '.Service.'; 
		}
		else
		{
            for (var i = 0; i < G_ACLLanGroup.length ; i++){
                if ( G_ACLLanGroup[i][0] == tmpPath ){
                    var localPath = ':InternetGatewayDevice.X_TWSZ-COM_ACL.LACL.' + G_ACLLanGroup[i][8] + '.Service.'; 
                    break;
                }
            }
		//	var localPath = ':InternetGatewayDevice.X_TWSZ-COM_ACL.LACL.' + _split[1] + '.Service.'; 
		}
        var listCount = ($("lang_AclTab").rows.length - 1);// - 1 because of one rows is title
		for(var nodeIndex = 0, _node; nodeIndex < listCount; nodeIndex++){
			_node = $('Enable_' + nodeIndex,'IP_' + nodeIndex,'Mask_' + nodeIndex);
            if (_node[1].value == "" ){
                alert(UEcode[3012]);
                uiPageRefresh();
                return;
            }
            
            if (_node[2].value == ""){
                alert(UEcode[3014])
                uiPageRefresh();
                return;
            }
			$F(localPath + (nodeIndex + 1) + '.Enable'      ,_node[0].checked ? 1 : 0);
			$F(localPath + (nodeIndex + 1) + '.SrcIP'       ,_node[1].value);
			$F(localPath + (nodeIndex + 1) + '.SrcMask'     ,_node[2].value);
		}
	}
	 
	$('uiPostForm').submit();
}

function dealWithError()
{
     if (G_Error != 1)
     { return false; }

     var arrayHint = [];

     dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,dealWithError);

