import { Button } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function ExploreScreen({ navigation }) {
  return (
    <ScreenWrapper title="Explore Restaurants" navigation={navigation}>
      <Button title="Go to Restaurant" onPress={() => navigation.navigate('RestaurantDetails')} />
    </ScreenWrapper>
  );
}
