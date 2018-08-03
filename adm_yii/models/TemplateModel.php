<?php

namespace app\models;

class TemplateModel extends BaseModel
{
    protected static $table = 'template';

    // 信息流样式
    const FEEDS_STYLES = [
        '文字链模板' => '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0',
        '视频+文字模板' => '4d918595-d2a1-47c7-8e4a-012f28ddd96e',
        '组图模板' => '6684515c-3b6d-40f5-969c-d137c3913aab',
        '大图+文字模板' => '7c44a357-ecd0-4c5b-80d0-db8bd5100149',
        '图文模板' => '7e1199fd-de4d-469f-8778-5de1268cddea',
        '视频模板' => 'b2826850-b106-4cde-8a7c-d1d08dfaec7a',
        '大图模板' => 'c0bb62fe-fc21-4b0b-a5c7-d547db667032',
    ];


}
