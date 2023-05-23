import { ADD_PUBLICATION, DELETE_PUBLICATION } from './publicationActions';

const initialState = {
  publications: [],
};

const publicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PUBLICATION:
      return {
        ...state,
        publications: [...state.publications, action.payload],
      };
    case DELETE_PUBLICATION:
      return {
        ...state,
        publications: state.publications.filter(
          (publication) => publication.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default publicationReducer;
