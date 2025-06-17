import {Dispatch, SetStateAction} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const paymentMethods = [
  {id: 'cash', name: 'Tiền mặt'},
  {id: 'momo', name: 'Ví MoMo'},
  {id: 'banking', name: 'Chuyển khoản'},
];

type SelectedPaymentProps = {
  open: boolean;
  setModalPayment: Dispatch<
    SetStateAction<{modalStatus: boolean; paymentTitle: string}>
  >;
  title: string;
};

const SelectedPayment: React.FC<SelectedPaymentProps> = ({
  open,
  setModalPayment,
  title,
}) => {
  const renderItem = ({item}: {item: {id: string; name: string}}) => (
    <TouchableOpacity
      className="my-2"
      onPress={() =>
        setModalPayment(prev => ({
          ...prev,
          modalStatus: false,
          paymentTitle: item.name,
        }))
      }>
      <Text className="text-center font-semibold text-[16px]">{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <View>
      <TouchableOpacity
        className="px-2"
        onPress={() => setModalPayment(prev => ({...prev, modalStatus: true}))}>
        <Text className="font-semibold">Chọn hình thức thanh toán:</Text>
        {title && <Text>{title}</Text>}
      </TouchableOpacity>
      <Modal visible={open} animationType="fade" transparent>
        <Pressable
          onPress={() =>
            setModalPayment(prev => ({
              ...prev,
              modalStatus: false,
            }))
          }
          className="relative w-full h-full bg-black/40">
          <Pressable
            onPress={() => {}}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl  min-w-[200px] max-w-[400px] p-4 shadow-md">
            <FlatList
              data={paymentMethods}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default SelectedPayment;
