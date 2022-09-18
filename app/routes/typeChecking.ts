type RootStackParamList = {
  router: undefined;

  login: {message?: string};
  register: undefined;

  tabBar: undefined;
  offline: undefined;

  quiz_entries: undefined;
  quiz_create: undefined;
  quiz_edit: {id: number};

  category: undefined;
  category_create: undefined;
  category_edit: {id: number};
};

export default RootStackParamList;
