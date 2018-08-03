<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/5/9
 * Time: 15:10
 */

namespace app\services\custom;


class Email
{
    public static function send_email($to, $title, $contents, $type = '', $accessory = '')
    {
        $mail = new \PHPMailer(true);
        $mail->IsSMTP();
        $mail->CharSet = "UTF-8";//编码
        $mail->Debugoutput = 'html';// 支持HTML格式
        $mail->Host = "smtp.exmail.qq.com";//HOST 地址
        $mail->Port = 25;//端口
        $mail->SMTPAuth = true;
        $mail->Username = "service@deepleaper.com";//用户名
        $mail->Password = "1qaz@WSX";//密码
        $mail->SetFrom("service@deepleaper.com", "跃盟科技");//发件人地址, 发件人名称
        $mail->AddAddress($to);//收信人地址
        //$mail->Subject = "=?utf-8?B?" . base64_encode() . "?=";
        if (!empty($type)) {
            $mail->AddAttachment($type, $accessory); // 添加附件,并指定名称
        }
        $mail->Subject = $title;//邮件标题
        $mail->MsgHTML($contents);
        if ($mail->Send()) {
            return true;
        } else {
            $errorMessage = $mail->errorMessage();
            \Yii::error("send mail error:{$errorMessage}");
            return $errorMessage;
        }
    }

    /**
     * 把邮件添加到消息队列
     * @param $to
     * @param $title
     * @param $content
     */
    public static function addMailToQueue($to, $title, $content)
    {
        $queue = \Yii::$app->params['redis']['slot_created_queue'];
        $redis = \Yii::$app->redis;
        $time=time();
        $ret = $redis->rpush($queue, json_encode(compact('time','to', 'title', 'content'),JSON_UNESCAPED_UNICODE));
        if (!$ret){
            \Yii::error("addMailToQueue error");
        }
        return $ret;

    }
}