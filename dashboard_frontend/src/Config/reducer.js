import * as constants from "../Components/constants";

export const stateReducer = (state = [1,2,3], action) => {
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