interface StaffWork {
    staff_id: number;
    name: string;
    shifts: StaffShift[]; // Array of StaffShift objects
  }
  
  interface StaffShift {
    staff_shift_id: number;
    staff_id: number,
    shift_id: number,
    shift_name: string;
    start_time: string; // Time format (e.g., "20:00:00")
    end_time: string;   // Time format (e.g., "24:00:00")
    date: string;       // ISO 8601 formatted date-time string
    is_attendance: boolean;
  }