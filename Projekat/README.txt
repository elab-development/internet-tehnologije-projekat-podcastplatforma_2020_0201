README.txt

Potrebno je u MySQL Workbenchu pokrenuti 
create databse podcast_platform.

U Laravel/podcast-platform/.env podesiti podatke o DB konekciji (username i password) 

Iz Laravel/podcast-platform treba pokrenuti sledece komande:

php aritsan migrate
php artisan storage:link
php artisan serve (za pokretanje servera)

Iz React2/my-podcast-plaform treba pokrenuti
npm start