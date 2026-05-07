import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/api';
import StatCard from '../components/StatCard';
import InsightCard from '../components/InsightCard';

const Athletes = () => {
    const [athletes, setAthletes] = useState([]);
    const [selectedAthlete, setSelectedAthlete] = useState(null);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const response = await axios.get('/api/athletes');
                setAthletes(response.data);
                if (response.data.length > 0) {
                    setSelectedAthlete(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching athletes:', error);
            }
        };

        fetchAthletes();
    }, []);

    const handleAthleteSelect = (athlete) => {
        setSelectedAthlete(athlete);
    };

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-2xl font-bold text-white">Athletes</h1>
            <div className="flex flex-wrap mt-4">
                {athletes.map((athlete) => (
                    <div key={athlete.id} className="m-2">
                        <Link to={`/athletes/${athlete.id}`} onClick={() => handleAthleteSelect(athlete)}>
                            <StatCard athlete={athlete} />
                        </Link>
                    </div>
                ))}
            </div>
            {selectedAthlete && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-white">{selectedAthlete.athlete_name}</h2>
                    <InsightCard insight={selectedAthlete.insight} />
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard title="Shooting Accuracy" value={`${selectedAthlete.shooting_accuracy}%`} />
                        <StatCard title="Total Misses" value={selectedAthlete.misses} />
                        <StatCard title="Skiing Time" value={`${selectedAthlete.ski_time} seconds`} />
                        <StatCard title="Total Time" value={`${selectedAthlete.total_time} seconds`} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Athletes;