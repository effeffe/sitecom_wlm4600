
//IC_SAMBA
<?mget :InternetGatewayDevice.X_TWSZ-COM_KC_SAMBA. "USBMode Workgroup NetbiosName Newpassword USBEnable"
`	var G_SambaEnable 		= "$01";
	var G_Workgroup			= "$02";
	var G_NetbiosName 		= "$03";
	var G_Newpassword 		= "$04";
	var G_USBEnable    		= "$05";
`?>

function uiOnload(){
	setJSONValue({
		'RAD_smb'               : G_SambaEnable,
		'INPUT_Workgroup'       : G_Workgroup,
		'INPUT_ServerName'      : G_NetbiosName,
        'INPUT_NewSMBPasswd'    : G_Newpassword,
        'INPUT_RNewSMBPasswd'   : G_Newpassword
	//	'INPUT_USBEnable'       : G_USBEnable
	});
    $("smbMain").style.display      ="block";
	doSMBActive();
}

function doSMBActive(){
	
	if(Form.Radio('RAD_smb') == 'NetUSB')
	{
        $('smbMain').style.display         = "none";
	}
	else
	{
        $('smbMain').style.display         = "";
    }        
}

function uiSubmit(){
    if($('INPUT_NewSMBPasswd').value != $('INPUT_RNewSMBPasswd').value){
		alert(SEcode[1010]);
		return false;
	}
    

    $H({
        'getpage'           :'html/index.html',
		'errorpage'         :'html/index.html',
		'var:menu'          :G_Menu,
		'var:page'          :G_Page,
		'var:errorpage'     :G_Page,
		':InternetGatewayDevice.X_TWSZ-COM_KC_SAMBA.USBMode'       : Form.Radio('RAD_smb'),
		':InternetGatewayDevice.X_TWSZ-COM_KC_SAMBA.Workgroup'     : $('INPUT_Workgroup').value,
		':InternetGatewayDevice.X_TWSZ-COM_KC_SAMBA.NetbiosName'   : $('INPUT_ServerName').value,
		'obj-action'        : 'set'
	});
    
    if($('INPUT_NewSMBPasswd').value != ''){
        $F(':InternetGatewayDevice.X_TWSZ-COM_KC_SAMBA.Newpassword', $('INPUT_NewSMBPasswd').value);
    }
    if( Form.Radio('RAD_smb') == '1' ){
        $F(':InternetGatewayDevice.X_TWSZ-COM_KC_SAMBA.Workgroup',   $('INPUT_Workgroup').value);
        $F(':InternetGatewayDevice.X_TWSZ-COM_KC_SAMBA.NetbiosName', $('INPUT_ServerName').value);
    }

    $('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,dealWithError);

