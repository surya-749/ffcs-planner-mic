'use client';

import React, { useState, useMemo } from 'react';
import { fullCourseData } from '@/lib/type';
import { getCourseType } from '@/lib/course_codes_map';

interface CourseSelectorProps {
    scheme: string;
    onCourseSelect: (course: fullCourseData) => void;
    selectedCourses: fullCourseData[];
}

export default function CourseSelector({
    scheme,
    onCourseSelect,
    selectedCourses,
}: CourseSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string>('');

    const [schemeData, categories, courses] = useMemo(() => {
        try {
            // Dynamically import scheme data
            let data: any = {};
            let cats: string[] = [];

            // Map scheme names to their data
            const schemeMap: { [key: string]: any } = {
                SCOPE: require('@/data/SCOPE').SCOPE_LIST,
                SENSE: require('@/data/SENSE').SENSE_LIST,
                SELECT: require('@/data/SELECT').SELECT_LIST,
                SMEC: require('@/data/SMEC').SMEC_LIST,
                SCHEME: require('@/data/SCHEME').SCHEME_LIST,
                SCORE: require('@/data/SCORE').SCORE_LIST,
                SBST: require('@/data/SBST').SBST_LIST,
                SCE: require('@/data/SCE').SCE_LIST,
                SHINE: require('@/data/SHINE').SHINE_LIST,
                SCOPE_F: require('@/data/SCOPE_F').SCOPE_F,
                MTech_SCOPE: require('@/data/MTech_SCOPE').MTech_SCOPE,
                MTech_SCORE: require('@/data/MTech_SCORE').MIS_LIST,
            };

            data = schemeMap[scheme] || {};
            cats = Object.keys(data);

            // Flatten all courses from all categories
            const allCourses: { [key: string]: any } = {};
            for (const category of cats) {
                const categoryData = data[category];
                if (categoryData) {
                    Object.assign(allCourses, categoryData);
                }
            }

            return [data, cats, allCourses];
        } catch (error) {
            console.error('Error loading scheme data:', error);
            return [{}, [], {}];
        }
    }, [scheme]);

    const filteredCourses = useMemo(() => {
        let filtered = Object.entries(courses);

        if (selectedCategory) {
            const categoryData = schemeData[selectedCategory] || {};
            filtered = Object.entries(categoryData);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                ([courseCode]) =>
                    courseCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [selectedCategory, searchTerm, courses, schemeData]);

    const buildFullCourseData = (courseCode: string, courseOptions: any): fullCourseData => {
        // Extract course code and name from format like "BCSE202L - Data Structures and Algorithms"
        const [code, ...nameParts] = courseCode.split(' - ');
        const courseName = nameParts.join(' - ') || courseCode;
        
        // Determine course type
        const courseType = getCourseType(code);

        // Default to single slot per faculty if not provided
        const courseSlots = Array.isArray(courseOptions)
            ? courseOptions.map((option: any) => ({
                  slotName: option.slot || '',
                  slotFaculties: [
                      {
                          facultyName: option.faculty || '',
                          facultyLabSlot: option.labSlot,
                      },
                  ],
              }))
            : [];

        return {
            id: courseCode,
            courseType,
            courseCode: code,
            courseName,
            courseSlots,
        };
    };

    const handleCourseSelect = (courseCode: string, courseOptions: any) => {
        const fullData = buildFullCourseData(courseCode, courseOptions);
        onCourseSelect(fullData);
    };

    const isSelected = (courseCode: string) => {
        return selectedCourses.some(c => c.id === courseCode);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 2: Select Courses
                </h2>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search courses by code (e.g., BCSE202L)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Category Selector */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        Course Categories
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`p-2 rounded border text-sm font-medium transition-all ${
                                !selectedCategory
                                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                            }`}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`p-2 rounded border text-sm font-medium transition-all ${
                                    selectedCategory === category
                                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(([courseCode, courseOptions]) => {
                            const [code] = courseCode.split(' - ');
                            return (
                                <div
                                    key={courseCode}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        isSelected(courseCode)
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-mono font-bold text-gray-800">
                                                {code}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {courseCode.split(' - ').slice(1).join(' - ')}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                {Array.isArray(courseOptions)
                                                    ? `${courseOptions.length} slot option(s)`
                                                    : 'No slots available'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleCourseSelect(courseCode, courseOptions)
                                            }
                                            className={`ml-4 px-4 py-2 rounded font-medium transition-all whitespace-nowrap ${
                                                isSelected(courseCode)
                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            {isSelected(courseCode) ? '✓ Added' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No courses found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
