// Course code to type mapping
// E = Embedded (theory + lab combined), L = Lab only, P = Project-based
// Courses NOT in this map are treated as theory-only by default
export const course_type_map: Record<string, string> = {
    // Mtech
    CSI1007: 'E',
    CSI2003: 'E',
    CSI2004: 'L',
    CSI2005: 'L',
    CSI2006: 'E',
    CSI2007: 'E',
    CSI3023: 'E',
    CSI3024: 'L',
    CSI3025: 'E',
    CSI3026: 'E',
    EEE1024: 'E',
    MAT1022: 'L',

    CSI3005: 'E',
    CSI3006: 'L',
    CSI3008: 'E',
    CSI3012: 'E',
    CSI3014: 'L',
    CSI3015: 'L',
    CSI3020: 'L',
    CSI3028: 'L',
    CSI3030: 'L',
    CSI3032: 'L',
    CSI4004: 'L',
    MAT2002: 'E',
    MDI3002: 'L',

    CHY1701: 'E',
    ENG1901: 'P',
    ESP1001: 'L',
    FRE1001: 'L',
    GER1001: 'L',
    MAT2001: 'E',
    MGT1022: 'L',
    PHY1701: 'E',
    PHY1901: 'L',
    STS2022: 'L',
    STS3022: 'L',
    STS4022: 'L',

    CSE1030: 'E',
    CSE1031: 'E',
    CSE1032: 'L',
    EEE1001: 'E',
    HIN1001: 'L',
    HIN1003: 'L',
    MAT1026: 'L',
    MAT1027: 'E',
    MAT1028: 'L',
    MAT1029: 'E',
    MAT1030: 'P',
    MAT3011: 'E',
    MAT3012: 'L',
    MAT3013: 'E',
    MAT5016: 'E',
    MAT5017: 'E',
    MAT6005: 'E',
    MAT6012: 'E',
    MAT6015: 'E',
    MDI3001: 'E',
    MDI3005: 'L',
    MDI4001: 'E',
    MDI4009: 'L',
    PHY1999: 'L',
    TAM1003: 'L',

    // freshers (25 batch)
    BACSE102: 'P',
    BACSE104: 'E',
    BACSE105: 'E',
    BACSE106: 'E',

    BAEEE103: 'E',
    BAEEE201: 'E',
    BAEEE204: 'L',
    BAEIE101: 'L',

    BAECE102: 'E',
    BAECE103: 'L',

    BAMEE201: 'E',
    BAMEE205: 'E',

    BAMAT101: 'E',
    BAMAT201: 'L',
    BAMAT202: 'E',
    BAMAT203: 'L',
    BAMAT205: 'L',
    BAMAT206: 'L',

    BAENG101: 'E',

    BAPHY105: 'E',
    BAPHY102: 'E',

    BACHY105: 'E',
    BACHY106: 'E',
    BACHY109: 'E',

    BAHST102: 'L',
    BAHST202: 'E',
    BAHST203: 'E',

    BABIT102: 'E',
    BABIT103: 'E',
};

/**
 * Map course type codes to fullCourseData courseType format
 * E = Embedded (both theory and lab) = 'both'
 * L = Lab only = 'lab'
 * P = Project-based = 'both'
 * Default (not in map) = 'th' (theory only)
 */
export function getCourseType(courseCode: string): 'th' | 'lab' | 'both' {
    const prefix = courseCode.split(/\d+/)[0]; // Get alphabetic prefix
    const typeCode = course_type_map[courseCode] || course_type_map[courseCode.replace(/[LP]$/, '')];
    
    if (typeCode === 'E') return 'both';
    if (typeCode === 'L') return 'lab';
    if (typeCode === 'P') return 'both';
    
    // Check if the course code ends with 'L' (lab) or 'P' (practice/project)
    if (courseCode.endsWith('L') || courseCode.endsWith('P')) {
        return 'lab';
    }
    
    return 'th';
}