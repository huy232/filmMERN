import ACTIONS from "../actions/"

const initialState = {
	user: [],
	isLogged: false,
	isAdmin: false,
	isEmployee: false,
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTIONS.LOGIN:
			return {
				...state,
				isLogged: true,
			}
		case ACTIONS.GET_USER:
			return {
				...state,
				user: action.payload.user,
				isAdmin: action.payload.isAdmin,
				isEmployee: action.payload.isEmployee,
			}
		default:
			return state
	}
}

export default authReducer
