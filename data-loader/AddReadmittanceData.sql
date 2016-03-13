INSERT INTO `NEMO_Datamart`.`PatientReadmittance`
(`patient_num`)
SELECT patient_num FROM NEMO_Datamart.patient_dimension
WHERE NOT EXISTS (SELECT patient_num FROM NEMO_Datamart.PatientReadmittance);

SET SQL_SAFE_UPDATES = 0;

UPDATE `NEMO_Datamart`.`PatientReadmittance`
SET
`readmitted` = 1
WHERE `patient_num` IN 
(SELECT patient_num FROM
	(
		SELECT 
		vIn.patient_num, 
		vIn.start_date as InStart,
		vIn.end_date as InEnd,
		vOut.start_date as OutStart,
		vOut.end_date as OutEnd
		FROM NEMO_Datamart.visit_dimension vOut
		INNER JOIN NEMO_Datamart.visit_dimension vIn ON vIn.patient_num = vOut.patient_num AND vIn.encounter_num <> vOut.encounter_num
		WHERE 
		vIn.inout_cd = 'I' 
		AND vOut.inout_cd = 'I' 
		AND vIn.start_date BETWEEN vOut.start_date AND DATE_ADD(vOut.start_date,INTERVAL 30 DAY)
		ORDER BY vIn.patient_num, vOut.end_date ASC
	) as readmitted
);

SET SQL_SAFE_UPDATES = 1;