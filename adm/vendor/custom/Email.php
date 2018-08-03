<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/5/9
 * Time: 15:10
 */

namespace Custom;


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
        if ($mail->Send()){
            return true;
        }else{
            return $mail->errorMessage();
        }
    }
}