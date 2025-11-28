export const DEFAULT_DISPLAY_DATE_FORMAT = 'DD MMM YYYY';
export const DEFAULT_DISPLAY_DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm';
export const CURRENCY_SYMBOL = '৳';

export const MODAL_SIZES = {
  SMALL: 400,
  MEDIUM: 600,
  LARGE: 800,
  EXTRA_LARGE: 1000
};

export const REDIRECT_SERVICE_END_POINTS = [''];

export const PAGINATION_CONFIG = {
  current: 1,
  pageSize: 25
};

export const DEFAULT_QUERY_PARAMS = {
  limit: 25,
  offset: 0,
  sort: '-id'
};

export const USER_STATUS = {
  active: {
    value: 1,
    label: 'Active'
  },
  inactive: {
    value: 0,
    label: 'Inactive'
  }
};

export const STUDENT_STATUS = {
  active: {
    value: 1,
    label: 'Active'
  },
  inactive: {
    value: 0,
    label: 'Inactive'
  }
};

export const RELIGIONS = [
  { value: 1, label: 'Islam' },
  { value: 2, label: 'Hinduism' },
  { value: 3, label: 'Buddhism' },
  { value: 4, label: 'Christianity' },
  { value: 9, label: 'Other' }
];

export const BLOOD_GROUPS = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' }
];

export const OCCUPATIONS = {
  1: 'Government Employee',
  2: 'Private Employee',
  3: 'Teacher',
  4: 'Doctor',
  5: 'Nurse',
  6: 'Pharmacist',
  7: 'Engineer',
  8: 'Architect',
  9: 'Lawyer',
  10: 'Banker',
  11: 'Business',
  12: 'Farmer',
  13: 'Actor',
  14: 'Housewife',
  15: 'Retired',
  16: 'Unemployed',
  17: 'Other'
};

export const OCCUPATION_OPTIONS = Object.entries(OCCUPATIONS).map(([key, value]) => ({
  value: Number(key),
  label: value
}));

export const PAYMENT_INVOICE_TYPES = {
  SCHOOL: 1,
  COACHING: 2,
  HOSTEL: 3,
  OTHERS: 4
};

export const TUITION_FEE_HEAD_TYPES = {
  1: 'School',
  2: 'Coaching',
  3: 'Other'
};

export const TUITION_FEE_HEAD_TYPE_OPTIONS = Object.entries(TUITION_FEE_HEAD_TYPES).map(([key, value]) => ({
  value: Number(key),
  label: value
}));

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

export const MONTHS_SHORT = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' }
];

export const ATTENDANCE_FOR = [
  { value: 1, label: 'School' },
  { value: 2, label: 'Coaching' }
];

export const ATTENDANCE_STATUS = {
  present: {
    value: 1,
    label: 'Present'
  },
  absent: {
    value: 0,
    label: 'Absent'
  }
};

export const SHIFTS = {
  1: 'Morning',
  2: 'Day'
};

export const SHIFT_OPTIONS = Object.entries(SHIFTS).map(([key, value]) => ({
  value: Number(key),
  label: value
}));
