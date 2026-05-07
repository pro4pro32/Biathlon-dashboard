import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAthleteData } from '../lib/api';
import StatCard from '../components/StatCard';
import InsightCard from '../components/InsightCard';

const Compare = () => {
    const { athleteId1, athleteId2 } = useParams();
    const [athlete1, setAthlete1] = useState(null);
    const [athlete2, setAthlete2] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const [data1, data2] = await Promise.all([
                    getAthleteData(athleteId1),
                    getAthleteData(athleteId2),
                ]);
                setAthlete1(data1);
                setAthlete2(data2);
            } catch (error) {
                console.error('Error fetching athlete data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAthletes();
    }, [athleteId1, athleteId2]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold">Compare Athletes</h1>
            <div className="flex space-x-4">
                <StatCard title={athlete1.athlete_name} data={athlete1} />
                <StatCard title={athlete2.athlete_name} data={athlete2} />
            </div>
            <div className="flex flex-col space-y-2">
                <InsightCard athlete={athlete1} />
                <InsightCard athlete={athlete2} />
            </div>
            <div className="flex space-x-4">
                <div>
                    <h2 className="text-xl">Shooting Accuracy</h2>
                    <p>{athlete1.shooting_accuracy}% vs {athlete2.shooting_accuracy}%</p>
                </div>
                <div>
                    <h2 className="text-xl">Skiing Speed</h2>
                    <p>{athlete1.ski_time} vs {athlete2.ski_time}</p>
                </div>
            </div>
        </div>
    );
};

export default Compare;