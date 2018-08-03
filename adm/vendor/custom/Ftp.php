<?php
namespace Custom;

/**
 * 作用：FTP操作类( 拷贝、移动、删除文件/创建目录 )
 */
class Ftp
{
    private $conn_id; // FTP连接
    private $ftp_host='123.57.67.155';
    private $ftp_port='2101';
    private $ftp_user='material';
    private $ftp_pass='jdurlen67d';

    /**
     * 初始化,当连接其他服务器ftp的时候 改变配置
     * @param $ftp_host
     * @param $ftp_port
     * @param $ftp_user
     * @param $ftp_pass
     */
    function init($ftp_host,$ftp_port,$ftp_user,$ftp_pass){
        $this->ftp_host = $ftp_host;
        $this->ftp_port = $ftp_port;
        $this->ftp_user = $ftp_user;
        $this->ftp_pass = $ftp_pass;
    }

    /**
     * 连接
     * @return bool
     */
    function connect(){
        if(!$this->conn_id = ftp_connect($this->ftp_host,$this->ftp_port))return false;
        if(!ftp_login($this->conn_id,$this->ftp_user,$this->ftp_pass))return false;
        if(!ftp_pasv($this->conn_id,1))return false; // 打开被动模拟
        return true;
    }


    /**
     * 方法：上传文件
     * @path -- 本地路径
     * @newpath -- 上传路径
     * @type -- 若目标目录不存在则新建
     */
    function up_file($path,$newpath,$type=true)
    {
        if($type) $this->dir_mkdirs($newpath);
        return ftp_put($this->conn_id,$newpath,$path,FTP_BINARY);
    }

    /**
     * 方法：生成目录
     * @path -- 路径
     */
    function dir_mkdirs($path)
    {
        $path_arr = explode('/',$path); // 取目录数组

        $file_name = array_pop($path_arr); // 弹出文件名

        $path_div = count($path_arr); // 取层数


        foreach($path_arr as $val) // 创建目录

        {
            if(@ftp_chdir($this->conn_id,$val) == FALSE)
            {
                $tmp = ftp_mkdir($this->conn_id,$val);
                if($tmp == FALSE)
                {
                    echo "目录创建失败，请检查权限及路径是否正确！";
                    exit;
                }
                ftp_chdir($this->conn_id,$val);
            }
        }
        for($i=1;$i<=$path_div;$i++) // 回退到根
        {
            ftp_cdup($this->conn_id);
        }
    }

    /**
     * 重命名文件
     * @param $oldName
     * @param $newName
     */
    function rename_file($from,$to){
        return  ftp_rename($this->conn_id,$from,$to);
    }

    /**
     * 判断ftp 上文件是否存在,用文件
     * @param $filename
     * @return bool
     */
    function file_exists($filename){
        if(ftp_size($this->conn_id,$filename) > 2 ){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 方法：移动文件
     * @path -- 原路径
     * @newpath -- 新路径
     * @type -- 若目标目录不存在则新建
     */
    function move_file($path,$newpath,$type=true)
    {
        if($type) $this->dir_mkdirs($newpath);
        return ftp_rename($this->conn_id,$path,$newpath);
    }

    /**
     * 方法：删除文件
     * @path -- 路径
     */
    function del_file($path)
    {
        return ftp_delete($this->conn_id,$path);
    }

    /**
     * 方法：关闭FTP连接
     */
    function close()
    {
        return ftp_close($this->conn_id);
    }

}

// class class_ftp end



/************************************** 测试 ***********************************

$ftp = new Ftp(); // 打开FTP连接
//$ftp->up_file('aa.txt','a/b/c/cc.txt'); // 上传文件
//$ftp->move_file('a/b/c/cc.txt','a/cc.txt'); // 移动文件
//$ftp->del_file('a/b/dd.txt'); // 删除文件
$ftp->close(); // 关闭FTP连接

 ******************************************************************************/
