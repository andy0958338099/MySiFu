export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  UserProfile: undefined;
  Settings: undefined;
  ExpertList: undefined;
  VideoTutorials: undefined;
  Chat: {
    expertId: string;
  };
  VideoCall: {
    sessionId: string;
  };
};
