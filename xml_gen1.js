
for(i=1;i<200;i++) {
	console.log('<setting type="string" name="Device '+i+'" variable="Device'+i+'" description="Format DEVICE_ID:BUTTON_NUMBER" condition="$NumDevices >= '+i+'" />')
}