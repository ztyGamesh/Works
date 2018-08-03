<?php



namespace app\controllers;

use app\services\BaseService;
use app\services\ConfigService;
use app\services\custom\Guid;
use app\services\MaterielService;
use app\services\PassportService;
use yii\helpers\VarDumper;

class MaterielController extends BaseController
{
    private $userPower = null;// 保存登录用户权限信息

    public function init()
    {
        parent::init();
        $this->userPower = PassportService::getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly )
    }

    /**
     * 上传文件到静态服务器，目前只用来上传视频
     */
    public function actionUploadfile()
    {
        $name_split = explode(".", $_FILES['file_data']['name']);
        $guid = Guid::factory()->create();
        $name = $guid . "." . $name_split[1];
        $destination_file = ConfigService::GetUploadPath() . $name;
        if (!move_uploaded_file($_FILES['file_data']['tmp_name'], $destination_file)) {
            return $this->jsonResponse([0, '上传失败！', null]);
        }
        $path=\Yii::$app->params['exec_path'];
        $exists=shell_exec("{$path}/ffprobe -v 2>&1");
        if (!$exists){
            return $this->jsonResponse([0, '请先安装ffmpeg', null]);
        }
        $info=shell_exec("{$path}/ffprobe -v quiet -print_format json -show_format -show_streams $destination_file");
        $info=json_decode($info,true);
        if (!$info){
            return $this->jsonResponse([0, '视频格式识别失败', null]);
        }
        $width=0;
        $height=0;
        foreach ($info['streams'] as $stream){
            if (isset($stream['width'])){
                $width=$stream['width'];
                $height=$stream['height'];
            }
        }
        MaterielService::sendImage($destination_file, $name);
        return $this->jsonResponse([1, null, compact('name','width','height')]);
    }

    /**
     * 上传图片
     * @return mixed|null
     */
    public function actionUploadimagewithdetail()
    {
        $data = BaseService::ExecuteWithoutTransaction(function () {
            $tmp_file = $_FILES['file_data']['tmp_name'];
            $file_type=$_FILES['file_data']['type'];
            $image_info = getimagesize($tmp_file);
            $file_size = filesize($tmp_file);
            if (!$image_info) {
                throw new \Exception('获取图片尺寸信息失败！');
            }
            if (!$file_size) {
                throw new \Exception('获取图片大小信息失败！');
            }
            $maxSizeKb=400;
            if ($file_type==='image/gif'){
                $maxSizeKb=2000;
            }
            if (($file_size / 1024) > $maxSizeKb) {
                throw new \Exception("图片尺寸不可超过{$maxSizeKb}kb！");
            }
            $name_split = explode(".", $_FILES['file_data']['name']);
            $guid = Guid::factory()->create();
            $name = $guid . "." . $name_split[1];
            $destination_file = ConfigService::GetUploadPath() . $name;
            if (!move_uploaded_file($_FILES['file_data']['tmp_name'], $destination_file)) {
                return $this->jsonResponse([0, '上传失败！', null]);
            }
            \Yii::info("file uploaded to {$destination_file}");
            if (!YII_ENV_DEV) {
                MaterielService::sendImage($destination_file, $name);
            }
            return ['name' => $name, 'width' => $image_info[0], 'height' => $image_info[1], 'size' => ($file_size / 1024)];
        });
        return $this->jsonResponse($data);
    }
}
