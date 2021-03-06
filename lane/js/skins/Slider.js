/*
 * Box element properties
 * @@@dependsOn: BoxElement
 * @@@dependsOn: FormElement
 * @@@nameSuffix:Skin
 */
var SliderSkin = {};
SliderSkin.def = {
	horizontal:true,
	cursor:"pointer",
	c:[
	   {
		   name:"caption"
	   },
	   {
		   height:18,
		   hs:true,
		   name:"sliderContainer",
		   vAlign:BoxElement.ALIGN.middle,
		   c:[
				{
					   name:"slider",
					   width:18,
					   height:18,
					   borderWidth:[1,1,1,1],
					   borderRadius:[3,3,3,3],
					   borderColor:"#dddddd",
					   backgroundColor:"#eeeeee",
					   zIndex:1
				},
				{
					   hs:true,
					   height:10,
					   borderWidth:[1,1,1,1],
					   borderRadius:[2,2,2,2],
					   borderColor:"#dddddd",
					   backgroundColor:"#eeeeee"
				}
		   ]   
	   }
	  ]
};