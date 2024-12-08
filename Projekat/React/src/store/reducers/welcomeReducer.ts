const initialState: any = {
  currentUser: null,
  error: "",
  registerStatus: "",
  usersToBeApproved: [],
  tps: [],
};

export function welcomeReducer(state = initialState, action: any) {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        currentUser: null,
      };
    case "APPROVE_REGISTRATION":
      return {
        ...state,
        allUsers: [...state.allUsers, action.payload],
        usersToBeApproved: state.usersToBeApproved.filter(
          (user: { name: string; email: string }) =>
            !(
              user.name === action.payload.name &&
              user.email === action.payload.email
            )
        ),
      };
    case "SET_LOGIN_RESPONSE":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_REGISTER_RESPONSE":
      return {
        ...state,
        registerStatus: action.payload,
      };
    case "SET_USERS_TO_APPROVE": {
      return {
        ...state,
        usersToBeApproved: action.payload,
      };
    }
    case "SET_TPS":
      return {
        ...state,
        tps: action.payload,
      };
    default:
      return state;
  }
}
