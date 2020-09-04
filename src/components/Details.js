import React, {Component} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {Button, colors, Divider} from 'react-native-elements';
import Downloader from './Downloader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Details extends Component {
  state = {inDownload: 0};

  addProcess = () => this.setState((state) => ({inDownload: state.inDownload + 1}));

  removeProcess = () => this.setState((state) => ({inDownload: state.inDownload - 1}));

  render() {
    let {data, show, onHide} = this.props;
    const cantClose = this.state.inDownload > 0;

    if (!data) return null;
    return (
      <Modal animationType="slide" transparent={true} visible={show} onRequestClose={onHide}>
        <View style={styles.modal}>
          <View style={styles.modalBody}>
            <View style={styles.modalTitle}>
              <Text style={styles.title}>{data.date}</Text>
            </View>
            <Divider />
            {data.shows.map((show, i) => (
              <Downloader
                key={i}
                style={styles.downloader}
                data={show}
                onDownloadStart={this.addProcess}
                onDownloadEnd={this.removeProcess}
              />
            ))}
            <View style={styles.buttonView}>
              <Button
                title="Close"
                icon={<Icon name="close" size={20} color={cantClose ? colors.grey3 : colors.primary} />}
                onPress={onHide}
                type="outline"
                disabled={cantClose}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(109,109,109,0.5)',
  },
  modalBody: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 300,
  },
  modalTitle: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  buttonView: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  downloader: {},
});

export default Details;
