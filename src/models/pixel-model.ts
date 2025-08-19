export interface Pixel {
  id: number;
  name: string;
  type?: string;
  format: string;
  source: string;
  secure?: boolean;
  expiration?: number;
  active?: boolean;
  created_at?: string;
}

export type PixelPartial = Partial<Pixel>;

export interface Pixels {
  pixels: Pixel[];
  totalNumberOfElemements: number;
}

export interface PixelQueryParams {
  limit: number;
  offset: number;
  sort: string;
  search: string;
}