export const registerUser = (user: any) => ({
  type: 'REGISTER_USER',
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

export const setLoginRes = (error : any) => ({
  type: 'SET_LOGIN_RESPONSE',
  payload: error
});

export const setRegisterResponse = (error : any) => ({
  type: 'SET_REGISTER_RESPONSE',
  payload: error
});

export const requestUsersToApprove = (token: string) => ({
  type: 'REQUEST_USERS_TO_APPROVE',
  payload: token
});

export const setUsersToApprove = (data: any) => ({
  type: 'SET_USERS_TO_APPROVE',
  payload: data
});

export const approveNewAdmin = (email: string, token: string) => ({
  type: 'APPROVE_NEW_ADMIN',
  payload: {email: email, token: token}
});

export const rejectNewAdmin = (email: string, token: string) => ({
  type: 'REJECT_NEW_ADMIN',
  payload: {email: email, token: token}
});

export const setTPS = (data: any) => ({
  type: 'SET_TPS',
  payload:data
});

export const getTPS = () => ({
  type: 'GET_TPS'
});