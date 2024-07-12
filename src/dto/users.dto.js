export class UserDTO {
  constructor( user ) {
    this.first_name = user.first_name.toUpperCase()
    this.email = user.email.toUpperCase()
    this.role = user.role.toUpperCase()
    
  }
}
