USE deepleaper;
-- 备份
CREATE TABLE template_copy SELECT *
                           FROM template;
CREATE TABLE slot_class_copy SELECT *
                             FROM slot_class;
CREATE TABLE slot_template_copy SELECT *
                                FROM slot_template;
-- 删除无效的模板
DELETE template
FROM template
WHERE uid NOT IN
      ('c0bb62fe-fc21-4b0b-a5c7-d547db667032', 'b2826850-b106-4cde-8a7c-d1d08dfaec7a', '7c44a357-ecd0-4c5b-80d0-db8bd5100149', '4d918595-d2a1-47c7-8e4a-012f28ddd96e', '7e1199fd-de4d-469f-8778-5de1268cddea', '6684515c-3b6d-40f5-969c-d137c3913aab', '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0', 'b62e5dfa-a628-4ddc-a2ef-c43e62feb318', '3fc13471-36a1-4dfc-abde-98c364e78e2e', '5e0e3da8-e3cc-4330-a409-ee7263a08711');
-- 删除无效的广告类型
DELETE slot_class
FROM slot_class
WHERE uid NOT IN
      ('29076f0d-a923-47d4-bfef-2e3cf28fc099', '5b3e416f-d93a-4632-87de-5d4fbcc942fb', '7b62026a-23aa-4592-836a-f4ee78f7ea2e', '987b7cd8-2752-4a15-bc94-6c0a2764a5c4', 'c96089f7-9cff-4149-997f-bb03d617cda0');
-- 删除无效的广告位
DELETE slot
FROM slot
WHERE class NOT IN (SELECT uid
                    FROM slot_class);
-- 删除无效的广告位模板
DELETE slot_template FROM slot_template
WHERE template_class NOT IN (SELECT uid
                             FROM template
) OR slot NOT IN (SELECT uid
                  FROM slot);