import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '../lib/api';
import StatCard from '../components/StatCard';
import ScatterPlot from '../components/ScatterPlot';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetchDashboardData();
                setData(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashboard">
            <h1 className="text-primary">Biathlon Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Top 5 Athletes" data={data.top5} />
                <StatCard title="Season Trend" data={data.trend} />
                <StatCard title="Latest Podium" data={data.latestRace} />
            </div>
            <ScatterPlot data={data.scatter} />
        </div>
    );
};

export default Dashboard;