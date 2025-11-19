export interface Section {
  id: number;
  title: string;
  class_id: number;
  class?: {
    id: number;
    title: string;
  };
  status: number;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  deleted_at: string | null;
}

export interface Sections {
  sections: Section[];
  totalNumberOfRows: number;
}

export type SectionPartial = Partial<Section>;

