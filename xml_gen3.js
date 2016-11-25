
for(i=1;i<100;i++) {
	console.log('<variable name="LED %%Device'+i+'%%" sysvar="LUTRON_LED_Device'+i+'" type="boolean" condition="$NumDevices >= '+i+'" />')
}