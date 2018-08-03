ALTER TABLE deepleaper.ad_creative ADD deep_link VARCHAR(2000) NULL COMMENT 'deeplink推广连接';
ALTER TABLE deepleaper.ad_creative
  MODIFY COLUMN deep_link VARCHAR(2000) COMMENT 'deeplink推广连接' AFTER link;
ALTER TABLE deepleaper.ad_creative_audit ADD deep_link VARCHAR(2000) NULL COMMENT 'deeplink推广连接';
ALTER TABLE deepleaper.ad_creative_audit
  MODIFY COLUMN deep_link VARCHAR(2000) COMMENT 'deeplink推广连接' AFTER link;
