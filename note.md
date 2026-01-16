## pgadmin usefull 
```sql
--delete database try 
DROP DATABASE bonprof; 

-- les sessions qui utilise ma base de donnée
SELECT pid, usename, application_name, client_addr
FROM pg_stat_activity
WHERE datname = 'bonprof';

-- arret des sessions 
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bonprof'
  AND pid <> pg_backend_pid();
```