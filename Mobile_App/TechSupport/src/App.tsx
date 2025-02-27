import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import QuestionInputScreen from './screens/QuestionInputScreen';
import QuestionAnswerScreen from './screens/QuestionAnswerScreen';
import ConsultationRequestScreen from './screens/ConsultationRequestScreen';
import AdminScreen from './screens/AdminScreen';
import QuoteConfirmationScreen from './screens/QuoteConfirmationScreen';
import MyConsultationsScreen from './screens/MyConsultationsScreen';
import ExpertConsultationScreen from './screens/ExpertConsultationScreen';
import ExpertConsultationListScreen from './screens/ExpertConsultationListScreen';
import ExpertProfileScreen from './screens/ExpertProfileScreen';
import ExpertListScreen from './screens/ExpertListScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import KnowledgeBaseScreen from './screens/KnowledgeBaseScreen';
import KnowledgeDetailScreen from './screens/KnowledgeDetailScreen';

import { kStyleGlobal } from './theme/theme';

function App() {
  return (
    <ChakraProvider theme={kStyleGlobal}>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/question" element={<QuestionInputScreen />} />
          <Route path="/answer" element={<QuestionAnswerScreen />} />
          <Route path="/consultation-request" element={<ConsultationRequestScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/quote-confirmation" element={<QuoteConfirmationScreen />} />
          <Route path="/my-consultations" element={<MyConsultationsScreen />} />
          <Route path="/expert-consultation" element={<ExpertConsultationScreen />} />
          <Route path="/expert-consultations" element={<ExpertConsultationListScreen />} />
          <Route path="/expert-profile/:id?" element={<ExpertProfileScreen />} />
          <Route path="/expert-list" element={<ExpertListScreen />} />
          <Route path="/user-profile" element={<UserProfileScreen />} />
          <Route path="/knowledge-base" element={<KnowledgeBaseScreen />} />
          <Route path="/knowledge-detail" element={<KnowledgeDetailScreen />} />
          <Route path="/" element={<OnboardingScreen />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
