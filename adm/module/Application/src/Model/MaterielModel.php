<?php
namespace Application\Model;


class MaterielModel
{
    public static function factory()
    {
        return new self();
    }

    public static function sendImage($source_file, $filename)
    {
        $ftp_server = "101.201.252.39";
        $ftp_user = "material";
        $ftp_pass = "Cw92oxqs71";
        $ftp_port = "2100";

        // set up a connection or die
        $conn_id = ftp_connect($ftp_server, $ftp_port) or die("Couldn't connect to $ftp_server");

        $login_result = ftp_login($conn_id, $ftp_user, $ftp_pass);
        ftp_pasv($conn_id, 1); // 打开被动模拟

        if ((!$conn_id) || (!$login_result)) {
            echo "FTP connection has failed!";
            echo "Attempted to connect to $ftp_server for user $ftp_user";
            exit;
        }
        $destination_file = "./" . $filename;  //目标地址
        $upload = ftp_put($conn_id, $destination_file, $source_file, FTP_BINARY)or die("Couldn't connect to $ftp_server");
        ftp_quit($conn_id);
    }
}

