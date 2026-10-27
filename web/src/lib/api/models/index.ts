/* eslint-disable @typescript-eslint/no-namespace -- namespace groups the model type aliases */
export namespace Models {
  export type Health = import('./health').Health
  export type User = import('./user').User
  export type SignInData = import('./user').SignInData
  export type Category = import('./category').Category
}
