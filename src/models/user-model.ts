export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  mobile_no: string;
  user_group_id: number;
  status: number;
  user_group?:{
    id: number;
    name: string;
  }
}

export interface Users {
  users: User[];
  totalNumberOfRows: number;
}

export interface UserGroup{
  id: number;
  name: string;
}
export interface UserGroups {
  userGroups: UserGroup[];
}

export type UserPartial = Partial<User>;
