/*
 * Box element properties
 * @@@dependsOn: BoxElement
 * @@@dependsOn: FormElement
 * @@@name:CheckBoxSkin
 */
var CheckBoxSkin = {};
CheckBoxSkin.def = {
	horizontal:true,
	cursor:"pointer",
	c:[
	   {
		   name:"caption"
	   },
	   {
		   margin:[0,0,0,3],
		   name:"img",
		   backgroundImage:"img/CheckBox/no.png",
		   width:16,
		   height:16,
		   vAlign:BoxElement.ALIGN.middle
	   }
	  ]
};