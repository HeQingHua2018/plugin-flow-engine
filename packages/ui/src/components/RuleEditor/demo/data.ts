export default {
    "fields":[
        {
            "key":"c1",
            "type":"string",
            "label":"文本",
            "fieldName":"text",
        },
        {
            "key":"c2",
            "type":"date",
            "label":"日期",
            "fieldName":"date",
            "props": {
                "format": "YYYY-MM-DD HH:mm:ss"
            }
        },
        {
            "fieldName": "df_2",
            "label": "申请日期",
            "type": "date",
            "key": "23E97C77AE9C4E9D95DAA6E66BCCD40B",
            "props": {
                "format": "yyyy-MM-dd HH:mm"
            }
        },
        {
            "key":"c3",
            "type":"number",
            "label":"数字",
            "fieldName":"number"
        },
        {
            "key":"c4",
            "type":"date",
            "label":"日期范围-开始",
            "fieldName":"daterangestart"
        },
        {
            "key":"c5",
            "type":"date",
            "label":"日期范围-结束",
            "fieldName":"daterangeend"
        },
        {
            "key":"c6",
            "type":"number",
            "label":"数字范围-开始",
            "fieldName":"numberrangestart"
        },
        {
            "key":"c7",
            "type":"number",
            "label":"数字范围-结束",
            "fieldName":"numberrangeend"
        },
        {
            "key":"c9",
            "type":"array",
            "label":"复选框",
            "fieldName":"checkbox",
            "props":{
                "options": [{"value": '1',"label":"可选值1"},{"value": '2',"label":"可选值2"}]
            },
        },
        {
            "key":"c10",
            "type":"array",
            "label":"单选框",
            "fieldName":"radio",
            "props":{
                "options": [{"value": '1',"label":"可选值1"},{"value": '2',"label":"可选值2"}]
            },
        },
        {
            "key":"c11",
            "type":"array",
            "label":"下拉列表-多选",
            "fieldName":"selectmulti",
            "props":{
                "multi": true,
                "options": [{"value": '1',"label":"可选值1"},{"value": '2',"label":"可选值2"}]
            },
        },
        {
            "key":"c12",
            "type":"array",
            "label":"下拉列表-单选",
            "fieldName":"select",
            "props":{
                "options": [{"value": '3',"label":"可选值3"},{"value": '4',"label":"可选值4"}]
            },
        },
        {
            "key":"c13",
            "type":"array",
            "label":"树形下拉-单选",
            "fieldName":"tree",
            "props": {
                "treeData": true,
                "options": [
                    {
                        "label": "选项1", "value": "1", 
                        "children": [
                            { "label": "选项1.1", "value": "11" },
                            { "label": "选项1.2", "value": "12" }
                        ]
                    }, 
                    { "label": "选项2", "value": "2" }
                ]
            }
        },
        {
            "key":"c14",
            "type":"array",
            "label":"树形下拉-多选",
            "fieldName":"treemulti",
            "props": {
                "treeData": true,
                "multi": true,
                "options": [
                    {
                        "label": "选项1", "value": "1", 
                        "children": [
                            { "label": "选项1.1", "value": "11" }
                        ]
                    }, 
                    { "label": "选项2", "value": "2" }
                ]
            }
        },
        {
            "key":"c15",
            "type":"array",
            "label":"复选框组",
            "fieldName":"checkboxs",
            "props":{
                "multi": true,
                "options": [{"value": '1',"label":"可选值1"},{"value": '2',"label":"可选值2"}]
            }
        },
        // {
        //     "key":"file",
        //     "type":"file",
        //     "label":"附件",
        //     "fieldName":"file"
        // },
        // {
        //     "key":"code",
        //     "type":"code",
        //     "label":"代码编辑",
        //     "fieldName":"code"
        // },
        // {
        //     "key":"richtext",
        //     "type":"richtext",
        //     "label":"富文本",
        //     "fieldName":
        //     "richtext"
        // },
        // {
        //     "key":"textarea",
        //     "type":"textarea",
        //     "label":"多行文本",
        //     "fieldName":"textarea"
        // },
        // {
        //     "key":"switch",
        //     "type":"switch",
        //     "label":"开关",
        //     "fieldName":"switch",
        //     "options": [{"value": 1,"label":"是"},{"value": 0,"label":"否"}]
        // },
    ],
    "rules": {
        "key": "C053219D564646448DF89DF141E6F604",
        "type": "group",
        "link": "and",
        "children": [
            {
                "key": "B0C57D815ED5422C91862A6ACFE747EE",
                "type": "rule",
                "field": "c1",
                "rule": "eq",
                "value": [
                    "test"
                ],
                "fieldType": "string",
                "valueType": "string",
                "fieldName": "text",
                "desc": "文本等于test"
            },
            {
                "key": "6A3B6339201F4B9684B19E2A4FF67901",
                "type": "rule",
                "field": "c2",
                "rule": "eq",
                "value": [
                    "2025-09-11"
                ],
                "fieldType": "date",
                "valueType": "date",
                "fieldName": "date",
                "desc": "日期等于2025-09-11"
            },
            {
                "key": "587EA78A242543CE83F45EC78703F99A",
                "type": "rule",
                "field": "c2",
                "rule": "between",
                "value": [
                    "2025-09-11",
                    "2025-10-31"
                ],
                "fieldType": "date",
                "valueType": "date",
                "fieldName": "date",
                "desc": "日期范围内2025-09-11~2025-10-31"
            },
            {
                "key": "E65DB844E92449729C6E6C1CF0E6C7CE",
                "type": "group",
                "link": "and",
                "children": [
                    {
                        "key": "F0AB4E3BF90845498F7EB9F56BEA564E",
                        "type": "rule",
                        "field": "c9",
                        "rule": "eq",
                        "value": [
                            "1"
                        ],
                        "fieldType": "array",
                        "valueType": "array",
                        "fieldName": "checkbox",
                        "desc": "复选框等于可选值1"
                    },
                    {
                        "key": "2981CCF6921B463FA98B1CA1558D0109",
                        "type": "rule",
                        "field": "c10",
                        "rule": "ne",
                        "value": [
                            "1"
                        ],
                        "fieldType": "array",
                        "valueType": "array",
                        "fieldName": "radio",
                        "desc": "单选框不等于可选值1"
                    },
                    {
                        "key": "7A4C034D073A45FD919CC10D079555E7",
                        "type": "rule",
                        "field": "c11",
                        "rule": "like",
                        "value": [
                            "1"
                        ],
                        "fieldType": "array",
                        "valueType": "array",
                        "fieldName": "selectmulti",
                        "desc": "下拉列表-多选包含可选值1"
                    },
                    {
                        "key": "2E088CB4D92A43C998438CC423F74EF7",
                        "type": "rule",
                        "field": "c13",
                        "rule": "eq",
                        "value": [
                            "1"
                        ],
                        "fieldType": "array",
                        "valueType": "array",
                        "fieldName": "tree",
                        "desc": "树形下拉-单选等于选项1"
                    },
                    {
                        "key": "6F1C344CA1534E0BA93D3F3DA0C1115C",
                        "type": "rule",
                        "field": "c15",
                        "rule": "like",
                        "value": [
                            "1"
                        ],
                        "fieldType": "array",
                        "valueType": "array",
                        "fieldName": "checkboxs",
                        "desc": "复选框组包含可选值1"
                    }
                ]
            }
        ]
    },
    "updateRules": {
        "key": "441E955AB6E24C4E8A213EBDED8F6498",
        "type": "group",
        "link": "and",
        "children": [
            {
                "key": "3858841945F59925BEA6BFF015961234",
                "type": "rule",
                "field": "c1",
                "rule": "eq",
                "value": [
                    "结尾不是"
                ],
                "fieldType": "string",
                "valueType": "string",
                "fieldName": "text",
                "desc": "文本等于结尾不是"
            },
            {
                "key": "F907617C1FBF46FA8476704F7038F501",
                "type": "rule",
                "field": "c2",
                "rule": "between",
                "value": [
                    "2025-09-09",
                    "2025-10-09"
                ],
                "fieldType": "date",
                "valueType": "date",
                "fieldName": "date",
                "desc": "日期范围内2025-09-09~2025-10-09"
            }
        ]
    }
    /**
     * 规则数据，由组件生成，初始创建时无需传入
     */
    // "rules": {
    //     "key": "A1E38DF0BAC0452E9807D86F56FC7ADB",
    //     "type": "group",
    //     "link": "and",
    //     "children": [
    //         { 
    //             "key": "C60462F9C2BA4EC0BA2FAC3B78EC7C63", // 组件自动生成
    //             "type": "rule", // 组件自动生成
    //             "fieldName": "text", // 字段key，即fields中字段key
    //             "rule": "eq", // 匹配规则
    //             "value": ["等于" ]  // 值格式必须为数组，数组中可以是对象，可以是字符、数字等
    //         },
    //     ]
    // }
}
