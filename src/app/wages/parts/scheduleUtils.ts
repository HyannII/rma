// scheduleUtils.ts

export type Schedule = { [key: string]: string[] };

export function getDayOfWeek(dateString: string) {
    const date = new Date(dateString);
    return ((date.getUTCDay() + 6) % 7) + 1; // Monday (1) to Sunday (7)
}

export function createStaffSchedule(shifts: any[], staffWorkTimes: any[]): Schedule {
    const schedule: Schedule = {};

    staffWorkTimes.forEach((staff) => {
        staff.shifts.forEach((shift: { date: string; shift_name: any; }) => {
            const dayOfWeek = getDayOfWeek(shift.date);
            const shiftName = shift.shift_name;

            if (dayOfWeek && shiftName) {
                const cellKey = `${shiftName}-thu${dayOfWeek}`;
                if (!schedule[cellKey]) schedule[cellKey] = [];
                schedule[cellKey].push(staff.name);
            }
        });
    });

    return schedule;
}
