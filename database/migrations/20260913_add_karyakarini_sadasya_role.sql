-- Additive role change only: this preserves every existing role and member row.
ALTER TABLE `members`
  MODIFY COLUMN `role` ENUM(
    'President',
    'Vice President',
    'Secretary',
    'Joint Secretary',
    'Treasurer',
    'Media Prabhari',
    'Core Committee Member',
    'KARYAKARINI SADASYA',
    'General Member'
  ) NOT NULL DEFAULT 'General Member';
