import React, { useState } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { getUser } from '../redux/selectors';

import { useTheme } from '../shared/theme.context';
import { AuthSubject } from '../models/session.model';
import ErrorIcon from '../../assets/icons/error-icon.svg';
import BoxForm from '../components/box-form.component';
import Box from '../models/box.model';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 15,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titlePage: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
    marginTop: '1%',
    marginBottom: 10,
    paddingLeft: 10,
  },
  container: {
    flex: 1,
  },
});

export type BoxOptions = {
    random: boolean,
    loop: boolean,
    berries: boolean,
    videoMaxDurationLimit: number
}

const CreateBoxScreen = (props: { navigation, user: AuthSubject }) => {
  const { navigation, user } = props;
  const [box, setBox] = useState<Box>(null);
  const { colors } = useTheme();

  return (
    <>
      <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.titlePage, { color: colors.textColor }]}>Create a box</Text>
        <TouchableOpacity
          onPress={() => navigation.pop()}
        >
          <ErrorIcon height={25} width={25} fill={colors.textColor} style={{ marginRight: 15 }} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior="height"
      >
        <BoxForm
          user={user}
          onSuccess={setBox}
          onError={() => console.error('ERROR')}
        />
        <Snackbar
          visible={box}
          onDismiss={() => navigation.navigate('Box', { boxToken: box._id })}
          duration={2000}
          style={{
            backgroundColor: '#090909',
            borderLeftColor: '#0CEBC0',
            borderLeftWidth: 10,
          }}
        >
          <Text style={{ color: 'white' }}>Your box has been created. Hang tight! We&apos;re redirecting you to it...</Text>
        </Snackbar>
      </KeyboardAvoidingView>
    </>
  );
};

export default connect((state) => getUser(state))(CreateBoxScreen);
