//Import Libraries
import compose from 'ramda/src/compose';
import ops from 'immutable-ops';

// These are all the available functions.
const {
    // Functions operating on objects.
    merge,
    mergeDeep,
    omit,
    setIn,

    // Functions operating on arrays.
    insert,
    splice,
    push,
    filter,

    // Functions operating on both
    set,

    // Placeholder for currying.
    __,
} = ops;

export default function projects(state = [], action) {
  console.log(state, action);

  switch (action.type) {
    case 'REQUESTED_PROJECTS':
      return state;
      break;
    case 'RECEIVED_PROJECTS':
      return ops.insert(0, action.projects, []);
      break;
    case 'SAVE_PROJECT_CHANGES':
      let index = state.findIndex((project) => {
        return project.id === action.project.id;
      });
      return ops.splice(index, 1, action.project, state);
      break;
    case 'ADD_PROJECT':
      return ops.push({id: action.id, title: "Blank Title", description: "Blank Description", votes: 0}, state);
      break;
    case 'DELETE_PROJECT':
      return ops.filter((project) => { return project.id !== action.id; }, state);
      break;
    default:
      return state;
  }
}
