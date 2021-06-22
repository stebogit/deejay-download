import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Details from '../Details';
import {CalendarList} from 'react-native-calendars'; // https://github.com/wix/react-native-calendars
import dayjs from 'dayjs';
import {getDJCI, getNoSpoiler, getVolo, getDJCIOld} from '../radiodj';
import allSettled from 'promise.allsettled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storageKey, theme} from '../../constants';

allSettled.shim(); // will be a no-op if not needed

const beginning = dayjs('2020-01-01');
const today = dayjs();

const dots = {
  nosp: {key: 'nosp', color: 'blue'},
  djci: {key: 'djci', color: theme.colors.deejay},
  volo: {key: 'volo', color: '#33b72e'},
};

function daysInMonth(month) {
  let date = dayjs().month(month).startOf('month');
  const end = dayjs().month(month).endOf('month');
  const days = [];
  while (date.isBefore(end)) {
    days.push({
      year: date.format('YYYY'),
      month: date.format('MM'),
      day: date.format('DD'),
    });
    date = date.add(1, 'day');
  }
  return days;
}

class Calendar extends Component {
  state = {
    modalVisible: false,
    selectedDay: null,
    markedDates: {},
  };

  componentDidMount() {
    this.setFromStorage();
  }

  setFromStorage = async () => {
    try {
      const markedDates = await AsyncStorage.getItem(storageKey);
      if (markedDates) {
        this.setState({markedDates: JSON.parse(markedDates)});
      }
    } catch (e) {
      console.warn('Unable to set past dates.');
    }
  };

  showModal = () => this.setState({modalVisible: true});

  hideModal = () => this.setState({modalVisible: false});

  setSelectedDay = (selectedDay) => this.setState({selectedDay});

  setMarkedDates = (dates) => {
    this.setState({markedDates: {...dates, ...this.state.markedDates}}, () => {
      // save only past dates to allow update at first load
      const markedDates = {...this.state.markedDates};
      let date = dayjs();
      const endOfMonth = dayjs().endOf('month');
      while (!date.isAfter(endOfMonth)) {
        delete markedDates[date.format('YYYY-MM-DD')];
        date = date.add(1, 'day');
      }
      AsyncStorage.setItem(storageKey, JSON.stringify(markedDates));
    });
  };

  onMonthChange = async (months) => {
    const dates = months.reduce((days, m) => [...days, ...daysInMonth(m.month - 1)], []);
    try {
      const requests = dates.reduce((requests, {year, month, day}) => {
        const date = `${year}-${month}-${day}`;
        if (this.state.markedDates[date]) return requests;

        if (dayjs(date).isAfter(today, 'day')) {
          // fake request for future dates
          return [...requests, Promise.reject({config: {headers: {'x-request': JSON.stringify({date})}}})];
        }

        return [...requests, getVolo(date), getDJCI(date), getNoSpoiler(date), getDJCIOld(date)];
      }, []);

      const results = await Promise.allSettled(requests);

      const marks = results.reduce((marks, result) => {
        if (result.status === 'fulfilled') {
          const {date, showCode, showName} = JSON.parse(result.value.config.headers['x-request']);
          const mark = marks[date] || {};
          const markDots = mark.dots || [];
          const shows = mark.shows || [];
          marks[date] = {
            ...marks[date],
            date,
            dots: [...markDots, dots[showCode]],
            shows: [...shows, {url: result.value.config.url, fileName: `${date}-${showCode}.mp3`, showCode, showName}],
          };
        } else {
          const {date} = JSON.parse(result.reason.config.headers['x-request']);
          if (!marks[date]) marks[date] = {};
        }
        return marks;
      }, {});

      // disable empty dates
      for (const [, mark] of Object.entries(marks)) {
        if (!mark.shows) {
          mark.disabled = true;
          mark.disableTouchEvent = true;
        }
      }

      this.setMarkedDates(marks);
    } catch (e) {
      console.error(e.message);
    }
  };

  render() {
    const {modalVisible, selectedDay, markedDates} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <CalendarList
          onVisibleMonthsChange={this.onMonthChange}
          pastScrollRange={today.diff(beginning, 'month')}
          futureScrollRange={0}
          // CALENDAR PROPS
          markingType={'multi-dot'}
          disableAllTouchEventsForDisabledDays // buggy
          displayLoadingIndicator
          minDate={beginning.format('YYYY-MM-DD')}
          maxDate={today.format('YYYY-MM-DD')}
          onDayPress={({dateString}) => {
            // {dateString": "2020-08-16", "day": 16, "month": 8, "timestamp": 1597536000000, "year": 2020}
            this.setSelectedDay(markedDates[dateString]);
            this.showModal();
          }}
          monthFormat={'MMMM yyyy'}
          firstDay={1} // Monday
          markedDates={markedDates}
          theme={{
            indicatorColor: theme.colors.deejay, // loading indicator
            // day number
            textDayFontFamily: 'sans-serif',
            textDayFontSize: 15,
            // day name
            textMonthFontFamily: 'sans-serif',
            textMonthFontWeight: 'bold',
            textMonthFontSize: 20,
            // month-year header
            textDayHeaderFontFamily: 'sans-serif',
            textDayHeaderFontSize: 16,
            textSectionTitleColor: '#94a1ae',
            // today
            todayTextColor: theme.colors.deejay,
            'stylesheet.day.multiDot': {
              today: {
                borderRadius: 16,
                borderColor: theme.colors.deejay,
                borderWidth: 1,
              },
              todayText: {
                color: theme.colors.deejay,
                fontWeight: 'bold',
              },
              dot: {
                width: 4,
                height: 4,
                marginTop: -1,
                borderRadius: 2,
                marginLeft: 1,
                marginRight: 1,
                opacity: 1,
              },
            },
          }}
        />

        <Details show={modalVisible} onHide={this.hideModal} data={selectedDay} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    alignItems: 'center',
  },
});

export default Calendar;
