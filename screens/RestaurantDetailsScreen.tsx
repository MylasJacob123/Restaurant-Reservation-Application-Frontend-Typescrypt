import { Button } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function RestaurantDetailsScreen({ navigation }) {
  return (
    <ScreenWrapper title="Restaurant Details" navigation={navigation}>
      <Button title="Reserve Now" onPress={() => navigation.navigate('Payment')} />
    </ScreenWrapper>
  );
}
