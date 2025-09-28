export interface SchoolClass {
  id: number;
  title: string;
  code: string;
  serial?: number;
  coaching_applicable?: string;
}

export interface SchoolClasses {
  classes: SchoolClass[];
  totalNumberOfRows: number;
}

export type SchoolClassPartial = Partial<SchoolClass>;