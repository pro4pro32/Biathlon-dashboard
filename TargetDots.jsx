import React from 'react';

const TargetDots = ({ results }) => {
    const totalShots = 5; // Total number of shots in a bout

    return (
        <div className="flex space-x-1">
            {Array.from({ length: totalShots }, (_, index) => {
                const shotResult = results[index] || null; // Get the result for the current shot
                const dotClass = shotResult === 1 ? 'bg-yellow-500' : shotResult === 0 ? 'bg-red-500' : 'bg-gray-400'; // Yellow for hit, red for miss, gray for no result

                return (
                    <div key={index} className={`w-4 h-4 rounded-full ${dotClass}`} />
                );
            })}
        </div>
    );
};

export default TargetDots;