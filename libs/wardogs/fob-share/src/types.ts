// the columns the code reads and writes; the table's createdAt fills itself in and stays out of this
// type, as nothing reads it
interface SharedPlanTable {
  readonly shareID: string;
  readonly code: string;
}

export interface ShareSchema {
  readonly sharedPlans: SharedPlanTable;
}
