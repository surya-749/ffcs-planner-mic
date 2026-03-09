'use client';

import React from 'react';
import { fullCourseData } from '@/lib/type';

interface CoursePreviewProps {
    selectedCourses: fullCourseData[];
    onRemoveCourse: (courseCode: string) => void;
    onClearAll: () => void;
}

export default function CoursePreview({
    selectedCourses,
    onRemoveCourse,
    onClearAll,
}: CoursePreviewProps) {
    if (selectedCourses.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Selected Courses ({selectedCourses.length})
                    </h2>
                    {selectedCourses.length > 0 && (
                        <button
                            onClick={onClearAll}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedCourses.map(course => (
                        <div
                            key={course.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start"
                        >
                            <div className="flex-1">
                                <div className="font-mono font-bold text-gray-900">
                                    {course.courseCode}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {course.courseName}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    Type: <span className="font-medium">{course.courseType}</span>
                                    {' | '}
                                    Slots: <span className="font-medium">{course.courseSlots.length}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onRemoveCourse(course.courseCode)}
                                className="ml-4 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all font-medium text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                        <strong>Next Step:</strong> Review your selected courses and proceed to the next step to generate timetables.
                    </p>
                </div>
            </div>
        </div>
    );
}
