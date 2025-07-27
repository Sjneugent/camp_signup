@echo off
echo Setting up Event Registration System...

echo Installing root dependencies...
call npm install

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Creating configuration directory...
mkdir backend\config 2>NUL

echo Creating default classes configuration if not exists...
if not exist backend\config\classes.json (
    echo Writing default classes configuration...
    (
        echo {
        echo   "classes": [
        echo     {
        echo       "name": "Art & Drawing",
        echo       "capacity": 20,
        echo       "description": "Explore various art mediums and drawing techniques."
        echo     },
        echo     {
        echo       "name": "Music Fundamentals",
        echo       "capacity": 15,
        echo       "description": "Introduction to music theory and basic instruments."
        echo     },
        echo     {
        echo       "name": "Science Experiments",
        echo       "capacity": 18,
        echo       "description": "Hands-on science experiments and principles."
        echo     },
        echo     {
        echo       "name": "Math Challenge",
        echo       "capacity": 20,
        echo       "description": "Problem-solving and mathematical concepts."
        echo     },
        echo     {
        echo       "name": "Drama & Theater",
        echo       "capacity": 15,
        echo       "description": "Acting, improvisation, and stage performance."
        echo     },
        echo     {
        echo       "name": "Sports & Athletics",
        echo       "capacity": 25,
        echo       "description": "Team sports, physical activities, and coordination."
        echo     },
        echo     {
        echo       "name": "Coding Basics",
        echo       "capacity": 18,
        echo       "description": "Introduction to programming concepts and logic."
        echo     },
        echo     {
        echo       "name": "Cooking & Nutrition",
        echo       "capacity": 15,
        echo       "description": "Prepare simple recipes and learn about nutrition."
        echo     },
        echo     {
        echo       "name": "Robotics",
        echo       "capacity": 12,
        echo       "description": "Building and programming simple robots."
        echo     },
        echo     {
        echo       "name": "Dance",
        echo       "capacity": 20,
        echo       "description": "Various dance styles and movement coordination."
        echo     },
        echo     {
        echo       "name": "Chess & Strategy Games",
        echo       "capacity": 16,
        echo       "description": "Learn chess and other strategic thinking games."
        echo     }
        echo   ]
        echo }
    ) > backend\config\classes.json
)

echo Setup complete!
echo.
echo Run "run.bat" to start the application
pause
