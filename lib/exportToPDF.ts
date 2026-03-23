import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exports a given HTML element to PDF.
 * Uses html2canvas which has broader CSS compatibility than html-to-image.
 *
 * @param elementId The ID of the HTML element to export
 * @param filename  The name of the downloaded PDF file
 */
export const exportToPDF = async (
    elementId: string,
    filename: string = 'timetable.pdf',
) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    // Temporarily remove overflow clipping on the target element and ancestors
    // so the full content is captured instead of only the visible viewport.
    const overflowFixups: {
        el: HTMLElement;
        overflow: string;
        overflowX: string;
    }[] = [];

    let walker: HTMLElement | null = element;
    while (walker) {
        const computed = window.getComputedStyle(walker);
        if (computed.overflow !== 'visible' || computed.overflowX !== 'visible') {
            overflowFixups.push({
                el: walker,
                overflow: walker.style.overflow,
                overflowX: walker.style.overflowX,
            });
            walker.style.overflow = 'visible';
            walker.style.overflowX = 'visible';
        }
        walker = walker.parentElement;
    }

    // Temporarily remove overflow clipping on the target element and its ancestors
    // so the full content is captured, not just the visible viewport.
    const overflowFixups: { el: HTMLElement; overflow: string; overflowX: string }[] = [];
    let walker: HTMLElement | null = element;
    while (walker) {
        const computed = window.getComputedStyle(walker);
        if (
            computed.overflow !== 'visible' ||
            computed.overflowX !== 'visible'
        ) {
            overflowFixups.push({
                el: walker,
                overflow: walker.style.overflow,
                overflowX: walker.style.overflowX,
            });
            walker.style.overflow = 'visible';
            walker.style.overflowX = 'visible';
        }
        walker = walker.parentElement;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const canvas = await (html2canvas as any)(element, {
            backgroundColor: '#FFFBF0',
            scale: 2,
            useCORS: true,
            logging: false,
            ignoreElements: (el: Element) => {
                return el.tagName === 'IFRAME';
            },
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pdf = new jsPDF({
            orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
            unit: 'px',
            format: [imgWidth, imgHeight],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(filename);
    } catch (error: any) {
        console.error('Error generating PDF:', error);
        window.alert('PDF Export Error: ' + (error?.message || String(error)));
        throw error;
    } finally {
        // Always restore original overflow values
        for (const fix of overflowFixups) {
            fix.el.style.overflow = fix.overflow;
            fix.el.style.overflowX = fix.overflowX;
        }
    }
};
