const initialState: any = {
    allUsers: [{
        name: "admin",
        email: "admin123@gmail.com",
        password: "admin123",
        role: "administrator"
    }],
    currentUser: null,
    usersToBeApproved : [],
  };
  
export function welcomeReducer(state = initialState, action: any) {
    switch (action.type) {
      case 'REGISTER_USER':
        if (action.payload.role === 'administrator') {
          return {
            ...state,
            usersToBeApproved: [...state.usersToBeApproved, action.payload],
          };
        }
        return {
          ...state,
          allUsers: [...state.allUsers, action.payload],
        };
        case 'CHANGE_PASSWORD':
          return {
            ...state,
            allUsers: state.allUsers.map((user: { name: any; email: any; }) =>
              user.name === action.payload.name && user.email === action.payload.email
                ? { ...user, password: action.payload.newPassword }
                : user
            )
          };
        case 'LOGIN_USER':
          return {
            ...state,
            currentUser: action.payload,
        };
        case 'LOGOUT_USER':
          return {
            ...state,
            currentUser: null 
          };
        case 'APPROVE_REGISTRATION':
          return {
            ...state,
            allUsers: [...state.allUsers, action.payload], 
            usersToBeApproved: state.usersToBeApproved.filter(
              (user: { name: string; email: string }) =>
                !(user.name === action.payload.name && user.email === action.payload.email) 
            )
          };
        default:
          return state;
    }
}
  