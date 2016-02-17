INSERT INTO NEMO_Datamart.ParameterType
(Name, 
concept_path, 
concept_cd, 
valtype_cd, 
TableName, 
TableColumn, 
bounded)
SELECT 
c.name_char,
c.concept_path,
c.concept_cd,
'n',
'concept_dimension',
'concept_path',
1
FROM NEMO_Datamart.concept_dimension c 
WHERE c.concept_path LIKE '\\\\i2b2\\\\Lab%'
LIMIT 20;