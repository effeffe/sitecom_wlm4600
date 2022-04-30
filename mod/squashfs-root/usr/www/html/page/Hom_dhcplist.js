/*  JavaScript Document:dhcplist */
var LanHosts = [];
var m = 0;
<?objget :InternetGatewayDevice.LANDevice. "Hosts.HostNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.LANDevice.$20.Hosts.Host. "HostName MACAddress IPAddress LeaseTimeRemaining VendorClassID AddressSource"
             `	<?if eq `DHCP` `<?echo $26?>` 	
		`	LanHosts[m] = [];
			LanHosts[m][0] = m+1;
			LanHosts[m][1] = "<?echo $21?>";
			LanHosts[m][2] = "<?echo $22?>";
			LanHosts[m][3] = "<?echo $23?>";
			LanHosts[m][4] = "<?echo $24?>";
			++m;
			`?>
		`?>
	`?>
`?>

function uiOnload(){	
	$T('ta_dhcplist',LanHosts);
}

addListeners(uiOnload);