'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTimetable } from '@/lib/TimeTableContext';
import { exportToPDF } from '@/lib/exportToPDF';
import { timetableDisplayData } from '@/lib/type';

/* ── Slot → timetable grid mapping ── */
const THEORY_SLOTS: Record<string, [number, number]> = {};
const LAB_SLOTS: Record<string, [number, number]> = {};

const theoryLabels = [
    ['A1', 'F1', 'D1', 'TB1', 'TG1', 'S11', 'A2', 'F2', 'D2', 'TB2', 'TG2', 'S3', ''],
    ['B1', 'G1', 'E1', 'TC1', 'TAA1', '', 'B2', 'G2', 'E2', 'TC2', 'TAA2', 'S1', ''],
    ['C1', 'A1', 'F1', 'TD1', 'TBB1', '', 'C2', 'A2', 'F2', 'TD2', 'TBB2', 'S4', ''],
    ['D1', 'B1', 'G1', 'TE1', 'TCC1', '', 'D2', 'B2', 'G2', 'TE2', 'TCC2', 'S2', ''],
    ['E1', 'C1', 'TA1', 'TF1', 'TDD1', 'S15', 'E2', 'C2', 'TA2', 'TF2', 'TDD2', '', ''],
];
const labLabels = [
    ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L31', 'L32', 'L33', 'L34', 'L35', 'L36', ''],
    ['L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L37', 'L38', 'L39', 'L40', 'L41', 'L42', ''],
    ['L13', 'L14', 'L15', 'L16', 'L17', 'L18', 'L43', 'L44', 'L45', 'L46', 'L47', 'L48', ''],
    ['L19', 'L20', 'L21', 'L22', 'L23', 'L24', 'L49', 'L50', 'L51', 'L52', 'L53', 'L54', ''],
    ['L25', 'L26', 'L27', 'L28', 'L29', 'L30', 'L55', 'L56', 'L57', 'L58', 'L59', 'L60', ''],
];

theoryLabels.forEach((row, r) => row.forEach((s, c) => { if (s) THEORY_SLOTS[s] = [r, c]; }));
labLabels.forEach((row, r) => row.forEach((s, c) => { if (s) LAB_SLOTS[s] = [r, c]; }));

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const THEORY_TIMES = [
    '8:00am-8:50am', '8:55am-9:45am', '9:50am-10:40am', '10:45am-11:35am', '11:40am-12:30pm',
    '12:30pm-1:20pm', '2:00pm-2:50pm', '2:55pm-3:45pm', '3:50pm-4:40pm', '4:45pm-5:35pm',
    '5:40pm-6:30pm', '6:35pm-7:25pm', '',
];
const LAB_TIMES = THEORY_TIMES; // For now assuming same, UI shows Lab Hours row as well

const SLOT_COLORS = [
    '#C8F7DC', '#E0D4F5', '#FFF3B0', '#FFD6E0', '#BDD7FF', '#B8F0E0'
];

function getSlotColor(code: string, allCodes: string[]): string {
    const unique = [...new Set(allCodes)];
    const idx = unique.indexOf(code);
    return SLOT_COLORS[idx % SLOT_COLORS.length];
}

export default function TimetablePage() {
    // --- MOCK DATA FOR TESTING ---
    const MOCK_DATA: timetableDisplayData[][] = [
        [
            { courseCode: 'BPHY101L', courseName: 'Physics Theory', slotName: 'A1 + A1', facultyName: 'Dr. John Doe' },
            { courseCode: 'BPHY101P', courseName: 'Physics Lab', slotName: 'L39 + L40', facultyName: 'Prof. Alice Smith' },
            { courseCode: 'BCSE101L', courseName: 'C Programming', slotName: 'B1 + B1', facultyName: 'Dr. Bob Brown' },
            { courseCode: 'BMAT101L', courseName: 'Calculus', slotName: 'C1 + C1', facultyName: 'Dr. Sarah Wilson' },
            { courseCode: 'BENG101L', courseName: 'English', slotName: 'D1 + D1', facultyName: 'Prof. James Bond' },
        ],
        [
            { courseCode: 'BCSE102L', courseName: 'Data Structures', slotName: 'A2 + A2', facultyName: 'Dr. Eve Adams' },
            { courseCode: 'BCSE102P', courseName: 'DS Lab', slotName: 'L43 + L44', facultyName: 'Prof. Mike Ross' },
        ]
    ];

    const router = useRouter();
    // Bypass real auth for testing
    const session = { user: { name: 'Test User', email: 'test@example.com' } };
    const status = 'authenticated'; 
    const { timetableData: realData } = useTimetable();

    // Use real data if available, otherwise use mock data
    const timetableData = (realData && realData.length > 0) ? realData : MOCK_DATA;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<timetableDisplayData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState('');
    const gridRef = useRef<HTMLDivElement>(null);

    const currentTT = timetableData?.[currentIndex] || [];
    const allCodes = currentTT.map(s => s.courseCode);

    // useEffect for redirect removed for testing

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setTimeout(() => {
            showToast('TEST MODE: Timetable saved to console!');
            console.log('Saved Timetable:', currentTT);
            setIsSaving(false);
        }, 800);
    };

    const handleDownload = async () => {
        showToast('Preparing PDF...');
        await exportToPDF('timetable-grid', `timetable-option-${currentIndex + 1}.pdf`);
    };

    const handleShare = async () => {
        const shareId = 'mock123';
        const url = `${window.location.origin}/share/${shareId}`;
        await navigator.clipboard.writeText(url);
        showToast('TEST MODE: Mock share link copied!');
    };

    /* Build the grid display data */
    type CellData = timetableDisplayData | null;
    const theoryGrid: CellData[][] = Array.from({ length: 5 }, () => Array(13).fill(null));
    const labGrid: CellData[][] = Array.from({ length: 5 }, () => Array(13).fill(null));

    currentTT.forEach(s => {
        const parts = s.slotName.split('+');
        parts.forEach(p => {
            const cleanP = p.trim();
            if (THEORY_SLOTS[cleanP]) {
                const [r, c] = THEORY_SLOTS[cleanP];
                theoryGrid[r][c] = s;
            }
            if (LAB_SLOTS[cleanP]) {
                const [r, c] = LAB_SLOTS[cleanP];
                labGrid[r][c] = s;
            }
        });
    });

    if (status === 'loading') return null;

    return (
        <div className="min-h-screen bg-cream font-sans flex flex-col items-center pb-20 pt-12 px-6">
            {/* Toast */}
            {toast && (
                <div className="fixed top-8 right-8 z-[100] bg-[#1a1a2e] text-white px-8 py-4 rounded-2xl shadow-2xl text-[14px] font-bold animate-[slideIn_0.3s_ease] border border-white/10">
                    {toast}
                </div>
            )}

            <div className="w-full max-w-[1440px]">
                <h1 className="text-[42px] font-black text-black mb-10 tracking-tight">Timetables Generated</h1>

                {/* Main Content Area */}
                <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-12 relative overflow-x-auto border border-gray-50" id="timetable-grid">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="p-4 text-left text-[15px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-100 pb-6">Theory Hours</th>
                                {THEORY_TIMES.map((t, i) => (
                                    <th key={i} className={`p-4 text-center text-[12px] font-bold text-gray-400 border-b-2 border-gray-100 pb-6 ${i === 5 ? 'pr-12' : ''} ${i === 6 ? 'pl-12 border-l-2 border-gray-100' : ''}`}>
                                        {t}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th className="p-4 text-left text-[15px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-100 py-6">Lab Hours</th>
                                {LAB_TIMES.map((t, i) => (
                                    <th key={i} className={`p-4 text-center text-[12px] font-bold text-gray-400 border-b-2 border-gray-100 py-6 ${i === 5 ? 'pr-12' : ''} ${i === 6 ? 'pl-12 border-l-2 border-gray-100' : ''}`}>
                                        {t}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DAYS.map((day, rowIdx) => (
                                <tr key={day} className="group">
                                    <td className="p-6 text-[18px] font-black text-black align-middle w-[160px] border-b border-gray-50">{day}</td>
                                    {Array.from({ length: 13 }).map((_, colIdx) => {
                                        const theoryCell = theoryGrid[rowIdx][colIdx];
                                        const labCell = labGrid[rowIdx][colIdx];
                                        const theoryLabel = theoryLabels[rowIdx][colIdx];
                                        const labLabel = labLabels[rowIdx][colIdx];

                                        return (
                                            <td key={colIdx} className={`p-2 align-top border-b border-gray-50 ${colIdx === 5 ? 'pr-12' : ''} ${colIdx === 6 ? 'pl-12 border-l-2 border-gray-100' : ''}`}>
                                                <div className="flex flex-col gap-2 min-h-[110px] py-2">
                                                    {/* Theory Slot */}
                                                    <div
                                                        className={`rounded-2xl p-3 min-h-[50px] flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${theoryCell ? 'shadow-md hover:scale-[1.05] hover:shadow-lg z-10' : 'bg-transparent border-transparent'
                                                            }`}
                                                        style={{
                                                            backgroundColor: theoryCell ? getSlotColor(theoryCell.courseCode, allCodes) : 'transparent',
                                                            borderColor: theoryCell ? 'rgba(0,0,0,0.03)' : 'transparent'
                                                        }}
                                                        onClick={() => theoryCell && setSelectedSlot(theoryCell)}
                                                    >
                                                        <span className={`text-[12px] font-black ${theoryCell ? 'text-black' : 'text-gray-200'}`}>{theoryLabel || ''}</span>
                                                        {theoryCell && <span className="text-[10px] font-bold opacity-60 truncate max-w-full mt-0.5 uppercase">{theoryCell.courseCode}</span>}
                                                    </div>

                                                    {/* Lab Slot */}
                                                    <div
                                                        className={`rounded-2xl p-3 min-h-[50px] flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${labCell ? 'shadow-md hover:scale-[1.05] hover:shadow-lg z-10' : 'bg-transparent border-transparent'
                                                            }`}
                                                        style={{
                                                            backgroundColor: labCell ? getSlotColor(labCell.courseCode, allCodes) : 'transparent',
                                                            borderColor: labCell ? 'rgba(0,0,0,0.03)' : 'transparent'
                                                        }}
                                                        onClick={() => labCell && setSelectedSlot(labCell)}
                                                    >
                                                        <span className={`text-[12px] font-black ${labCell ? 'text-black' : 'text-gray-200'}`}>{labLabel || ''}</span>
                                                        {labCell && <span className="text-[10px] font-bold opacity-60 truncate max-w-full mt-0.5 uppercase">{labCell.courseCode}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* L U N C H spacer */}
                    <div className="absolute top-0 bottom-0 left-[50.2%] -translate-x-[50%] flex flex-col items-center justify-center pointer-events-none">
                        {'LUNCH'.split('').map((char, i) => (
                            <span key={i} className="text-[14px] font-black text-gray-200 my-6 tracking-widest">{char}</span>
                        ))}
                    </div>
                </div>

                {/* Controls & Pagination Area */}
                <div className="flex flex-wrap items-center justify-between mt-12 gap-6 px-4">
                    {/* Pagination buttons */}
                    <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] shadow-sm border border-gray-100">
                        <button
                            onClick={() => setCurrentIndex(0)}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-black hover:bg-gray-100 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" /></svg>
                        </button>
                        {[0, 1, 2, 3].map(idx => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-[16px] transition-all ${currentIndex === idx
                                    ? 'bg-[#3B5BDB] text-white shadow-xl scale-110'
                                    : 'bg-transparent text-gray-400 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentIndex((timetableData?.length || 1) - 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-black hover:bg-gray-100 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 17l5-5-5-5M6 17l5-5-5-5" /></svg>
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-3 bg-[#A0C4FF] hover:bg-[#8ab2f2] text-black font-black py-5 px-10 rounded-[22px] transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
                            Share
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-3 bg-[#C8F7DC] hover:bg-[#b0eac8] text-black font-black py-5 px-10 rounded-[22px] transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                            Download
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-3 bg-[#E0D4F5] hover:bg-[#d0c0f0] text-black font-black py-5 px-10 rounded-[22px] transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Step Navigation Bar */}
            <div className="w-full max-w-[1440px] mt-16 bg-white/60 backdrop-blur-xl rounded-[40px] p-6 flex items-center justify-between border border-white/40 shadow-2xl shadow-black/5">
                <div className="bg-white rounded-[24px] px-8 py-4 shadow-sm border border-gray-50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-[20px]">👋</div>
                    <span className="text-[18px] font-black text-black">{session?.user?.name || 'User'}</span>
                </div>

                <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-[28px] border border-gray-100">
                    {[1, 2].map(num => (
                        <button key={num} className="w-14 h-14 rounded-[22px] bg-white text-gray-400 font-black text-[18px] shadow-sm hover:text-black transition-colors">{num}</button>
                    ))}
                    <button className="h-14 px-10 rounded-[22px] bg-[#3B5BDB] text-white font-black text-[18px] shadow-xl shadow-blue-500/30">3. Timetable</button>
                    <button className="w-14 h-14 rounded-[22px] bg-white text-gray-400 font-black text-[18px] shadow-sm hover:text-black transition-colors">4</button>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/courses')}
                        className="py-5 px-12 rounded-[22px] bg-white border-2 border-gray-100 text-gray-600 font-black text-[16px] hover:bg-gray-50 transition-all active:scale-95"
                    >
                        previous
                    </button>
                    <button
                        onClick={() => router.push('/saved')}
                        className="py-5 px-14 rounded-[22px] bg-[#3B5BDB] text-white font-black text-[20px] shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all"
                    >
                        next
                    </button>
                </div>
            </div>

            {/* Detail Popover Modal */}
            {selectedSlot && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/10 backdrop-blur-[2px]" onClick={() => setSelectedSlot(null)}>
                    <div
                        className="bg-[#FFF3B0] rounded-[24px] shadow-2xl p-8 w-[90%] max-w-[400px] relative animate-[scaleIn_0.2s_ease]"
                        style={{ backgroundColor: getSlotColor(selectedSlot.courseCode, allCodes) }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedSlot(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>

                        <h2 className="text-[22px] font-black text-black leading-tight mb-1">{selectedSlot.courseCode} - {selectedSlot.courseName}</h2>
                        <p className="text-[14px] font-bold text-gray-800 mb-6">Slot: {selectedSlot.slotName}</p>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Faculty Name:</p>
                                <p className="text-[15px] font-bold text-black">{selectedSlot.facultyName}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Course Name:</p>
                                <p className="text-[15px] font-bold text-black">{selectedSlot.courseName}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Course Code:</p>
                                <p className="text-[15px] font-bold text-black">{selectedSlot.courseCode}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Timing:</p>
                                <p className="text-[15px] font-bold text-black">-</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Classroom:</p>
                                <p className="text-[15px] font-bold text-black">-</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
