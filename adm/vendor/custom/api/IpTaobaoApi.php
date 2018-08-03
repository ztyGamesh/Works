<?php
namespace Custom\api;
/**
 * Description of IpTaobaoApi
 * @refer:  http://ip.taobao.com/instructions.php
 * @demo:   http://ip.taobao.com/service/getIpInfo.php?ip=118.67.127.168
 * @return: {"code":0,"data":{"country":"\u4e2d\u56fd","country_id":"CN","area":"\u534e\u5317","area_id":"100000","region":"\u5317\u4eac\u5e02","region_id":"110000","city":"\u5317\u4eac\u5e02","city_id":"110100","county":"","county_id":"-1","isp":"","isp_id":"-1","ip":"118.67.127.168"}}
 * 
 */
class IpTaobaoApi {
    //put your code here
    private static $_requestURL = 'http://ip.taobao.com/service/getIpInfo.php?ip=[ip]';
    
    /**
     * @demo: IpTaobaoApi::getAddress('118.67.127.168');
     */
    public static function getAddress( $ip, $glue=''){
        $info = self::getIpInfo($ip, false);
        
        $address = array();
        if ( !empty($info) ){
            if(!empty($info['city'])) $address[] = $info['city'];
            if(!empty($info['region'])) $address[] = $info['region'];
            if(!empty($info['country']) && count($address) < 2) {
                $address[] = $info['country'];
            }
            krsort($address);
        }
        $glue = strlen($glue) < 1 ? ',' : $glue;
        return implode( $glue, $address);
    }


    /**
     * @return json
     * @param return param ,'code'：0正常，1失败
     */
    public static function getIpInfo( $ip, $json=false ) {
        $long = ip2long($ip);
        if ( $long === 0 ){
            trigger_error('ip address error', E_USER_NOTICE);
        }
        $ip = long2ip($long);
        $url = str_replace('[ip]', $ip, self::$_requestURL);
        
        $info = self::curlRequest($url);
//        $info = '{"code":0,"data":{"country":"\u4e2d\u56fd","country_id":"CN","area":"\u534e\u5317","area_id":"100000","region":"\u5317\u4eac\u5e02","region_id":"110000","city":"\u5317\u4eac\u5e02","city_id":"110100","county":"","county_id":"-1","isp":"","isp_id":"-1","ip":"118.67.127.168"}}';
        $info = json_decode($info);

        if ($info->code === 0) {
            return $json!=false ? json_encode($info->data) : (array)$info->data;
        }
        return false;
    }
    
    protected static function curlRequest($url, $timeout=3){

        if (0 == (int)$timeout || empty($url))
            return false;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);

        $content = curl_exec($ch);
        curl_close($ch);

        return $content;
    }
    
}

