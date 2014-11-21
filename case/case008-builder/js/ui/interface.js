var interf = {
    type:"Container",
    hs:true,
    vs:true,
    horizontal:true,
    c:[
        {
            type:"Container",
            width:300,
            vs:true,
            c:[
                {
                    type:"FieldSet",
                    caption:"Component tree",
                    hs:true,
                    vs:true,
                    c:[
                        {
                            type:"Container",
                            hs:true,
                            c:[
                                {
                                    type:"Button",
                                    caption:"Add",
                                    name:"addButton"
                                }
                            ]
                        },
                        {
                            type:"TreeList",
                            name:"componentTree",
                            hs:true,
                            vs:true,
                            contextMenu:{
                                type:"PopupMenu",
                                c:[
                                    {
                                        type:"MenuItem",
                                        caption:"Add component",
                                        name:"add"
                                    },
                                    {
                                        type:"MenuItem",
                                        caption:"Remove component",
                                        name:"remove"
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    type:"PropertiesEditor",
                    caption:"Component properties",
                    name:"componentProperties",
                    hs:true,
                    vs:true
                }
            ]
        },
        {
            type:"FieldSet",
            hs:true,
            vs:true,
            caption:"Application model",
            margin:[5,5,5,5],
            c:[
                {
                    type:"Container",
                    name:"mainContainer",
                    hs:true,
                    vs:true,
                    c:[
                        {
                            type:"Button",
                            caption:"Test button",
                            hs:true
                        },
                        {
                            type:"Button",
                            caption:"Test button1",
                            hs:true
                        },
                        {
                            type:"FieldSet",
                            name:"testFS",
                            c:[
                                {
                                    type:"InputBox",
                                    width:300,
                                    name:"input1",
                                    value:"adgshfjkadjsghfadkjsf"
                                },
                                {
                                    type:"InputBox",
                                    width:300,
                                    name:"input2",
                                    value:"adgshfjkadjsghfadkjsf"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};