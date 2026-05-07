import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../lib/api';
import StatCard from '../components/StatCard';
import TargetDots from '../components/TargetDots';

const Race = () => {
    const { id } = useParams();
    const [raceData, setRaceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRaceData = async () => {
            try {
                const response = await axios.get(`/api/races/${id}`);
                setRaceData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRaceData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading race data.</div>;

    const { results, fastest_skier_id, best_shooter_id } = raceData;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Race Overview</h1>
            <div className="mb-4">
                <h2 className="text-xl">Leaderboard</h2>
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Rank</th>
                            <th className="border border-gray-300 p-2">Athlete</th>
                            <th className="border border-gray-300 p-2">Shooting Results</th>
                            <th className="border border-gray-300 p-2">Total Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((athlete, index) => (
                            <tr key={athlete.athlete_id} className={athlete.athlete_id === fastest_skier_id ? 'bg-cyan-100' : athlete.athlete_id === best_shooter_id ? 'bg-yellow-100' : ''}>
                                <td className="border border-gray-300 p-2">{index + 1}</td>
                                <td className="border border-gray-300 p-2">{athlete.athlete_name}</td>
                                <td className="border border-gray-300 p-2">
                                    <TargetDots results={athlete.shooting_results} />
                                </td>
                                <td className="border border-gray-300 p-2">{athlete.total_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between">
                <StatCard title="Fastest Skier" value={fastest_skier_id} />
                <StatCard title="Best Shooter" value={best_shooter_id} />
            </div>
        </div>
    );
};

export default Race;