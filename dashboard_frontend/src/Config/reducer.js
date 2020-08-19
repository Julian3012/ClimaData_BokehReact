import * as constants from "../Components/constants";

export const stateReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD":
            return [action.payload]
        case "REMOVE":
            return []
        default:
            return state
    }
}

export default stateReducer