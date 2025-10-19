export interface TuitionFeeHead {
  id: number;
  head_type_id: number;
  title: string;
  type: string;
  serial: number;
  configs?: TuitionFeeHeadConfig[];
}

export interface TuitionFeeHeads {
  tuitionFeeHeads: TuitionFeeHead[];
  totalNumberOfRows: number;
}

export type TuitionFeeHeadPartial = Partial<TuitionFeeHead>;

export interface TuitionFeeHeadConfig {
  old_amount: number;
  new_amount: number;
  months: number[];
}

export interface TuitionFeeHeadConfigRequestData {
  class_id: number;
  tuition_fee_head_id: number;
  old_amount: number;
  new_amount?: number;
  months: number[];
}