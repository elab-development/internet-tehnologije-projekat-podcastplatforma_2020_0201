export const registerUser = (user: any) => ({
  type: 'REGISTER_USER',
  payload: user
});

export const changePassword = (user: any) => ({
  type: 'CHANGE_PASSWORD',
  payload: user
});

export const loginUser = (user: any) => ({
  type: 'LOGIN_USER',
  payload: user
});

export const logoutUser = () => ({
  type: 'LOGOUT_USER'
});

export const approveRegistration = (user: any) => ({
  type: 'APPROVE_REGISTRATION',
  payload: user
});
