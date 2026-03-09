'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTimetable } from '@/lib/TimeTableContext';
import { exportToPDF } from '@/lib/exportToPDF';
import { generateTT } from '@/lib/utils';
import { getSlotViewPayload } from '@/lib/slot-view';
import { fullCourseData, timetableDisplayData } from '@/lib/type';

const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
};

const SLOT_COLORS = ['#C8F7DC', '#E0D4F5', '#FFF3B0', '#FFD6E0', '#BDD7FF', '#B8F0E0'];

function getSlotColor(code: string, allCodes: string[]) {
    const unique = [...new Set(allCodes)];
    const idx = unique.indexOf(code);
    return SLOT_COLORS[idx % SLOT_COLORS.length];
}

export default function TimetablePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { timetableData, setTimetableData } = useTimetable();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<timetableDisplayData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [clashMessage, setClashMessage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const { scheduleRows, leftTimes, rightTimes } = useMemo(() => getSlotViewPayload(), []);

    // Load from cookies and generate if context is empty
    useEffect(() => {
        if (!timetableData || timetableData.length === 0) {
            const savedCoursesRaw = getCookie('preferenceCourses');
            if (savedCoursesRaw) {
                try {
                    setIsGenerating(true);
                    const savedCourses = JSON.parse(savedCoursesRaw) as fullCourseData[];
                    const { result, clashes } = generateTT(savedCourses);
                    setTimetableData(result);
                    setClashMessage(clashes);
                } catch (error) {
                    console.error('Error generating timetable:', error);
                } finally {
                    setIsGenerating(false);
                }
            }
        }
    }, [timetableData, setTimetableData]);

    const currentTT = timetableData?.[currentIndex] || [];
    const allCodes = currentTT.map(s => s.courseCode);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }, []);

    const handleSave = async (isPublic = false) => {
        if (!session?.user?.email || isSaving || currentTT.length === 0) return;
        setIsSaving(true);
        try {
            const title = isPublic ? 'Shared Timetable' : (prompt('Enter a title for this timetable:', 'My Schedule') || 'Untitled');
            const res = await axios.post('/api/save-timetable', {
                title,
                slots: currentTT.map(s => ({
                    slot: s.slotName,
                    courseCode: s.courseCode,
                    courseName: s.courseName,
                    facultyName: s.facultyName,
                })),
                owner: session.user.email,
                isPublic,
            });

            if (res.data.success) {
                if (!isPublic) showToast('Timetable saved successfully!');
                return res.data.timetable;
            }
        } catch (error) {
            console.error('Save error:', error);
            showToast('Failed to save timetable.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = async () => {
        if (currentTT.length === 0) return;
        showToast('Preparing PDF...');
        await exportToPDF('timetable-grid', `timetable-option-${currentIndex + 1}.pdf`);
    };

    const handleShare = async () => {
        if (!session?.user?.email || currentTT.length === 0) return;
        const saved = await handleSave(true);
        if (saved?.shareId) {
            const url = `${window.location.origin}/share/${saved.shareId}`;
            await navigator.clipboard.writeText(url);
            showToast('Share link copied to clipboard!');
        }
    };

    /* Build the grid display data for rendering */
    const theoryGrid: (timetableDisplayData | null)[][] = Array.from({ length: 5 }, () => Array(13).fill(null));
    const labGrid: (timetableDisplayData | null)[][] = Array.from({ length: 5 }, () => Array(13).fill(null));

    currentTT.forEach(s => {
        const parts = s.slotName.split(/\+|__/);
        parts.forEach(p => {
            const cleanP = p.trim();
            // We need to find where this slot belongs in our 5x13 grid
            scheduleRows.forEach((row, dayIdx) => {
                row.theoryLeft.forEach((cell, colIdx) => { if (cell.key === cleanP) theoryGrid[dayIdx][colIdx] = s; });
                row.theoryRight.forEach((cell, colIdx) => { if (cell.key === cleanP) theoryGrid[dayIdx][colIdx + 7] = s; });
                row.labLeft.forEach((cell, colIdx) => { if (cell.key === cleanP) labGrid[dayIdx][colIdx] = s; });
                row.labRight.forEach((cell, colIdx) => { if (cell.key === cleanP) labGrid[dayIdx][colIdx + 7] = s; });
            });
        });
    });

    if (status === 'loading' || isGenerating) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-[16px] font-bold text-gray-700">Generating your timetables...</p>
                </div>
            </div>
        );
    }

    if (!timetableData || timetableData.length === 0) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-black text-black mb-4">No Timetables Found</h1>
                <p className="text-gray-600 mb-8 max-w-md text-center">
                    {clashMessage || "We couldn't generate any non-clashing combinations based on your selections."}
                </p>
                <button 
                    onClick={() => router.push('/courses')}
                    className="px-8 py-3 bg-[#A0C4FF] text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                    Back to Selection
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-sans flex flex-col items-center ">
            {/* Toast */}
            {toast && (
                <div className="fixed top-8 right-8 z-[100] bg-[#1a1a2e] text-white px-8 py-4 rounded-2xl shadow-2xl text-[14px] font-bold animate-[slideIn_0.3s_ease] border border-white/10">
                    {toast}
                </div>
            )}

            <div className="w-full p-8 ">
                <h1 className="text-3xl font-bold text-black pb-4">Timetables Generated</h1>

                {/* Main Table Container */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-x-auto border border-gray-100" id="timetable-grid">
                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 text-center text-sm font-bold text-black border-r border-gray-200 bg-white">Theory Hours</th>
                                {[...leftTimes, { theory: '', lab: '' }, ...rightTimes].map((t, i) => (
                                    <th key={i} className={` text-center text-xs font-bold text-black border-r border-gray-200 bg-white ${i === 6 ? 'w-[40px] px-0' : ''}`}>
                                        {t.theory ? t.theory.split('-').map((part, idx, arr) => (
                                            <span key={idx} className="block whitespace-nowrap">{part}{idx < arr.length - 1 ? '-' : ''}</span>
                                        )) : null}
                                    </th>
                                ))}
                            </tr>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 text-center text-sm font-bold text-black border-r border-gray-200 bg-white">Lab Hours</th>
                                {[...leftTimes, { theory: '', lab: '' }, ...rightTimes].map((t, i) => (
                                    <th key={i} className={` text-center text-xs font-bold text-black border-r border-gray-200 bg-white ${i === 6 ? 'w-[40px] px-0' : ''}`}>
                                        {t.lab ? t.lab.split('-').map((part, idx, arr) => (
                                            <span key={idx} className="block whitespace-nowrap">{part}{idx < arr.length - 1 ? '-' : ''}</span>
                                        )) : null}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleRows.map((row, rowIdx) => (
                                <tr key={row.day} className="group border-b border-gray-200">
                                    <td className="p-0 text-sm font-bold text-black text-center align-middle w-[8vw] border-r border-gray-200 bg-white">{row.day}</td>
                                    {Array.from({ length: 13 }).map((_, colIdx) => {
                                        if (colIdx === 6) {
                                             // Space for Lunch
                                             const lunchLetters = ['L', 'U', 'N', 'C', 'H'];
                                             return (
                                                <td key="lunch-spacer" className="w-[4vw] border-r border-gray-200 align-middle bg-white">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm font-bold text-black opacity-80">
                                                            {lunchLetters[rowIdx]}
                                                        </span>
                                                    </div>
                                                </td>
                                             )
                                        }
                                        const actualColIdx = colIdx > 6 ? colIdx - 1 : colIdx;
                                        const theoryCell = theoryGrid[rowIdx][colIdx];
                                        const labCell = labGrid[rowIdx][colIdx];
                                        
                                        // Get labels from scheduleRows
                                        let theoryLabel = '';
                                        let labLabel = '';
                                        if (colIdx < 6) {
                                            theoryLabel = row.theoryLeft[colIdx].label;
                                            labLabel = row.labLeft[colIdx].label;
                                        } else {
                                            theoryLabel = row.theoryRight[colIdx-7].label;
                                            labLabel = row.labRight[colIdx-7].label;
                                        }

                                        return (
                                            <td key={colIdx} className={`p-2 align-top border-r border-gray-200 bg-white`}>
                                                <div className="flex flex-col gap-4 ">
                                                    {/* Theory Slot */}
                                                    <div
                                                        className={`rounded-lg  flex flex-col items-center justify-center transition-all cursor-pointer ${theoryCell ? 'shadow-sm z-10' : 'bg-transparent'
                                                            }`}
                                                        style={{
                                                            backgroundColor: theoryCell ? getSlotColor(theoryCell.courseCode, allCodes) : 'transparent',
                                                        }}
                                                        onClick={() => theoryCell && setSelectedSlot(theoryCell)}
                                                    >
                                                        <span className={`text-xs font-bold ${theoryCell ? 'text-black' : 'text-gray-400'}`}>{theoryLabel}</span>
                                                        {theoryCell && <span className="text-[10px] font-semibold opacity-80 uppercase mt-0.5 truncate max-w-[60px] text-black">{theoryCell.courseCode}</span>}
                                                    </div>

                                                    {/* Lab Slot */}
                                                    <div
                                                        className={`rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${labCell ? 'shadow-sm z-10' : 'bg-transparent'
                                                            }`}
                                                        style={{
                                                            backgroundColor: labCell ? getSlotColor(labCell.courseCode, allCodes) : 'transparent',
                                                        }}
                                                        onClick={() => labCell && setSelectedSlot(labCell)}
                                                    >
                                                        <span className={`text-xs font-bold ${labCell ? 'text-black' : 'text-gray-400'}`}>{labLabel}</span>
                                                        {labCell && <span className="text-[10px] font-semibold opacity-80 uppercase mt-0.5 truncate max-w-[60px] text-black">{labCell.courseCode}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                
                {/* Pagination & Action Controls */}
                <div className="flex flex-wrap items-center justify-between p-4 mt-8 mb-4">
                    {/* Pagination */}
                    <div className="flex items-center gap-1 bg-[#8ab2f2] p-2 rounded-lg shadow-sm">
                         <button
                            onClick={() => setCurrentIndex(0)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-black hover:bg-white/40 transition-colors font-bold"
                        >
                            «
                        </button>
                        <div className="flex gap-1">
                             {[0, 1, 2, 3].map(idx => (
                                idx < (timetableData?.length || 0) && (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm transition-all ${currentIndex === idx
                                            ? 'bg-white text-black shadow-sm'
                                            : 'bg-transparent text-black hover:bg-white/40'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentIndex((timetableData?.length || 1) - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-black hover:bg-white/40 transition-colors font-bold"
                        >
                            »
                        </button>
                    </div>

                    {/* Action Bar */}
                    <div className="display-absolute position-fixed mb-90 flex items-center gap-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-[#A0C4FF] hover:bg-[#8ab2f2] text-black font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
                            Share
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-[#C8F7DC] hover:bg-[#b0eac8] text-black font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                            Download
                        </button>
                        <button
                            onClick={() => handleSave()}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-[#f3e8ff] hover:bg-[#e9d5ff] text-black font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 text-sm"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                            Save
                        </button>
                    </div>
                </div></div>

                
            </div>

            {/* Footer Navigation - Matching Preferences Page Style */}
            <div className="w-full absolute bottom-0 bg-white py-4 px-6 shadow-md flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 bg-gray-100/50 py-2 px-4 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-sm overflow-hidden">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            "👤"
                        )}
                    </div>
                    <span className="text-gray-700 text-sm font-semibold truncate max-w-[200px]">{session?.user?.name || 'Sravan Kowsik Gonuguntla'}</span>
                </div>

                <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map(num => (
                        <button 
                            key={num} 
                            onClick={() => {
                                if (num === 1) router.push('/preferences');
                                if (num === 2) router.push('/courses');
                                if (num === 3) router.push('/timetable');
                                if (num === 4) router.push('/saved');
                            }}
                            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                                num === 3 
                                    ? 'bg-[#A0C4FF] text-black' 
                                    : 'bg-[#A0C4FF]/40 text-gray-700 hover:bg-[#A0C4FF]/60'
                            }`}
                        >
                            {num === 3 ? '3. Timetable' : num}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/courses')}
                        className="px-8 py-2.5 bg-[#fef9c3] rounded-lg font-semibold text-sm hover:bg-[#fde047] text-black transition-all duration-200"
                    >
                        previous
                    </button>
                    <button
                        onClick={() => router.push('/saved')}
                        className="px-10 py-2.5 rounded-lg font-semibold text-sm bg-[#A0C4FF] hover:bg-[#90B4EF] text-black transition-all duration-200"
                    >
                        next
                    </button>
                </div>
            </div>

            {/* Popover */}
            {selectedSlot && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-[4px]" onClick={() => setSelectedSlot(null)}>
                    <div
                        className="bg-white rounded-[40px] shadow-2xl p-12 w-[90%] max-w-[500px] relative animate-[scaleIn_0.2s_ease] border-4"
                        style={{ borderColor: getSlotColor(selectedSlot.courseCode, allCodes) }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedSlot(null)}
                            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-black"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>

                        <div className="mb-10">
                            <span className="px-5 py-2 rounded-full text-[12px] font-black bg-gray-100 text-gray-500 uppercase tracking-widest mb-4 inline-block">Course Details</span>
                            <h2 className="text-[32px] font-black text-black leading-tight mt-2">{selectedSlot.courseCode}</h2>
                            <p className="text-[18px] font-bold text-gray-600 mt-2">{selectedSlot.courseName}</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[20px]">👨‍🏫</div>
                                <div>
                                    <p className="text-[12px] font-black text-gray-300 uppercase tracking-widest mb-1">Faculty</p>
                                    <p className="text-[18px] font-bold text-black">{selectedSlot.facultyName}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[20px]">🕒</div>
                                <div>
                                    <p className="text-[12px] font-black text-gray-300 uppercase tracking-widest mb-1">Slot</p>
                                    <p className="text-[18px] font-bold text-black">{selectedSlot.slotName}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[20px]">📍</div>
                                <div>
                                    <p className="text-[12px] font-black text-gray-300 uppercase tracking-widest mb-1">Classroom</p>
                                    <p className="text-[18px] font-bold text-black">Main Campus - TBD</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
