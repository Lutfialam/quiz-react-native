import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';

import {UserType} from '@/types/user';
import {login} from '@/services/auth';
import {useAppDispatch} from '@/hooks/redux';
import {setUser} from '@/state/user/slice/userSlice';
import {navigate} from '@/app/routes/rootNavigation';

import colors from '@/assets/styles/colors';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/forms/input';
import Authentication from '@/components/layouts/authentication';
import EncryptedStorage from 'react-native-encrypted-storage';
import isEmptyString from '@/helpers/string/isEmptyString';
import {AlertType, setAlert} from '@/state/alert/alertSlice';

interface Login {}

const Login: React.FC<Login> = () => {
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState<UserType>({} as UserType);

  const onInputChange = (name: string, value: string) => {
    setCredentials({...credentials, [name]: value});
  };

  const dataIsValidated = () => {
    let errors = {};
    let validated = true;
    const {email, password} = credentials;

    if (isEmptyString(email)) {
      validated = false;
      errors = {...errors, email: 'Email is required'};
    }

    if (isEmptyString(password)) {
      validated = false;
      errors = {...errors, password: 'Password is required'};
    }

    setCredentials({...credentials, errors: errors});
    return validated;
  };

  const submit = async () => {
    const result = await login(credentials);

    if (result.errors && result.errors.data) {
      const {data} = result.errors;

      if (data.errors) {
        setCredentials({...credentials, errors: {...data.errors}});
      } else {
        const message = typeof data == 'string' ? data : '';

        const status: AlertType = {
          title: 'Error',
          status: 'failed',
          message: `Something went wrong. Try again later! \n ${message}`,
        };

        dispatch(setAlert(status));
      }
    }

    if (result.body) {
      dispatch(setUser(result.body.user));
      EncryptedStorage.setItem('token', result.body.access_token);
    }
  };

  return (
    <Authentication>
      <Authentication.Card>
        <Text style={styles.loginText}>Login</Text>
        <Input
          name="email"
          label="email"
          style={styles.input}
          value={credentials.email}
          error={credentials.errors?.email}
          containerStyle={styles.containerInput}
          onInputChange={onInputChange}
        />
        <Input
          name="password"
          label="password"
          multiline={false}
          style={styles.input}
          autoCapitalize="none"
          secureTextEntry={true}
          value={credentials.password}
          error={credentials.errors?.password}
          containerStyle={styles.containerInput}
          onInputChange={onInputChange}
        />
        <Text style={styles.forgotPasword}>Forgot password?</Text>
        <Button
          rounded
          title="Login"
          style={styles.button}
          onPress={() => {
            if (dataIsValidated()) submit();
          }}
        />
      </Authentication.Card>

      <Text style={styles.question}>Not have an account?</Text>
      <Text
        style={styles.register}
        onPress={() => {
          navigate('register');
        }}>
        Create now!
      </Text>
    </Authentication>
  );
};

const styles = StyleSheet.create({
  loginText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  containerInput: {
    marginVertical: 5,
  },
  input: {
    backgroundColor: colors.gray,
  },
  forgotPasword: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'right',
    color: colors.primary,
  },
  question: {
    marginTop: 30,
    marginBottom: 5,
    fontSize: 16,
  },
  register: {
    fontSize: 16,
    color: colors.primary,
  },
  button: {
    paddingVertical: 5,
    marginTop: 30,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Login;
