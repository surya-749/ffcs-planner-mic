'use client';

import React from 'react';

interface SchemeSelectorProps {
    selectedScheme: string | null;
    onSchemeSelect: (scheme: string) => void;
}

const schemes = [
    { id: 'SCOPE', name: 'SCOPE (B.Tech CSE)' },
    { id: 'SENSE', name: 'SENSE (B.Tech Electronics)' },
    { id: 'SELECT', name: 'SELECT (B.Tech Electrical)' },
    { id: 'SMEC', name: 'SMEC (B.Tech Mechanical)' },
    { id: 'SCHEME', name: 'SCHEME (B.Tech General)' },
    { id: 'SCORE', name: 'SCORE (B.Tech CSE Specialty)' },
    { id: 'SBST', name: 'SBST (B.Tech Biotechnology)' },
    { id: 'SCE', name: 'SCE (B.Tech Civil)' },
    { id: 'SHINE', name: 'SHINE (B.Tech Others)' },
    { id: 'SCOPE_F', name: 'SCOPE_F (Foreign) ' },
    { id: 'MTech_SCOPE', name: 'MTech SCOPE' },
    { id: 'MTech_SCORE', name: 'MTech SCORE' },
];

export default function SchemeSelector({
    selectedScheme,
    onSchemeSelect,
}: SchemeSelectorProps) {
    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 1: Select Your Department/Scheme
                </h2>
                <p className="text-gray-600 mb-6">
                    Choose your academic program to see available courses:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schemes.map(scheme => (
                        <button
                            key={scheme.id}
                            onClick={() => onSchemeSelect(scheme.id)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                                selectedScheme === scheme.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            {scheme.name}
                        </button>
                    ))}
                </div>

                {selectedScheme && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">
                            ✓ Selected: <span className="font-bold">{schemes.find(s => s.id === selectedScheme)?.name}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
