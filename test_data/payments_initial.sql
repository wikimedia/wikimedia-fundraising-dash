INSERT INTO payments_initial
SELECT NULL, ct.id, ex.gateway, ex.gateway_txn_id, ex.gateway_txn_id, 'process', 'complete', NULL, NULL, ctry.iso_code, ex.original_amount, ex.original_currency, 'server1', con.receive_date
FROM drupal.contribution_tracking ct
INNER JOIN civicrm.civicrm_contribution con ON ct.contribution_id = con.id
INNER JOIN civicrm.wmf_contribution_extra ex ON ex.entity_id = con.id
INNER JOIN civicrm.civicrm_contact c ON con.contact_id = c.id
INNER JOIN civicrm.civicrm_address a ON a.contact_id = c.id
INNER JOIN civicrm.civicrm_country ctry ON a.country_id = ctry.id
LEFT JOIN payments_initial i ON i.contribution_tracking_id = ct.id
WHERE a.is_primary = 1
AND i.id IS NULL;

UPDATE payments_initial
SET payment_method = 'amazon', payment_submethod = ''
WHERE gateway = 'amazon'
AND payment_method IS NULL;

UPDATE payments_initial
SET payment_method = 'paypal', payment_submethod = ''
WHERE gateway = 'paypal'
AND payment_method IS NULL;

UPDATE payments_initial
SET payment_method = 'cc'
WHERE id % 10 < 8
AND payment_method IS NULL;

UPDATE payments_initial
SET payment_method = 'rtbt'
WHERE id % 10 = 8
AND payment_method IS NULL;

UPDATE payments_initial
SET payment_method = 'obt'
WHERE id % 10 = 9
AND payment_method IS NULL;

-- TODO: submethods

