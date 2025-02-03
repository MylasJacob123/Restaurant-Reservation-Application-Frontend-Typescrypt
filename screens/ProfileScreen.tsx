import { Button } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function ProfileScreen({ navigation }) {
  return (
    <ScreenWrapper title="Profile" navigation={navigation}>
      <Button title="Logout" onPress={() => navigation.navigate('LandingPage')} />
    </ScreenWrapper>
  );
}
