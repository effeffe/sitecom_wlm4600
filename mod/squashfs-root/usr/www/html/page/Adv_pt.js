/*add javascript*/
<?mget :InternetGatewayDevice.X_TWSZ-COM_PortTrigger. "Enable NumberOfEntries MaxNumberOfEntries" `
var G_TriggerEnable		= "$01";
var G_NumberOfRules		= "$02";
var G_MaxNumberOfRules	= "$03";
`?>

//Rules
var m = 0;
var G_Rules = [];
<? if gt `<?get :InternetGatewayDevice.X_TWSZ-COM_PortTrigger.NumberOfEntries?>` 0
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_PortTrigger.TriggerList. "Enable Description TriggerProtocol TriggerStartPort TriggerEndPort OpenProtocol OpenStartPort OpenEndPort TriggerStartIP TriggerEndIP"
	`
		<?if eq $11 1
		`
			G_Rules[m] = [];
			G_Rules[m][0] = "<?echo $21?>"; //Enable
			G_Rules[m][1] = "<?echo $22?>"; //Name
			G_Rules[m][2] = "<?echo $23?>".toUpperCase(); //TriggerProtocol
			G_Rules[m][3] = "<?echo $24?>"; //TriggerStartPort
			G_Rules[m][4] = "<?echo $25?>"; //TriggerEndPort
			G_Rules[m][5] = "<?echo $26?>".toUpperCase(); //OpenProtocol
			G_Rules[m][6] = "<?echo $27?>"; //OpenStartPort
			G_Rules[m][7] = "<?echo $28?>"; //OpenEndPort
			G_Rules[m][8] = "InternetGatewayDevice.X_TWSZ-COM_PortTrigger.TriggerList.<?echo $20?>.";
			G_Rules[m][9] = "<?echo $29?>"; //TriggerStartIP
			G_Rules[m][10] = "<?echo $2a?>"; //TriggerEndIP
			m++;
		`?>
	`?>
`?>

function createTable(){
	var array_value = [];
	for(var i = 0; i < G_Rules.length; i++){
		array_value[i] = [];
		array_value[i].push(i+1); //index
		array_value[i].push(G_Rules[i][1]); //Name
		array_value[i].push(G_Rules[i][2]+":"+G_Rules[i][3] + "-" + G_Rules[i][4]); //Trigger Protocol:Trigger StartPort-EndPort
		array_value[i].push(G_Rules[i][5]+":"+G_Rules[i][6] + "-" + G_Rules[i][7]); //Open Protocol:Open StartPort-EndPort
		
		if(G_Rules[i][9]=='0.0.0.0')
			array_value[i].push('any');
		else
			array_value[i].push(G_Rules[i][9]);
		
		array_value[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="doEditEntry('+ i +')"/>'); //Edit
		array_value[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="doRemoveEntry('+ i +')"/>'); //Delete
	}
	$T('TA_pt_List',array_value);
}

function uiOnload()
{
	Form.Checkbox('CHE_pt',G_TriggerEnable);
	createTable();
}



function uiSubmit()
{
	$H({
		':InternetGatewayDevice.X_TWSZ-COM_PortTrigger.Enable': Form.Checkbox('CHE_pt'),
		'obj-action' 	: 'set',
		'var:page'		: G_Page,
		'var:menu'		: G_Menu,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'var:CacheLastData': ViewState.Save()
	});

	$('uiPostForm').submit();
}


function doEditEntry(Idx)
{
	var Path = ':' + G_Rules[Idx][8];
	var _split = Path.split('.');

	$G('/cgi-bin/webproc',{
		'var:nodeIndex'		: _split[_split.length -2],
		'var:menu'			: G_Menu,
		'var:page'			: G_Page,
		'var:subpage'		: 'Adv_add_pt',
		'getpage'			: 'html/index.html',
		'errorpage'			: 'html/index.html'
	});
	
}

function uiAdd(){
	$G('/cgi-bin/webproc',{
		'var:menu'			: G_Menu,
		'var:page'			: G_Page,
		'var:subpage'		: 'Adv_add_pt',
		'getpage'          	: 'html/index.html',
		'errorpage'        	: 'html/index.html'
	});
}

function doRemoveEntry(Idx)
{
	if(!confirm(SEcode[1001])){ return false;}
	
	$H({
		'del-obj'   : G_Rules[Idx][8],
		'obj-action': 'del',
		'var:page'  : G_Page,
		'var:menu'  : G_Menu,
		'getpage'   : 'html/index.html',
		'errorpage' : 'html/index.html',
		'var:errorpage': G_Page
	},true);
	
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);

}

addListeners(uiOnload,dealWithError);
