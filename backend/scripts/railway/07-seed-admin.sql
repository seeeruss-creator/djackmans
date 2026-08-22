INSERT IGNORE INTO users (name, username, email, password, role, status)
VALUES (
  'Admin User',
  'admin',
  'admin@djackman.com',
  '$2a$10$MS94wWoAKzBn51EZTl.M0uVsQYMOBymOXRCsswObYx.MmWOq7ZBci',
  'admin',
  'active'
);
