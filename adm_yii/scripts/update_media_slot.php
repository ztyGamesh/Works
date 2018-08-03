<?php
/**
 * Created by PhpStorm.
 * User: xueleixi
 * Date: 2017/10/25
 * Time: 下午5:59
 */

$mediaRows = [];//要更改的媒体数据
$slotRows = [];//要更改的slot数据


$media_file = __DIR__ . "/media.txt";

$lines = file($media_file);
unset($lines[0]);
foreach ($lines as $line) {
    $line = rtrim($line, "\n");
    $parts = explode("\t", $line);
    if (count($parts) == 2) {
        $parts[] = '';
    }
    if (count($parts) != 3) {
        throw new \Exception("invalid data:" . json_encode($parts));
    }
    $map = [':uid' => $parts[0], ':status' => $parts[1], ':platform' => $parts[2]];
    $mediaRows[] = $map;
}

$slot_file = __DIR__ . "/slot.txt";
$lines = file($slot_file);
unset($lines[0]);
foreach ($lines as $line) {
    $line = rtrim($line, "\n");
    $parts = explode("\t", $line);
    if (count($parts) != 7) {
        throw new Exception("invalid slot data:" . json_encode($parts));
    }
    $map = [];
    $map[':uid'] = $parts[0];
    $map[':status'] = $parts[1];
    $map[':cooperate_mode'] = (int)$parts[2];
    $map[':price'] = (int)$parts[3];
    $map[':media_share'] = (int)$parts[4];
    $map[':profit_rate'] = (int)$parts[5];
    $map[':profit_price'] = round($parts[6], 2);
    $expected = round($map[':price'] / (1 - $map[':profit_rate'] / 100), 2);
    if ($map[':profit_price'] != $expected) {
//        throw new \Exception("prifit_price not correct[{$map['profit_price']}!={$expected}] :".json_encode($map));
        $map[':profit_price'] = $expected;
    }
    $slotRows[] = $map;
}

$media_sql = "UPDATE media SET status=:status,platform=:platform WHERE uid=:uid";
$slot_sql = "UPDATE slot SET status=:status,cooperate_mode=:cooperate_mode,price=:price,media_share=:media_share,
profit_rate=:profit_rate,profit_price=:profit_price WHERE uid=:uid";
$slot_history_sql = "INSERT INTO slot_price_history (slot, cooperate_mode, price, media_share, profit_rate, profit_price, create_time) 
VALUES (:uid,:cooperate_mode, :price, :media_share, :profit_rate, :profit_price, unix_timestamp() )";

$dbConf = [
    'dsn' => 'mysql:dbname=deepleaper;host=deepleaper.mysql.rds.aliyuncs.com',
    'username' => 'dler',
    'password' => 'zg2LUFvzVImE2KjN',
];


$pdo = new PDO($dbConf['dsn'], $dbConf['username'], $dbConf['password']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->beginTransaction();
$stmt = $pdo->prepare($media_sql);

foreach ($mediaRows as $mediaRow) {
    $ret = $stmt->execute($mediaRow);
    if (!$ret) {
        var_dump($stmt->errorInfo());
        exit(1);
    }
}
$stmt = $pdo->prepare($slot_sql);
$stmt_h = $pdo->prepare($slot_history_sql);

foreach ($slotRows as $slotRow) {
    $ret = $stmt->execute($slotRow);
    if (!$ret) {
        var_dump($stmt->errorInfo());
        exit(2);
    }
    unset($slotRow[':status']);
//    echo json_encode($slotRow)."\n";
    $ret = $stmt_h->execute($slotRow);
    if (!$ret) {
        var_dump($stmt->errorInfo());
        exit(2);
    }
}

$pdo->commit();
echo "update success\n";