from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import random

app = FastAPI()

# Constants for mock data
ATHLETE_ROSTER_M = [
    {"athlete_name": "Eric Perrot", "country": "France", "shooting_prone": 90, "shooting_standing": 85, "total_time": 1200, "ski_time": 1150, "misses": 2, "race_id": 1},
    {"athlete_name": "Johannes Thingnes Bø", "country": "Norway", "shooting_prone": 88, "shooting_standing": 80, "total_time": 1210, "ski_time": 1160, "misses": 3, "race_id": 1},
    # Add more male athletes...
]

ATHLETE_ROSTER_F = [
    {"athlete_name": "Tiril Eckhoff", "country": "Norway", "shooting_prone": 92, "shooting_standing": 87, "total_time": 1250, "ski_time": 1200, "misses": 1, "race_id": 1},
    {"athlete_name": "Julia Simon", "country": "France", "shooting_prone": 89, "shooting_standing": 84, "total_time": 1260, "ski_time": 1210, "misses": 2, "race_id": 1},
    # Add more female athletes...
]

class Athlete(BaseModel):
    athlete_name: str
    country: str
    shooting_prone: int
    shooting_standing: int
    total_time: int
    ski_time: int
    misses: int
    race_id: int

@app.get("/api/athletes")
def get_athletes(gender: str = "male"):
    if gender == "male":
        return JSONResponse(content=ATHLETE_ROSTER_M)
    elif gender == "female":
        return JSONResponse(content=ATHLETE_ROSTER_F)
    else:
        raise HTTPException(status_code=400, detail="Invalid gender specified")

@app.get("/api/athletes/{athlete_id}")
def get_athlete(athlete_id: int, gender: str = "male"):
    if gender == "male":
        athlete = ATHLETE_ROSTER_M[athlete_id]
    elif gender == "female":
        athlete = ATHLETE_ROSTER_F[athlete_id]
    else:
        raise HTTPException(status_code=400, detail="Invalid gender specified")
    
    return JSONResponse(content=athlete)

@app.get("/api/races")
def get_races():
    # Mock race data
    races = [
        {"race_id": 1, "name": "Race 1", "date": "2026-01-01"},
        {"race_id": 2, "name": "Race 2", "date": "2026-01-08"},
        # Add more races...
    ]
    return JSONResponse(content=races)

@app.get("/api/races/{race_id}")
def get_race(race_id: int):
    # Mock race results
    results = [
        {"athlete_id": 0, "time": 1200, "shooting_results": "1-0-2-1"},
        {"athlete_id": 1, "time": 1210, "shooting_results": "0-1-1-1"},
        # Add more results...
    ]
    return JSONResponse(content={"race_id": race_id, "results": results})

@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    # Mock summary data
    summary = {
        "top_athletes": ATHLETE_ROSTER_M[:5],
        "latest_race": {"race_id": 1, "winner": "Eric Perrot"},
        # Add more summary data...
    }
    return JSONResponse(content=summary)

# Run the application with: uvicorn server:app --reload
