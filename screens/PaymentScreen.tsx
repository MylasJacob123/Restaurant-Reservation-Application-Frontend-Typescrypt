import { Button } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function PaymentScreen({ navigation }) {
  return (
    <ScreenWrapper title="Payment" navigation={navigation}>
      <Button title="Confirm Payment" onPress={() => navigation.navigate('ConfirmPayment')} />
    </ScreenWrapper>
  );
}
