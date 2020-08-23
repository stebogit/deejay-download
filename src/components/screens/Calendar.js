import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Details from '../Details';
import {CalendarList} from 'react-native-calendars';
import dayjs from 'dayjs'; // http://arshaw.com/xdate/#Formatting
import axios from 'axios';
import allSettled from 'promise.allsettled';
import Loader from '../Loader';

allSettled.shim(); // will be a no-op if not needed

function daysInMonth(month) {
  let date = dayjs().month(month).startOf('month');
  const end = dayjs().month(month).endOf('month');
  const days = [];
  while (date.isBefore(end)) {
    days.push({
      year: date.format('YYYY'),
      month: date.format('MM'),
      day: date.format('DD'),
      isWeekend: ['Saturday', 'Sunday'].includes(date.format('dddd')),
    });
    date = date.add(1, 'day');
  }
  return days;
}

export default function Calendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <Loader show={loading} />

      <CalendarList
        // [{"dateString": "2020-07-22", "day": 22, "month": 7, "timestamp": 1595376000000, "year": 2020},
        // {"dateString": "2020-08-22", "day": 22, "month": 8, "timestamp": 1598054400000, "year": 2020}]
        onVisibleMonthsChange={async (months) => {
          const dates = months.reduce((days, m) => [...days, ...daysInMonth(m.month - 1)], []);
          const marks = dates.reduce((marks, {year, month, day, isWeekend}) => {
            const date = `${year}-${month}-${day}`;
            if (isWeekend) {
              marks[date] = {
                disabled: true,
                disableTouchEvent: true,
              };
            } else {
              marks[date] = {
                // https://media.deejay.it/2020/07/24/episodes/deejay_chiama_italia/20200724.mp3
                url: `https://media.deejay.it/${year}/${month}/${day}/episodes/deejay_chiama_italia/${year}${month}${day}.mp3`,
                date: `${year}-${month}-${day}`,
              };
            }
            return marks;
          }, {});

          try {
            setLoading(true);
            const results = await Promise.allSettled(
              Object.keys(marks).reduce((requests, date) => {
                const mark = marks[date];
                if (mark.url) {
                  requests = [...requests, axios.head(mark.url, {headers: {'x-date': mark.date}})];
                }
                return requests;
              }, []),
            );
            results.forEach((result) => {
              if (result.status === 'fulfilled') {
                const date = result.value.config.headers['x-date'];
                marks[date] = {
                  ...marks[date],
                  marked: true,
                  dotColor: 'red',
                  selectedColor: 'blue',
                };
              } else {
                const date = result.reason.config.headers['x-date'];
                marks[date] = {
                  ...marks[date],
                  disabled: true,
                  disableTouchEvent: true,
                };
              }
            });
            setLoading(false);
            setMarkedDates(marks);
          } catch (e) {
            debugger;
            console.error(e.message);
          }
        }}
        pastScrollRange={6}
        futureScrollRange={0}
        // CALENDAR PROPS
        // markingType={'multi-dot'}
        displayLoadingIndicator
        current={dayjs().format('YYYY-MM-DD')} // last downloaded?
        minDate={dayjs().subtract(6, 'months').format('YYYY-MM-DD')}
        maxDate={dayjs().format('YYYY-MM-DD')}
        // {dateString": "2020-08-16", "day": 16, "month": 8, "timestamp": 1597536000000, "year": 2020}
        onDayPress={({dateString}) => {
          // console.log(markedDates[dateString]);
          setSelectedDay(markedDates[dateString]);
          setModalVisible(true);
        }}
        // onDayLongPress={(day) => {
        //   console.log('long pressed day', day);
        // }}
        // monthFormat={'MMMM yyyy'}
        // onMonthChange={(month) => {
        //   console.log('month changed', month);
        // }}
        firstDay={1} // Monday. dayNames and dayNamesShort should still start from Sunday.
        // renderHeader={({dateString}) => (
        //   <Text>
        //     {dayjs(dateString).format('MMMM YYYY')} {loading && <ActivityIndicator color="#999999" size={20} />}
        //   </Text>
        // )}
        // Collection of dates that have to be marked. Default = {}
        markedDates={markedDates}
      />

      <Text>Calendario</Text>

      <View>
        <Button title="Download" onPress={() => setModalVisible(true)} />
      </View>

      <Details show={modalVisible} onHide={() => setModalVisible(false)} data={selectedDay} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});
