<?php

namespace app\models;

class SlotModel extends BaseModel
{
    protected static $table = 'slot';


    protected static $valid = 'is_deleted';

    const COOPERATE_MODE = [
        '固定价格' => 0,
        '分成' => 1,
        '底价+分成' => 2,
        '技术服务费' => 3,
        '公开竞价' => 4,
        'cpm合约' => 5
    ];

    /**
     * 广告位形式
     */
    public static $formats = [
        [
            'name' => '信息流',//实际为动态信息流
            'uid' => '29076f0d-a923-47d4-bfef-2e3cf28fc099',
            'styles' => [
                ['name' => '大图模板', 'uid' => 'c0bb62fe-fc21-4b0b-a5c7-d547db667032'],
                ['name' => '视频模板', 'uid' => 'b2826850-b106-4cde-8a7c-d1d08dfaec7a'],
                ['name' => '图文模板', 'uid' => '7e1199fd-de4d-469f-8778-5de1268cddea'],
                ['name' => '大图+文字模板', 'uid' => '7c44a357-ecd0-4c5b-80d0-db8bd5100149'],
                ['name' => '组图模板', 'uid' => '6684515c-3b6d-40f5-969c-d137c3913aab'],
                ['name' => '视频+文字模板', 'uid' => '4d918595-d2a1-47c7-8e4a-012f28ddd96e'],
                ['name' => '文字链模板', 'uid' => '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0'],
            ]
        ],
        [
            'name' => '开屏',
            'uid' => '987b7cd8-2752-4a15-bc94-6c0a2764a5c4',
            'styles' => [
                ['name' => '静态开屏', 'uid' => '8be1afb6-8d5c-4be9-917d-5d187ae03a48'],
                ['name' => '动态开屏', 'uid' => '876de12b-5e92-41da-a4a3-2f9fa33eda33'],
                ['name' => '视频开屏', 'uid' => '7d42ec85-5533-4390-9338-84bfb0f725b5'],
            ]
        ],
        [
            'name' => '横幅',
            'uid' => '7b62026a-23aa-4592-836a-f4ee78f7ea2e',
            'styles' => [
                ['name' => '纯图', 'uid' => 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318'],
                ['name' => '图文', 'uid' => '3fc13471-36a1-4dfc-abde-98c364e78e2e'],
            ]
        ],
        [
            'name' => '插屏',
            'uid' => '5b3e416f-d93a-4632-87de-5d4fbcc942fb',
            'styles' => [
                ['name' => '纯图', 'uid' => '5e0e3da8-e3cc-4330-a409-ee7263a08711'],
            ]
        ],

    ];

}
