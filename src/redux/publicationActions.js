// Action Types
export const ADD_PUBLICATION = 'ADD_PUBLICATION';
export const DELETE_PUBLICATION = 'DELETE_PUBLICATION';

// Action Creators
export const addPublication = (publication) => {
  return {
    type: ADD_PUBLICATION,
    payload: publication,
  };
};

export const deletePublication = (id) => {
  return {
    type: DELETE_PUBLICATION,
    payload: id,
  };
};
