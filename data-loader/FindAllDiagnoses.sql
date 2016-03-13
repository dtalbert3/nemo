-- Finds the diagnoses for every patient in the database for all possible ICD9 codes
-- RUNS VERY SLOWLY
Set session group_concat_max_len = 1000000;
SET @sql = NULL;
SELECT
  GROUP_CONCAT(DISTINCT
    CONCAT(
		'case when exists (
				SELECT 1 FROM observation_fact o WHERE o.concept_cd = \'', 
		diagnoses.concept_cd, '\' AND p.patient_num = o.patient_num ', 
		') then 1 else 0 end as \'',  
        diagnoses.concept_cd, '\''
    )
  ) INTO @sql
  FROM 
  (SELECT DISTINCT c.concept_cd FROM NEMO_Datamart.concept_dimension c 
	INNER JOIN observation_fact o on o.concept_cd = c.concept_cd
	INNER JOIN patient_dimension p on o.patient_num = p.patient_num
	WHERE c.concept_cd LIKE 'ICD9:%') as diagnoses;
    
SET @sql = CONCAT('SELECT p.patient_num, ', @sql, ' from patient_dimension p;');

SELECT @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


