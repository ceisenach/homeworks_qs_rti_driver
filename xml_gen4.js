
for(i=1;i<100;i++) {
	console.log('<function name="Set LED %%Device'+i+'%% State Variable to True" export="SetDeviceLEDStateTrue:Device'+i+'" repeatrate="0" condition="$NumDevices >= '+i+'" >')
	console.log('\t<parameter name="DeviceID" type="string" default="%%Device'+i+'%%" hidden="true" />')
	console.log('</function>')
	console.log('<function name="Set LED %%Device'+i+'%% State Variable to False" export="SetDeviceLEDStateFalse:Device'+i+'" repeatrate="0" condition="$NumDevices >= '+i+'" >')
	console.log('\t<parameter name="DeviceID" type="string" default="%%Device'+i+'%%" hidden="true" />')
	console.log('</function>')
}