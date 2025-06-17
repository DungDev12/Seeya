import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {getDBConnection} from '../../db/connectDB';
import {getAllDatesOrder} from '../../services/orderService';
import {MarkedDates} from 'react-native-calendars/src/types';
import Modal from 'react-native-modal';

type CalendarScreenComponentProps = {
  handleGetOrders: (date: string) => Promise<void>;
  selectedDate: string | undefined;
};

const CalendarScreenComponent: React.FC<CalendarScreenComponentProps> = ({
  handleGetOrders,
  selectedDate,
}) => {
  const [dateDB, setDateDB] = useState<string[]>([]);
  const [modalCalendar, setModalCalendar] = useState<{
    open: boolean;
  }>({open: false});

  useEffect(() => {
    const fetchDates = async () => {
      const db = await getDBConnection();
      const dates = await getAllDatesOrder(db);
      setDateDB(dates || []);
    };
    fetchDates();
  }, []);

  const getMarkedDates = (dates: string[]): MarkedDates => {
    const marked: MarkedDates = {};

    dates.forEach(date => {
      marked[date] = {
        dots: [
          {
            key: 'dot',
            color: 'green',
            selectedDotColor: '#B6F500',
          },
        ],
      };
    });

    // Đánh dấu ngày đang được chọn
    if (selectedDate) {
      marked[selectedDate] = {
        ...(marked[selectedDate] || {}),
        selected: true,
        selectedColor: '#0ABAB5',
      };
    }

    return marked;
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalCalendar(prev => ({...prev, open: true}))}>
        <Text className="font-bold text-[16px]">{selectedDate}</Text>
      </TouchableOpacity>

      <Modal
        onBackdropPress={() =>
          setModalCalendar(prev => ({...prev, open: false}))
        }
        isVisible={modalCalendar.open}>
        <View className="rounded-[16px] overflow-hidden">
          <Calendar
            current={'2025-06-13'}
            markingType="multi-dot"
            markedDates={getMarkedDates(dateDB)}
            onDayPress={day => {
              handleGetOrders(day.dateString);
              setModalCalendar({open: false});
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default CalendarScreenComponent;
