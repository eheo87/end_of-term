@echo off
echo Running dump...
set createTime=%date%_%time:~0,2%%time:~3,2%%time:~6,2%
 
"C:\Bitnami\wampstack-7.1.24-0\mysql\bin\"mysqldump -uroot -p111111 --databases wiki -r c:\backup\%createTime%.sql

7z a %createTime%.zip %createTime%.sql

del %createTime%.sql
set day=-5
echo before %day% day ago files deleting ...
forfiles /p D:\TEMP /m *.sql /d %day% /c &amp;quot;cmd /c del @file&amp;quot;
 
echo before %day% day ago files deleting finish
echo Done!