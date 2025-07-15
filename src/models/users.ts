export interface IUser {
  id: string,
  name: string,
  email: string,

  createdAt: Date,
  updatedAt: Date
}

export interface IAuthUser extends IUser { token: string }