import React, {Component} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Details from '../Details';
import {CalendarList} from 'react-native-calendars'; // https://github.com/wix/react-native-calendars
import dayjs from 'dayjs';
import axios from 'axios';
import allSettled from 'promise.allsettled';
import AsyncStorage from '@react-native-community/async-storage';
import {theme, storageKey} from '../../constants';

allSettled.shim(); // will be a no-op if not needed

const beginning = dayjs('2020-01-01');
const today = dayjs();

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

class Calendar extends Component {
  state = {
    modalVisible: false,
    selectedDay: null,
    markedDates: {},
  };

  componentDidMount() {
    this.setDefaults();
  }

  setDefaults = async () => {
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
    const markedDates = {...dates, ...this.state.markedDates};
    this.setState({markedDates}, () => {
      AsyncStorage.setItem(storageKey, JSON.stringify(markedDates));
    });
  };

  render() {
    const {modalVisible, selectedDay, markedDates} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <CalendarList
          onVisibleMonthsChange={async (months) => {
            const dates = months.reduce((days, m) => [...days, ...daysInMonth(m.month - 1)], []);
            const marks = dates.reduce((marks, {year, month, day, isWeekend}) => {
              const date = `${year}-${month}-${day}`;
              if (!markedDates[date]) {
                // queue new request only if not already available
                if (isWeekend) {
                  marks[date] = {
                    disabled: true,
                  };
                } else {
                  marks[date] = {
                    // https://media.deejay.it/2020/07/24/episodes/deejay_chiama_italia/20200724.mp3
                    url: `https://media.deejay.it/${year}/${month}/${day}/episodes/deejay_chiama_italia/${year}${month}${day}.mp3`,
                    date: `${year}-${month}-${day}`,
                    filename: `djci-${year}-${month}-${day}.mp3`,
                  };
                }
              }
              return marks;
            }, {});

            try {
              const requests = Object.keys(marks).reduce((requests, date) => {
                const mark = marks[date];
                if (mark.url) {
                  requests = [...requests, axios.head(mark.url, {headers: {'x-date': mark.date}})];
                }
                return requests;
              }, []);

              const results = await Promise.allSettled(requests);

              results.forEach((result) => {
                if (result.status === 'fulfilled') {
                  const date = result.value.config.headers['x-date'];
                  marks[date] = {
                    ...marks[date],
                    marked: true,
                    dotColor: theme.colors.deejay,
                  };
                } else {
                  const date = result.reason.config.headers['x-date'];
                  marks[date] = {
                    ...marks[date],
                    disabled: true,
                    // customStyles: today.isSame(dayjs(date), 'day')
                    //   ? {
                    //       container: {
                    //         borderRadius: 16,
                    //         borderColor: theme.colors.deejay,
                    //         borderWidth: 2,
                    //       },
                    //       text: {
                    //         color: theme.colors.deejay,
                    //         fontWeight: 'bold',
                    //       },
                    //     }
                    //   : {},
                  };
                }
              });
              this.setMarkedDates(marks);
            } catch (e) {
              console.error(e.message);
            }
          }}
          pastScrollRange={today.diff(beginning, 'month')}
          futureScrollRange={0}
          // CALENDAR PROPS
          // markingType={'multi-dot'}
          disableAllTouchEventsForDisabledDays
          displayLoadingIndicator
          // current={today.format('YYYY-MM-DD')} // current month
          minDate={beginning.format('YYYY-MM-DD')}
          maxDate={today.format('YYYY-MM-DD')}
          onDayPress={({dateString}) => {
            // {dateString": "2020-08-16", "day": 16, "month": 8, "timestamp": 1597536000000, "year": 2020}
            this.setSelectedDay(markedDates[dateString]);
            this.showModal();
          }}
          monthFormat={'MMMM yyyy'}
          firstDay={1} // Monday. dayNames and dayNamesShort should still start from Sunday.
          markedDates={markedDates}
          theme={{
            todayTextColor: theme.colors.deejay,
            indicatorColor: theme.colors.deejay, // loading indicator
            textSectionTitleColor: '#94a1ae',
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
            // // selected
            // selectedDayBackgroundColor: 'white',
            // selectedDayTextColor: theme.colors.deejay,
            'stylesheet.day.basic': {
              today: {
                borderRadius: 16,
                borderColor: theme.colors.deejay,
                borderWidth: 2,
              },
              todayText: {
                color: theme.colors.deejay,
                fontWeight: 'bold',
              },
            },
            // 'stylesheet.calendar-list.main': {
            //   container: {
            //     // borderColor: 'red',
            //     // borderWidth: 1,
            //     paddingBottom: 30,
            //   },
            // },
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
