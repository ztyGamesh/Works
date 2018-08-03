<?php

return [
    'adm_upload_path' => '/tmp/uploads/',
    'split_path' => 'http://59.110.113.126/cgi-bin/segmentation.py?word=',
    'batch_split_path' => 'http://59.110.113.126/cgi-bin/batch_segmentation.py?word=',
    'static_server' => 'http://static.adm.deepleaper.com/material/',
    /**
     * 字典相关的配置
     */
    'tag'=>[
        'dict_id' => '101',
        'dict_name' => '广告行业标签字典',
        'tag_file' => '@webroot/tag/tag_data.csv',
    ],
    'email'=>[
        /**
         * 新建广告位发邮件
         */
        'slot'=>[
            'to'=>'xueleixi@deepleaper.com',
            'title'=>'广告位新建邮件通知',
        ],
    ],
    'redis'=>[
        'slot_created_queue'=>'ssp.mail.slot',//新建广告位队列名称
    ],
    'exec_path'=>'/usr/local/bin',
    'admin_uid'=>'4fc68ee9-f239-4440-a36c-d17ef402asdx',//测试
    'oppo'=>[//test env
        'dspId'=>'29',
        'key'=>'44bc5d70c6954793b92203c3f2f3c7db',
        'uid'=>'d49d1988-bc74-495e-98b2-9e9b0570a0e5',//user.uid 测试
        'creative_submit_url' =>'http://183.131.22.111/dsp/creative/submit',
        'creative_query_url'  =>'http://183.131.22.111/dsp/creative/query',
    ],
    'logDir'=>null,
];
