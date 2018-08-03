/**
 * Created by xueleixi on 2017/10/19.
 */


// # 101120400	房产	别墅豪宅
// # 101120500	房产	写字楼
// # 101130000	体育运动	全部
// # 101130100	体育运动	球类运动
// # 101130200	体育运动	休闲健身

//
// insert into reports_article_daily  VALUES
// ("id-0001","2017-10-18","article-01","title-01",101130500,"a/b",8,0,0);

    var a="h";

var tags={
    101120400: "房产/别墅豪宅",
    101120500: "房产/写字楼",
    101130000: "体育运动/全部",
    101130100: "体育运动/球类运动",
    101130200: "体育运动/休闲健身"
};
var sql="insert into reports_article_daily  VALUES ";
var n=1;
while (n<20){
    for(code in tags){
        sql += "(\"id-"+(n)+"\",";
        sql +="\"2017-10-18\",";
        sql +="\"article-"+(n)+"\",";
        sql +="\"title-"+(n)+"\",";
        sql +=""+(code)+",";
        sql +="\""+(tags[code])+"\",";
        sql +=""+(parseInt(Math.random()*100))+"";
        sql +=",0,0),";
        n++;
    }
    console.log(sql);
    break;
}

// sql=sql.substring(0,sql.length-1);
// console.log(sql);