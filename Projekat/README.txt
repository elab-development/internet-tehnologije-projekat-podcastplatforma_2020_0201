README.txt

Potrebno je u MySQL Workbenchu pokrenuti 
create databse podcast_platform.

U Laravel/.env podesiti podatke o DB konekciji (username i password) 

Iz Laravel treba pokrenuti sledece komande:

php aritsan migrate
php artisan storage:link
php artisan serve (za pokretanje servera)

Iz React treba pokrenuti
npm start
