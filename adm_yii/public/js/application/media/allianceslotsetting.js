/**
 * 广告位配置页面，新增或修改广告位。根据广告形式的不同，显示相应模板的配置信息
 * @param adId：传入广告形式ID
 *
 * Demo：
 * var htmlDetail = slotDetailSetting($(this).val());
 *$("#setting-detail").html(htmlDetail);
 *$(".selectpicker").selectpicker({//初始化});
 *
 * */

function slotDetailSetting(adId) {
    switch (adId)
     {
        case '29076f0d-a923-47d4-bfef-2e3cf28fc099':
            return(
                "<!--大图模板-->"+
                "                            <div class=\"panel panel-default\" id=\"c0bb62fe-fc21-4b0b-a5c7-d547db667032\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_img\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_img\">"+
                "                                        <span class=\"collapse－switch\"></span>大图样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_img\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row\">"+
                "                                        <div class=\"row\">"+
                "                                            <div class=\"form-group \">"+
                "                                                <label"+
                "                                                        class=\"col-md-2 col-md-offset-1 control-label Dl-required\">素材尺寸</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"selectpicker\" data-width=\"100%\"  data-size=\"8\" dl-data=\"scale\">"+
                "                                                        <option value=\"16_9\" selected>"+
                "                                                            16:9&nbsp;&nbsp;&nbsp;720*405"+
                "                                                        </option>"+
                "                                                        <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;800*600</option>"+
                "                                                        <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>"+
                "                                                        <option value=\"8_1\">8:1&nbsp;&nbsp;&nbsp;800*100</option>"+
                "                                                        <option value=\"4_1\">4:1&nbsp;&nbsp;&nbsp;800*200</option>"+
                "                                                        <option value=\"6_1\">6:1&nbsp;&nbsp;&nbsp;900*150</option>"+
                "                                                        <option value=\"3_1\">3:1&nbsp;&nbsp;&nbsp;720*240</option>"+
                "                                                        <option value=\"32_5\">32:5&nbsp;&nbsp;&nbsp;640*100</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                                <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--视频模板-->"+
                "                            <div class=\"panel panel-default\" id=\"b2826850-b106-4cde-8a7c-d1d08dfaec7a\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_video\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_video\">"+
                "                                        <span class=\"collapse－switch\"></span>视频样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_video\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row\">"+
                "                                        <div class=\"form-group \">"+
                "                                            <label"+
                "                                                    class=\"col-md-2 col-md-offset-1 control-label Dl-required\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"selectpicker\" data-width=\"100%\" data-size=\"8\"  dl-data=\"scale\">"+
                "                                                    <option value=\"16_9\" selected>16:9&nbsp;&nbsp;&nbsp;720*405"+
                "                                                    </option>"+
                "                                                    <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;800*600</option>"+
                "                                                    <!--                                                        <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>-->"+
                "                                                    <!--                                                        <option value=\"8_1\">8:1&nbsp;&nbsp;&nbsp;800*100</option>-->"+
                "                                                    <!--                                                        <option value=\"4_1\">4:1&nbsp;&nbsp;&nbsp;800*200</option>-->"+
                "                                                    <!--                                                        <option value=\"6_1\">6:1&nbsp;&nbsp;&nbsp;900*150</option>-->"+
                "                                                    <!--                                                        <option value=\"3_1\">3:1&nbsp;&nbsp;&nbsp;720*240</option>-->"+
                "                                                    <!--                                                        <option value=\"32_5\">32:5&nbsp;&nbsp;&nbsp;640*100</option>-->"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--大图+文字模板-->"+
                "                            <div class=\"panel panel-default\" id=\"7c44a357-ecd0-4c5b-80d0-db8bd5100149\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_imgAndChar\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_imgAndChar\">"+
                "                                        <span class=\"collapse－switch\"></span>大图+文字样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_imgAndChar\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker dl-notNull\""+
                "                                                        data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"4_3\" selected>4:3&nbsp;&nbsp;&nbsp;800*600"+
                "                                                    </option>"+
                "                                                    <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>"+
                "                                                    <option value=\"2_1\">2:1&nbsp;&nbsp;&nbsp;600*300  640*320</option>"+
                // "                                                    <option value=\"2_1\">2:1&nbsp;&nbsp;&nbsp;640*320</option>"+
                "                                                    <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;720*405</option>"+
                "                                                    <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;640*360</option>"+

                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group hidden\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--        awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"saweslotaddview-awesome-checkbox01\""+
                "                                                               type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               class=\"Dl-checkbox\" value=\"static_pic\""+
                "                                                               dl-data=\"static_pic\" checked>"+
                "                                                        <label for=\"awesome-checkbox01\">"+
                "                                                        </label>"+
                "                                                        静态(JPG,PNG,GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--     awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox02\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               class=\"Dl-checkbox\" value=\"dynamic_pic\""+
                "                                                               dl-data=\"dynamic_pic\" checked>"+
                "                                                        <label for=\"awesome-checkbox02\">"+
                "                                                        </label>"+
                "                                                        动态(GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\"  data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--视频+文字模板-->"+
                "                            <div class=\"panel panel-default\" id=\"4d918595-d2a1-47c7-8e4a-012f28ddd96e\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_videoAndChar\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_videoAndChar\">"+
                "                                        <span class=\"collapse－switch\"></span>视频+文字样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_videoAndChar\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker dl-notNull\""+
                "                                                        dl-data=\"scale\">"+
                "                                                    <option value=\"4_3\" selected>4:3&nbsp;&nbsp;&nbsp;800*600"+
                "                                                    </option>"+
                "                                                    <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;720*405</option>"+
                "                                                    <!--                                                        <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>-->"+
                "                                                    <!--                                                        <option value=\"2_1\">2:1&nbsp;&nbsp;&nbsp;600*300</option>-->"+
                "                                                    <!--                                                        <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;1280*720</option>-->"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                // "                                        <div class=\"form-group hidden\">"+
                // "                                            <label for=\"\""+
                // "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                // "                                            <div class=\"col-md-7\">"+
                // "                                                <div class=\"checkbox\">"+
                // "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                // "                                                        <input id=\"slotaddview-awesome-checkbox07\" type=\"checkbox\""+
                // "                                                               class=\"Dl-checkbox\" name=\"format\""+
                // "                                                               class=\"Dl-checkbox\" value=\"static_pic\""+
                // "                                                               dl-data=\"static_pic\" checked>"+
                // "                                                        <label for=\"slotaddview-awesome-checkbox07\">"+
                // "                                                        </label>"+
                // "                                                        静态(JPG,PNG,GIF)"+
                // "                                                    </div>"+
                // "                                                </div>"+
                // "                                                <div class=\"checkbox\">"+
                // "                                                    <!--     awesome checkbox     -->"+
                // "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                // "                                                        <input id=\"slotaddview-awesome-checkbox08\" type=\"checkbox\""+
                // "                                                               class=\"Dl-checkbox\" name=\"format\""+
                // "                                                               class=\"Dl-checkbox\" value=\"dynamic_pic\""+
                // "                                                               dl-data=\"dynamic_pic\" checked>"+
                // "                                                        <label for=\"slotaddview-awesome-checkbox08\">"+
                // "                                                        </label>"+
                // "                                                        动态(GIF)"+
                // "                                                    </div>"+
                // "                                                </div>"+
                // "                                            </div>"+
                // "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">视频素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"video_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!-- awesome checkbox                                                       -->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox09\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"mp4\""+
                "                                                               dl-data=\"format\" disabled checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox09\">"+
                "                                                        </label>"+
                "                                                        mp4"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--图文模板-->"+
                "                            <div class=\"panel panel-default\" id=\"7e1199fd-de4d-469f-8778-5de1268cddea\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_smallimgAndchar\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_smallimgAndchar\">"+
                "                                        <span class=\"collapse－switch\"></span>图文样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_smallimgAndchar\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">图片素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"3_2\" selected>3:2&nbsp;&nbsp;&nbsp;480*320"+
                "                                                    </option>"+
                "                                                    <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;400*300</option>"+
                "                                                    <option value=\"1_1\">1:1&nbsp;&nbsp;&nbsp;400*400</option>"+
                "                                                    <option value=\"38_25\">38:25&nbsp;&nbsp;&nbsp;228*150</option>"+
                "                                                    <option value=\"32_21\">32:21&nbsp;&nbsp;&nbsp;320*210</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">图片位置</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"position\">"+
                "                                                    <option value=\"left\" selected>左侧</option>"+
                "                                                    <option value=\"right\">右侧</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group hidden\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--      awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox03\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"static_pic\""+
                "                                                               dl-data=\"static_pic\" checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox03\">"+
                "                                                        </label>"+
                "                                                        静态(JPG,PNG,GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--    awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox04\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"dynamic_pic\""+
                "                                                               checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox04\">"+
                "                                                        </label>"+
                "                                                        动态(GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">标题与图片对齐方式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"align\">"+
                "                                                    <option value=\"top\" selected>顶部对齐</option>"+
                "                                                    <option value=\"middle\">垂直居中</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--组图模板-->"+
                "                            <div class=\"panel panel-default\" id=\"6684515c-3b6d-40f5-969c-d137c3913aab\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_imgs\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_imgs\">"+
                "                                        <span class=\"collapse－switch\"></span>组图样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_imgs\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">图片素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"3_2\" selected>3:2&nbsp;&nbsp;&nbsp;480*320"+
                "                                                    </option>"+
                "                                                    <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;400*300</option>"+
                "                                                    <option value=\"1_1\">1:1&nbsp;&nbsp;&nbsp;400*400</option>"+
                "                                                    <option value=\"32_21\">32:21&nbsp;&nbsp;&nbsp;320*210</option>"+
                "                                                    <option value=\"38_25\">38:25&nbsp;&nbsp;&nbsp;228*150</option>"+

                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">图片数</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"number\">"+
                "                                                    <option value=\"3\" selected>3</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group hidden\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--    awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox05\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"static_pic\""+
                "                                                               dl-data=\"static_pic\" checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox05\"></label>"+
                "                                                        静态(JPG,PNG,GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--  awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox06\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"dynamic_pic\""+
                "                                                               checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox06\"></label>"+
                "                                                        动态(GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">标题与图片对齐方式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"align\">"+
                "                                                    <option value=\"top\" selected>顶部对齐</option>"+
                "                                                    <option value=\"middle\">垂直居中</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--文字链模板-->"+
                "                            <div class=\"panel panel-default\" id=\"3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_char\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_char\">"+
                "                                        <span class=\"collapse－switch\"></span>文字链样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_char\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"
            );
        // 固定信息流
        case 'c96089f7-9cff-4149-997f-bb03d617cda0':
            return(
                "<!--大图模板-->"+
                "                            <div class=\"panel panel-default\" id=\"c0bb62fe-fc21-4b0b-a5c7-d547db667032_fixed\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_img\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_img\">"+
                "                                        <span class=\"collapse－switch\"></span>大图样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_img\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row\">"+
                "                                        <div class=\"row\">"+
                "                                            <div class=\"form-group \">"+
                "                                                <label"+
                "                                                        class=\"col-md-2 col-md-offset-1 control-label Dl-required\">素材尺寸</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"selectpicker\" data-width=\"100%\" data-size=\"8\" dl-data=\"scale\">"+
                "                                                        <option value=\"16_9\" selected>"+
                "                                                            16:9&nbsp;&nbsp;&nbsp;720*405"+
                "                                                        </option>"+
                "                                                        <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;800*600</option>"+
                "                                                        <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>"+
                "                                                        <option value=\"8_1\">8:1&nbsp;&nbsp;&nbsp;800*100</option>"+
                "                                                        <option value=\"4_1\">4:1&nbsp;&nbsp;&nbsp;800*200</option>"+
                "                                                        <option value=\"6_1\">6:1&nbsp;&nbsp;&nbsp;900*150</option>"+
                "                                                        <option value=\"3_1\">3:1&nbsp;&nbsp;&nbsp;720*240</option>"+
                "                                                        <option value=\"32_5\">32:5&nbsp;&nbsp;&nbsp;640*100</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                                <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--视频模板-->"+
                "                            <div class=\"panel panel-default\" id=\"b2826850-b106-4cde-8a7c-d1d08dfaec7a_fixed\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_video\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_video\">"+
                "                                        <span class=\"collapse－switch\"></span>视频样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_video\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row\">"+
                "                                        <div class=\"form-group \">"+
                "                                            <label"+
                "                                                    class=\"col-md-2 col-md-offset-1 control-label Dl-required\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"selectpicker\" data-width=\"100%\" dl-data=\"scale\">"+
                "                                                    <option value=\"16_9\" selected>16:9&nbsp;&nbsp;&nbsp;720*405"+
                "                                                    </option>"+
                "                                                    <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;800*600</option>"+
                "                                                    <!--                                                        <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>-->"+
                "                                                    <!--                                                        <option value=\"8_1\">8:1&nbsp;&nbsp;&nbsp;800*100</option>-->"+
                "                                                    <!--                                                        <option value=\"4_1\">4:1&nbsp;&nbsp;&nbsp;800*200</option>-->"+
                "                                                    <!--                                                        <option value=\"6_1\">6:1&nbsp;&nbsp;&nbsp;900*150</option>-->"+
                "                                                    <!--                                                        <option value=\"3_1\">3:1&nbsp;&nbsp;&nbsp;720*240</option>-->"+
                "                                                    <!--                                                        <option value=\"32_5\">32:5&nbsp;&nbsp;&nbsp;640*100</option>-->"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--大图+文字模板-->"+
                "                            <div class=\"panel panel-default\" id=\"7c44a357-ecd0-4c5b-80d0-db8bd5100149_fixed\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_imgAndChar\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_imgAndChar\">"+
                "                                        <span class=\"collapse－switch\"></span>大图+文字样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_imgAndChar\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker dl-notNull\""+
                "                                                        data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"4_3\" selected>4:3&nbsp;&nbsp;&nbsp;800*600"+
                "                                                    </option>"+
                "                                                    <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>"+
                "                                                    <option value=\"2_1\">2:1&nbsp;&nbsp;&nbsp;600*300  640*320</option>"+
                // "                                                    <option value=\"2_1\">2:1&nbsp;&nbsp;&nbsp;640*320</option>"+
                "                                                    <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;720*405</option>"+
                "                                                    <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;640*360</option>"+

                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group hidden\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--        awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"saweslotaddview-awesome-checkbox01\""+
                "                                                               type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               class=\"Dl-checkbox\" value=\"static_pic\""+
                "                                                               dl-data=\"static_pic\" checked>"+
                "                                                        <label for=\"awesome-checkbox01\">"+
                "                                                        </label>"+
                "                                                        静态(JPG,PNG,GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--     awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox02\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               class=\"Dl-checkbox\" value=\"dynamic_pic\""+
                "                                                               dl-data=\"dynamic_pic\" checked>"+
                "                                                        <label for=\"awesome-checkbox02\">"+
                "                                                        </label>"+
                "                                                        动态(GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--视频+文字模板-->"+
                "                            <div class=\"panel panel-default\" id=\"4d918595-d2a1-47c7-8e4a-012f28ddd96e_fixed\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_videoAndChar\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_videoAndChar\">"+
                "                                        <span class=\"collapse－switch\"></span>视频+文字样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_videoAndChar\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker dl-notNull\""+
                "                                                        data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"4_3\" selected>4:3&nbsp;&nbsp;&nbsp;800*600"+
                "                                                    </option>"+
                "                                                    <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;720*405</option>"+
                "                                                    <!--                                                        <option value=\"3_2\">3:2&nbsp;&nbsp;&nbsp;960*640</option>-->"+
                "                                                    <!--                                                        <option value=\"2_1\">2:1&nbsp;&nbsp;&nbsp;600*300</option>-->"+
                "                                                    <!--                                                        <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;1280*720</option>-->"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                // "                                        <div class=\"form-group hidden\">"+
                // "                                            <label for=\"\""+
                // "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                // "                                            <div class=\"col-md-7\">"+
                // "                                                <div class=\"checkbox\">"+
                // "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                // "                                                        <input id=\"slotaddview-awesome-checkbox07\" type=\"checkbox\""+
                // "                                                               class=\"Dl-checkbox\" name=\"format\""+
                // "                                                               class=\"Dl-checkbox\" value=\"static_pic\""+
                // "                                                               dl-data=\"static_pic\" checked>"+
                // "                                                        <label for=\"slotaddview-awesome-checkbox07\">"+
                // "                                                        </label>"+
                // "                                                        静态(JPG,PNG,GIF)"+
                // "                                                    </div>"+
                // "                                                </div>"+
                // "                                                <div class=\"checkbox\">"+
                // "                                                    <!--     awesome checkbox     -->"+
                // "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                // "                                                        <input id=\"slotaddview-awesome-checkbox08\" type=\"checkbox\""+
                // "                                                               class=\"Dl-checkbox\" name=\"format\""+
                // "                                                               class=\"Dl-checkbox\" value=\"dynamic_pic\""+
                // "                                                               dl-data=\"dynamic_pic\" checked>"+
                // "                                                        <label for=\"slotaddview-awesome-checkbox08\">"+
                // "                                                        </label>"+
                // "                                                        动态(GIF)"+
                // "                                                    </div>"+
                // "                                                </div>"+
                // "                                            </div>"+
                // "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">视频素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"video_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!-- awesome checkbox                                                       -->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox08\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"mp4\""+
                "                                                               dl-data=\"format\" disabled checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox08\">"+
                "                                                        </label>"+
                "                                                        mp4"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--图文模板-->"+
                "                            <div class=\"panel panel-default\" id=\"7e1199fd-de4d-469f-8778-5de1268cddea_fixed\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_smallimgAndchar\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_smallimgAndchar\">"+
                "                                        <span class=\"collapse－switch\"></span>图文样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_smallimgAndchar\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">图片素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"3_2\" selected>3:2&nbsp;&nbsp;&nbsp;480*320"+
                "                                                    </option>"+
                "                                                    <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;400*300</option>"+
                "                                                    <option value=\"1_1\">1:1&nbsp;&nbsp;&nbsp;400*400 &nbsp;&nbsp;138*138</option>"+
                "                                                    <option value=\"38_25\">38:25&nbsp;&nbsp;&nbsp;228*150</option>"+
                "                                                    <option value=\"32_21\">32:21&nbsp;&nbsp;&nbsp;320*210</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">图片位置</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"position\">"+
                "                                                    <option value=\"left\" selected>左侧</option>"+
                "                                                    <option value=\"right\">右侧</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group hidden\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--      awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox03\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"static_pic\""+
                "                                                               dl-data=\"static_pic\" checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox03\">"+
                "                                                        </label>"+
                "                                                        静态(JPG,PNG,GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--    awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox04\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"dynamic_pic\""+
                "                                                               checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox04\">"+
                "                                                        </label>"+
                "                                                        动态(GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">标题与图片对齐方式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"align\">"+
                "                                                    <option value=\"top\" selected>顶部对齐</option>"+
                "                                                    <option value=\"middle\">垂直居中</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--组图模板-->"+
                "                            <div class=\"panel panel-default\" id=\"6684515c-3b6d-40f5-969c-d137c3913aab_fixed\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_imgs\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_imgs\">"+
                "                                        <span class=\"collapse－switch\"></span>组图样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_imgs\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">图片素材设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"3_2\" selected>3:2&nbsp;&nbsp;&nbsp;480*320"+
                "                                                    </option>"+
                "                                                    <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;400*300</option>"+
                "                                                    <option value=\"1_1\">1:1&nbsp;&nbsp;&nbsp;400*400</option>"+
                "                                                    <option value=\"32_21\">32:21&nbsp;&nbsp;&nbsp;320*210</option>"+
                "                                                    <option value=\"38_25\">38:25&nbsp;&nbsp;&nbsp;228*150</option>"+

                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">图片数</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"number\">"+
                "                                                    <option value=\"3\" selected>3</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group hidden\">"+
                "                                            <label for=\"\""+
                "                                                   class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--    awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox05\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"static_pic\""+
                "                                                               dl-data=\"static_pic\" checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox05\"></label>"+
                "                                                        静态(JPG,PNG,GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                                <div class=\"checkbox\">"+
                "                                                    <!--  awesome checkbox-->"+
                "                                                    <div class=\"checkbox checkbox-deepleaper\">"+
                "                                                        <input id=\"slotaddview-awesome-checkbox06\" type=\"checkbox\""+
                "                                                               class=\"Dl-checkbox\" name=\"format\""+
                "                                                               value=\"dynamic_pic\""+
                "                                                               checked>"+
                "                                                        <label for=\"slotaddview-awesome-checkbox06\"></label>"+
                "                                                        动态(GIF)"+
                "                                                    </div>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">标题与图片对齐方式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"align\">"+
                "                                                    <option value=\"top\" selected>顶部对齐</option>"+
                "                                                    <option value=\"middle\">垂直居中</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--文字链模板-->"+
                "                            <div class=\"panel panel-default\" id=\"3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0_fixed\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#collapse_infor_flow_char\""+
                "                                       aria-expanded=\"true\" aria-controls=\"collapse_infor_flow_char\">"+
                "                                        <span class=\"collapse－switch\"></span>文字链样式"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"collapse_infor_flow_char\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form></form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"
            );
        // 开屏
        case '987b7cd8-2752-4a15-bc94-6c0a2764a5c4':
            return("                        <!--静态开屏-->"+
                "                            <div class=\"panel panel-default\" id=\"8be1afb6-8d5c-4be9-917d-5d187ae03a48\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#static_tail\""+
                "                                       aria-expanded=\"true\" aria-controls=\"static_tail\">"+
                "                                        <span class=\"collapse－switch\"></span>静态开屏"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"static_tail\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\""+
                "                                                       style=\"padding-left: 0; margin-left: 0; text-align: left;\""+
                "                                                       dl-data=\"format\">JPG、PNG</label>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                       <div class=\"form-group\">"+
                "                                           <label class=\"col-md-2 col-md-offset-1 control-label\">开屏时长</label>"+
                "                                           <div class=\"col-md-7\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\""+
                "                                                   style=\"padding-left: 0; margin-left: 0; text-align: left;\""+
                "                                                   dl-data=\"displaytime\">3S</label>"+
                "                                           </div>"+
                "                                       </div>"+
                "                                        <div class=\"form-group\" id=\"static_clicked\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">是否可点击</label>"+
                "                                           <div class=\"col-md-7\">"+
                "                                               <label class=\"radio-inline\" style=\"padding: 0;\">"+
                "                                                   <input type=\"checkbox\" name=\"static_clicked\" value=\"0\" id=\"static_can_click\" checked>可点击"+
                "                                                </label>"+
                "                                               <label class=\"radio-inline\" style=\"padding: 0;\">"+
                "                                                   <input type=\"checkbox\" name=\"static_clicked\" value=\"1\" id=\"static_not_click\" checked>不可点击"+
                "                                               </label>"+
                "                                            </div>"+
                "                                           <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+

                "                                    </form>"+
                "                                    <div id=\"static_tail_set\">"+
                "                                        <div class=\"row Dl-title\">"+
                "                                            <div class=\"col-md-10 col-md-offset-1\">"+
                "                                                <span class=\"identifier\">标题设置</span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\"  dl-data=\"font\">"+
                "                                                        <option value=\"\">系统默认字体</option>"+
                "                                                        <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                        <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                            Medium"+
                "                                                        </option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                        </option>"+
                "                                                        <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                        <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                        <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                        <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                        <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                        <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                        <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                        <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                        <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                        <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                        <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                        <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                        <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                        <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                        <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                        <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                        <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                        <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                            Hei Mono"+
                "                                                        </option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                        <option value=\"12\">12px</option>"+
                "                                                        <option value=\"13\">13px</option>"+
                "                                                        <option value=\"14\" selected>14px</option>"+
                "                                                        <option value=\"15\">15px</option>"+
                "                                                        <option value=\"16\">16px</option>"+
                "                                                        <option value=\"17\">17px</option>"+
                "                                                        <option value=\"18\">18px</option>"+
                "                                                        <option value=\"19\">19px</option>"+
                "                                                        <option value=\"20\">20px</option>"+
                "                                                        <option value=\"21\">21px</option>"+
                "                                                        <option value=\"22\">22px</option>"+
                "                                                        <option value=\"23\">23px</option>"+
                "                                                        <option value=\"24\">24px</option>"+
                "                                                        <option value=\"25\">25px</option>"+
                "                                                        <option value=\"26\">26px</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                           value=\"#000000\" placeholder=\"#000000\">"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                        <option value=\"8\">8</option>"+
                "                                                        <option value=\"9\">9</option>"+
                "                                                        <option value=\"10\">10</option>"+
                "                                                        <option value=\"11\">11</option>"+
                "                                                        <option value=\"12\">12</option>"+
                "                                                        <option value=\"13\">13</option>"+
                "                                                        <option value=\"14\">14</option>"+
                "                                                        <option value=\"15\">15</option>"+
                "                                                        <option value=\"16\">16</option>"+
                "                                                        <option value=\"17\">17</option>"+
                "                                                        <option value=\"18\">18</option>"+
                "                                                        <option value=\"19\">19</option>"+
                "                                                        <option value=\"20\">20</option>"+
                "                                                        <option value=\"21\">21</option>"+
                "                                                        <option value=\"22\">22</option>"+
                "                                                        <option value=\"23\" selected>23</option>"+
                // "                                                        <option value=\"24\">24</option>"+
                // "                                                        <option value=\"25\">25</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </form>"+
                "                                        <div class=\"row Dl-title\">"+
                "                                            <div class=\"col-md-10 col-md-offset-1\">"+
                "                                                <span class=\"identifier\">描述设置</span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                        <option value=\"\">系统默认字体</option>"+
                "                                                        <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                        <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                            Medium"+
                "                                                        </option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                        </option>"+
                "                                                        <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                        <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                        <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                        <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                        <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                        <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                        <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                        <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                        <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                        <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                        <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                        <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                        <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                        <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                        <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                        <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                        <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                        <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                            Hei Mono"+
                "                                                        </option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                        <option value=\"12\" selected>12px</option>"+
                "                                                        <option value=\"13\">13px</option>"+
                "                                                        <option value=\"14\">14px</option>"+
                "                                                        <option value=\"15\">15px</option>"+
                "                                                        <option value=\"16\">16px</option>"+
                "                                                        <option value=\"17\">17px</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                           value=\"#000000\" placeholder=\"#000000\">"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                        <option value=\"8\">8</option>"+
                "                                                        <option value=\"9\">9</option>"+
                "                                                        <option value=\"10\">10</option>"+
                "                                                        <option value=\"11\">11</option>"+
                "                                                        <option value=\"12\">12</option>"+
                "                                                        <option value=\"13\">13</option>"+
                "                                                        <option value=\"14\">14</option>"+
                "                                                        <option value=\"15\">15</option>"+
                "                                                        <option value=\"16\">16</option>"+
                "                                                        <option value=\"17\">17</option>"+
                "                                                        <option value=\"18\">18</option>"+
                "                                                        <option value=\"19\">19</option>"+
                "                                                        <option value=\"20\">20</option>"+
                "                                                        <option value=\"21\">21</option>"+
                "                                                        <option value=\"22\">22</option>"+
                "                                                        <option value=\"23\" selected>23</option>"+
                // "                                                        <option value=\"24\">24</option>"+
                // "                                                        <option value=\"25\">25</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                                <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                            </div>"+
                "                                        </form>"+
                "                                    </div>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "<!--动态开屏-->"+
                "                            <div class=\"panel panel-default\" id=\"876de12b-5e92-41da-a4a3-2f9fa33eda33\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#dynamic_tail\""+
                "                                       aria-expanded=\"true\" aria-controls=\"dynamic_tail\">"+
                "                                        <span class=\"collapse－switch\"></span>动态开屏"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"dynamic_tail\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\""+
                "                                                       style=\"padding-left: 0; margin-left: 0; text-align: left;\">GIF</label>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">开屏时长</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\""+
                "                                                       style=\"padding-left: 0; margin-left: 0; text-align: left;\">5S</label>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\" id=\"dynamic_clicked\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">是否可点击</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <label class=\"radio-inline\" style=\"padding: 0;\">"+
                "                                                    <input type=\"checkbox\" name=\"dynamic_clicked\" value=\"0\" id=\"dynamic_can_click\" checked>可点击"+
                "                                                </label>"+
                "                                                <label class=\"radio-inline\" style=\"padding: 0;\">"+
                "                                                    <input type=\"checkbox\" name=\"dynamic_clicked\" value=\"1\" id=\"dynamic_not_click\" checked>不可点击"+
                "                                                </label>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div id=\"dynamic_tail_set\">"+
                "                                        <div class=\"row Dl-title\">"+
                "                                            <div class=\"col-md-10 col-md-offset-1\">"+
                "                                                <span class=\"identifier\">标题设置</span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                        <option value=\"\">系统默认字体</option>"+
                "                                                        <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                        <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                            Medium"+
                "                                                        </option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                        </option>"+
                "                                                        <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                        <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                        <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                        <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                        <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                        <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                        <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                        <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                        <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                        <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                        <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                        <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                        <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                        <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                        <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                        <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                        <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                        <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                            Hei Mono"+
                "                                                        </option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                        <option value=\"12\">12px</option>"+
                "                                                        <option value=\"13\">13px</option>"+
                "                                                        <option value=\"14\" selected>14px</option>"+
                "                                                        <option value=\"15\">15px</option>"+
                "                                                        <option value=\"16\">16px</option>"+
                "                                                        <option value=\"17\">17px</option>"+
                "                                                        <option value=\"18\">18px</option>"+
                "                                                        <option value=\"19\">19px</option>"+
                "                                                        <option value=\"20\">20px</option>"+
                "                                                        <option value=\"21\">21px</option>"+
                "                                                        <option value=\"22\">22px</option>"+
                "                                                        <option value=\"23\">23px</option>"+
                "                                                        <option value=\"24\">24px</option>"+
                "                                                        <option value=\"25\">25px</option>"+
                "                                                        <option value=\"26\">26px</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                           value=\"#000000\" placeholder=\"#000000\">"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                        <option value=\"8\">8</option>"+
                "                                                        <option value=\"9\">9</option>"+
                "                                                        <option value=\"10\">10</option>"+
                "                                                        <option value=\"11\">11</option>"+
                "                                                        <option value=\"12\">12</option>"+
                "                                                        <option value=\"13\">13</option>"+
                "                                                        <option value=\"14\">14</option>"+
                "                                                        <option value=\"15\">15</option>"+
                "                                                        <option value=\"16\">16</option>"+
                "                                                        <option value=\"17\">17</option>"+
                "                                                        <option value=\"18\">18</option>"+
                "                                                        <option value=\"19\">19</option>"+
                "                                                        <option value=\"20\">20</option>"+
                "                                                        <option value=\"21\">21</option>"+
                "                                                        <option value=\"22\">22</option>"+
                "                                                        <option value=\"23\" selected>23</option>"+
                // "                                                        <option value=\"24\">24</option>"+
                // "                                                        <option value=\"25\">25</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </form>"+
                "                                        <div class=\"row Dl-title\">"+
                "                                            <div class=\"col-md-10 col-md-offset-1\">"+
                "                                                <span class=\"identifier\">描述设置</span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                        <option value=\"\">系统默认字体</option>"+
                "                                                        <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                        <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                            Medium"+
                "                                                        </option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                        </option>"+
                "                                                        <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                        <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                        <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                        <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                        <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                        <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                        <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                        <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                        <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                        <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                        <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                        <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                        <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                        <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                        <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                        <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                        <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                        <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                            Hei Mono"+
                "                                                        </option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                        <option value=\"12\" selected>12px</option>"+
                "                                                        <option value=\"13\">13px</option>"+
                "                                                        <option value=\"14\">14px</option>"+
                "                                                        <option value=\"15\">15px</option>"+
                "                                                        <option value=\"16\">16px</option>"+
                "                                                        <option value=\"17\">17px</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                           value=\"#000000\" placeholder=\"#000000\">"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                        <option value=\"8\">8</option>"+
                "                                                        <option value=\"9\">9</option>"+
                "                                                        <option value=\"10\">10</option>"+
                "                                                        <option value=\"11\">11</option>"+
                "                                                        <option value=\"12\">12</option>"+
                "                                                        <option value=\"13\">13</option>"+
                "                                                        <option value=\"14\">14</option>"+
                "                                                        <option value=\"15\">15</option>"+
                "                                                        <option value=\"16\">16</option>"+
                "                                                        <option value=\"17\">17</option>"+
                "                                                        <option value=\"18\">18</option>"+
                "                                                        <option value=\"19\">19</option>"+
                "                                                        <option value=\"20\">20</option>"+
                "                                                        <option value=\"21\">21</option>"+
                "                                                        <option value=\"22\">22</option>"+
                "                                                        <option value=\"23\" selected>23</option>"+
                // "                                                        <option value=\"24\">24</option>"+
                // "                                                        <option value=\"25\">25</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                                <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                            </div>"+
                "                                        </form>"+
                "                                    </div>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                " <!--视频开屏-->"+
                "                            <div class=\"panel panel-default\" id=\"7d42ec85-5533-4390-9338-84bfb0f725b5\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#video_tail\""+
                "                                       aria-expanded=\"true\" aria-controls=\"video_tail\">"+
                "                                        <span class=\"collapse－switch\"></span>视频开屏"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"video_tail\" class=\"panel-collapse collapse in\" role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材格式</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\""+
                "                                                       style=\"padding-left: 0; margin-left: 0; text-align: left;\">MP4</label>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">开屏时长</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\""+
                "                                                       style=\"padding-left: 0; margin-left: 0; text-align: left;\">5S</label>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\" id=\"video_clicked\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">是否可点击</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <label class=\"radio-inline\" style=\"padding: 0;\">"+
                "                                                    <input type=\"checkbox\" name=\"video_clicked\" value=\"0\" id=\"video_can_click\" checked>可点击"+
                "                                                </label>"+
                "                                                <label class=\"radio-inline\" style=\"padding: 0;\">"+
                "                                                    <input type=\"checkbox\" name=\"video_clicked\" value=\"1\" id=\"video_not_click\" checked>不可点击"+
                "                                                </label>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div id=\"video_tail_set\">"+
                "                                        <div class=\"row Dl-title\">"+
                "                                            <div class=\"col-md-10 col-md-offset-1\">"+
                "                                                <span class=\"identifier\">标题设置</span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                        <option value=\"\">系统默认字体</option>"+
                "                                                        <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                        <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                            Medium"+
                "                                                        </option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                        </option>"+
                "                                                        <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                        <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                        <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                        <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                        <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                        <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                        <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                        <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                        <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                        <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                        <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                        <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                        <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                        <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                        <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                        <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                        <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                        <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                            Hei Mono"+
                "                                                        </option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                        <option value=\"12\">12px</option>"+
                "                                                        <option value=\"13\">13px</option>"+
                "                                                        <option value=\"14\" selected>14px</option>"+
                "                                                        <option value=\"15\">15px</option>"+
                "                                                        <option value=\"16\">16px</option>"+
                "                                                        <option value=\"17\">17px</option>"+
                "                                                        <option value=\"18\">18px</option>"+
                "                                                        <option value=\"19\">19px</option>"+
                "                                                        <option value=\"20\">20px</option>"+
                "                                                        <option value=\"21\">21px</option>"+
                "                                                        <option value=\"22\">22px</option>"+
                "                                                        <option value=\"23\">23px</option>"+
                "                                                        <option value=\"24\">24px</option>"+
                "                                                        <option value=\"25\">25px</option>"+
                "                                                        <option value=\"26\">26px</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                           value=\"#000000\" placeholder=\"#000000\">"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                        <option value=\"8\">8</option>"+
                "                                                        <option value=\"9\">9</option>"+
                "                                                        <option value=\"10\">10</option>"+
                "                                                        <option value=\"11\">11</option>"+
                "                                                        <option value=\"12\">12</option>"+
                "                                                        <option value=\"13\">13</option>"+
                "                                                        <option value=\"14\">14</option>"+
                "                                                        <option value=\"15\">15</option>"+
                "                                                        <option value=\"16\">16</option>"+
                "                                                        <option value=\"17\">17</option>"+
                "                                                        <option value=\"18\">18</option>"+
                "                                                        <option value=\"19\">19</option>"+
                "                                                        <option value=\"20\">20</option>"+
                "                                                        <option value=\"21\">21</option>"+
                "                                                        <option value=\"22\">22</option>"+
                "                                                        <option value=\"23\" selected>23</option>"+
                // "                                                        <option value=\"24\">24</option>"+
                // "                                                        <option value=\"25\">25</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                        </form>"+
                "                                        <div class=\"row Dl-title\">"+
                "                                            <div class=\"col-md-10 col-md-offset-1\">"+
                "                                                <span class=\"identifier\">描述设置</span>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                        <option value=\"\">系统默认字体</option>"+
                "                                                        <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                        <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                            Medium"+
                "                                                        </option>"+
                "                                                        <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                        </option>"+
                "                                                        <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                        <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                        <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                        <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                        <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                        <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                        <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                        <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                        <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                        <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                        <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                        <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                        <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                        <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                        <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                        <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                        <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                        <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                            Hei Mono"+
                "                                                        </option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                        <option value=\"12\" selected>12px</option>"+
                "                                                        <option value=\"13\">13px</option>"+
                "                                                        <option value=\"14\">14px</option>"+
                "                                                        <option value=\"15\">15px</option>"+
                "                                                        <option value=\"16\">16px</option>"+
                "                                                        <option value=\"17\">17px</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                           value=\"#000000\" placeholder=\"#000000\">"+
                "                                                </div>"+
                "                                            </div>"+
                "                                            <div class=\"form-group\">"+
                "                                                <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                                <div class=\"col-md-7\">"+
                "                                                    <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                        <option value=\"8\">8</option>"+
                "                                                        <option value=\"9\">9</option>"+
                "                                                        <option value=\"10\">10</option>"+
                "                                                        <option value=\"11\">11</option>"+
                "                                                        <option value=\"12\">12</option>"+
                "                                                        <option value=\"13\">13</option>"+
                "                                                        <option value=\"14\">14</option>"+
                "                                                        <option value=\"15\">15</option>"+
                "                                                        <option value=\"16\">16</option>"+
                "                                                        <option value=\"17\">17</option>"+
                "                                                        <option value=\"18\">18</option>"+
                "                                                        <option value=\"19\">19</option>"+
                "                                                        <option value=\"20\">20</option>"+
                "                                                        <option value=\"21\">21</option>"+
                "                                                        <option value=\"22\">22</option>"+
                "                                                        <option value=\"23\" selected>23</option>"+
                // "                                                        <option value=\"24\">24</option>"+
                // "                                                        <option value=\"25\">25</option>"+
                "                                                    </select>"+
                "                                                </div>"+
                "                                                <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                            </div>"+
                "                                        </form>"+
                "                                    </div>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"
            );
        // 横幅
        case '7b62026a-23aa-4592-836a-f4ee78f7ea2e':
            return("                            <div class=\"panel panel-default\" id=\"3fc13471-36a1-4dfc-abde-98c364e78e2e\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#banner_graphic\""+
                "                                       aria-expanded=\"true\" aria-controls=\"banner_graphic\">"+
                "                                        <span class=\"collapse－switch\"></span>图文"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"banner_graphic\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" dl-data=\"scale\">"+
                "                                                    <option value=\"1_1\">1:1&nbsp;&nbsp;&nbsp;72*72</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">标题设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"title_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\">12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\" selected>14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                    <option value=\"18\">18px</option>"+
                "                                                    <option value=\"19\">19px</option>"+
                "                                                    <option value=\"20\">20px</option>"+
                "                                                    <option value=\"21\">21px</option>"+
                "                                                    <option value=\"22\">22px</option>"+
                "                                                    <option value=\"23\">23px</option>"+
                "                                                    <option value=\"24\">24px</option>"+
                "                                                    <option value=\"25\">25px</option>"+
                "                                                    <option value=\"26\">26px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">标题长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                    <div class=\"row Dl-title\">"+
                "                                        <div class=\"col-md-10 col-md-offset-1\">"+
                "                                            <span class=\"identifier\">描述设置</span>"+
                "                                        </div>"+
                "                                    </div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"description_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字体</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font\">"+
                "                                                    <option value=\"\">系统默认字体</option>"+
                "                                                    <option value=\"LiHei Pro Medium\">苹果丽黑 LiHei Pro Medium</option>"+
                "                                                    <option value=\"LiSong Pro Light\">苹果丽宋 LiSong Pro Light</option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽中黑 Apple LiGothic"+
                "                                                        Medium"+
                "                                                    </option>"+
                "                                                    <option value=\"Apple LiGothic Medium\">苹果丽细宋 Apple LiSung Light"+
                "                                                    </option>"+
                "                                                    <option value=\"Hiragino Sans\">冬青黑体 Hiragino Sans</option>"+
                "                                                    <option value=\"Droid Sans\">Droid Sans</option>"+
                "                                                    <option value=\"Droid Sans Fallback\">Droid Sans Fallback</option>"+
                "                                                    <option value=\"STHeiti\">华文黑体 STHeiti</option>"+
                "                                                    <option value=\"STKaiti\">华文楷体 STKaiti</option>"+
                "                                                    <option value=\"STSong\">华文宋体 STSong</option>"+
                "                                                    <option value=\"STFangsong\">华文仿宋 STFangsong</option>"+
                "                                                    <option value=\"STHeiti Light\">华文细黑 STHeiti Light</option>"+
                "                                                    <option value=\"Microsoft YaHei\">微软雅黑 Microsoft YaHei</option>"+
                "                                                    <option value=\"方正兰亭中黑_GBK\">方正兰亭中黑_GBK</option>"+
                "                                                    <option value=\"方正兰亭黑_GBK\">方正兰亭黑_GBK</option>"+
                "                                                    <option value=\"Source Han Sans\">思源黑体 Source Han Sans</option>"+
                "                                                    <option value=\"ExtractBlack\">汉仪旗黑 ExtractBlacki</option>"+
                "                                                    <option value=\"SimSun\">宋体 SimSun</option>"+
                "                                                    <option value=\"SimHei\">黑体 SimHei</option>"+
                "                                                    <option value=\"FZZhongDengXian\">方正等线 FZZhongDengXian</option>"+
                "                                                    <option value=\"zysong\">中易宋体 zysong</option>"+
                "                                                    <option value=\"WenQuanYi Micro Hei Mono\">文泉驿微米黑 WenQuanYi Micro"+
                "                                                        Hei Mono"+
                "                                                    </option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字号</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"font-size\">"+
                "                                                    <option value=\"12\" selected>12px</option>"+
                "                                                    <option value=\"13\">13px</option>"+
                "                                                    <option value=\"14\">14px</option>"+
                "                                                    <option value=\"15\">15px</option>"+
                "                                                    <option value=\"16\">16px</option>"+
                "                                                    <option value=\"17\">17px</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">字色</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <input type=\"text\" class=\"form-control\" dl-data=\"font-color\""+
                "                                                       value=\"#000000\" placeholder=\"#000000\">"+
                "                                            </div>"+
                "                                        </div>"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label Dl-required\">描述长度</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"length\">"+
                "                                                    <option value=\"2\">2</option>"+
                "                                                    <option value=\"3\">3</option>"+
                "                                                    <option value=\"4\">4</option>"+
                "                                                    <option value=\"5\">5</option>"+
                "                                                    <option value=\"6\">6</option>"+
                "                                                    <option value=\"7\">7</option>"+
                "                                                    <option value=\"8\">8</option>"+
                "                                                    <option value=\"9\">9</option>"+
                "                                                    <option value=\"10\">10</option>"+
                "                                                    <option value=\"11\">11</option>"+
                "                                                    <option value=\"12\">12</option>"+
                "                                                    <option value=\"13\">13</option>"+
                "                                                    <option value=\"14\">14</option>"+
                "                                                    <option value=\"15\">15</option>"+
                "                                                    <option value=\"16\">16</option>"+
                "                                                    <option value=\"17\">17</option>"+
                "                                                    <option value=\"18\">18</option>"+
                "                                                    <option value=\"19\">19</option>"+
                "                                                    <option value=\"20\">20</option>"+
                "                                                    <option value=\"21\">21</option>"+
                "                                                    <option value=\"22\">22</option>"+
                "                                                    <option value=\"23\" selected>23</option>"+
                // "                                                    <option value=\"24\">24</option>"+
                // "                                                    <option value=\"25\">25</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                            <span class=\"help-block col-md-7 col-md-offset-3\"></span>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"+
                "                        <!--横幅-纯图-->"+
                "                            <div class=\"panel panel-default\" id=\"b62e5dfa-a628-4ddc-a2ef-c43e62feb318\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#banner_pure_figure\""+
                "                                       aria-expanded=\"true\" aria-controls=\"banner_pure_figure\">"+
                "                                        <span class=\"collapse－switch\"></span>纯图"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"banner_pure_figure\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <!-- 别删-->"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker dl-notNull\""+
                "                                                        data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"32_5\">32:5&nbsp;&nbsp;&nbsp;640*100</option>"+
                "                                                    <option value=\"17_5\">17:5&nbsp;&nbsp;&nbsp;340*100</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>"
            );
        //插屏
        case '5b3e416f-d93a-4632-87de-5d4fbcc942fb':
            return( "                            <div class=\"panel panel-default\" id=\"5e0e3da8-e3cc-4330-a409-ee7263a08711\" style=\"display: none\">"+
                "                            <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">"+
                "                                <h4 class=\"panel-title\">"+
                "                                    <a data-toggle=\"collapse\" data-parent=\"#accordion\""+
                "                                       href=\"#plaque_type\""+
                "                                       aria-expanded=\"true\" aria-controls=\"plaque_type\">"+
                "                                        <span class=\"collapse－switch\"></span>纯图"+
                "                                    </a>"+
                "                                </h4>"+
                "                            </div>"+
                "                            <div id=\"plaque_type\" class=\"panel-collapse collapse in\""+
                "                                 role=\"tabpanel\""+
                "                                 aria-labelledby=\"headingOne\">"+
                "                                <div class=\"panel-body\">"+
                "                                    <div class=\"row \"></div>"+
                "                                    <form class=\"form-horizontal\" role=\"form\" dl-set=\"pic_setting\">"+
                "                                        <div class=\"form-group\">"+
                "                                            <label class=\"col-md-2 col-md-offset-1 control-label\">素材尺寸</label>"+
                "                                            <div class=\"col-md-7\">"+
                "                                                <select class=\"form-control selectpicker\" data-size=\"8\" dl-data=\"scale\">"+
                "                                                    <option value=\"6_5\" selected>6:5&nbsp;&nbsp;&nbsp;600*500</option>"+
                "                                                    <option value=\"4_3\">4:3&nbsp;&nbsp;&nbsp;1024*768</option>"+
                "                                                    <option value=\"16_9\">16:9&nbsp;&nbsp;&nbsp;1280*720</option>"+
                "                                                </select>"+
                "                                            </div>"+
                "                                        </div>"+
                "                                    </form>"+
                "                                </div>"+
                "                            </div>"+
                "                        </div>");
    }

}