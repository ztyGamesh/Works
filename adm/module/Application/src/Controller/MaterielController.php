<?php

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Application\Controller;

use Application\Model\BaseModel;
use Application\Model\ConfigModel;
use Application\Model\MaterielModel;
use Application\Model\PassportModel;

class MaterielController extends BaseController
{
    private $userPower = null;// 保存登录用户权限信息

    public function __construct()
    {
        $this->userPower = PassportModel::factory()->getLoginUser(true);//Array ( [uid] => root [name] => 杰子 [mail] => jettz@139.com [power] => admin [pid] => [internal] => 1 [permission] => readonly ) 
    }

    /**
     * 上传文件到静态服务器
     */
    public function uploadfileAction()
    {
        $name_split = explode(".", $_FILES['file_data']['name']);
        $guid = \Custom\Guid::factory()->create();
        $name = $guid . "." . $name_split[1];
        $destination_file = ConfigModel::factory()->GetUploadPath() . $name;
        if (!move_uploaded_file($_FILES['file_data']['tmp_name'], $destination_file)) {
            self::ajax_json([0, '上传失败！', null]);
        }
        MaterielModel::sendImage($destination_file, $name);
        self::ajax_json([1, null, $name]);
    }

    public function uploadimagewithdetailAction()
    {
        $data = BaseModel::ExecuteWithoutTransaction(function () {
            $image_info = getimagesize($_FILES['file_data']['tmp_name']);
            $file_size = filesize($_FILES['file_data']['tmp_name']);
            if (!$image_info) {
                throw new \Exception('获取图片尺寸信息失败！');
            }
            if (!$file_size) {
                throw new \Exception('获取图片大小信息失败！');
            }
            if (($file_size / 1024) > 400) {
                throw new \Exception('图片尺寸不可超过400kb！');
            }
            $name_split = explode(".", $_FILES['file_data']['name']);
            $guid = \Custom\Guid::factory()->create();
            $name = $guid . "." . $name_split[1];
            $destination_file = ConfigModel::factory()->GetUploadPath() . $name;
            if (!move_uploaded_file($_FILES['file_data']['tmp_name'], $destination_file)) {
                self::ajax_json([0, '上传失败！', null]);
            }
            MaterielModel::sendImage($destination_file, $name);
            return ['name' => $name, 'width' => $image_info[0], 'height' => $image_info[1], 'size' => ($file_size / 1024)];
        });
        self::ajax_json($data);
    }
}
