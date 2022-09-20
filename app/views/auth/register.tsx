import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';

import {UserType} from '@/types/user';
import {register} from '@/services/auth';
import {navigate} from '@/app/routes/rootNavigation';

import colors from '@/assets/styles/colors';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/forms/input';
import Authentication from '@/components/layouts/authentication';
import isEmptyString from '@/helpers/string/isEmptyString';
import {AlertType, setAlert} from '@/state/alert/alertSlice';
import {useAppDispatch} from '@/hooks/redux';

interface Register {}

const Register: React.FC<Register> = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<UserType>({} as UserType);

  const onInputChange = (name: string, value: string) => {
    setCredentials({...credentials, [name]: value});
  };

  const dataIsValidated = () => {
    let errors = {};
    let validated = true;
    const list = ['name', 'email', 'password', 'passwordConfirmation'] as const;

    list.map(item => {
      if (isEmptyString(credentials[item])) {
        validated = false;
        errors = {...errors, [item]: `${item} is required`};
      }
    });

    if (credentials.password != credentials.passwordConfirmation) {
      validated = false;
      errors = {...errors, passwordConfirmation: `password is not match`};
    }

    setCredentials({...credentials, errors: errors});
    return validated;
  };

  const submit = async () => {
    if (dataIsValidated()) {
      setLoading(true);
      const result = await register(credentials);

      if (result.errors) {
        setCredentials({...credentials, errors: result.errors});
      }

      if (result.body) {
        const alert: AlertType = {
          title: 'Success',
          status: 'success',
          message: 'Your account is successfully created!',
        };

        dispatch(setAlert(alert));
        navigate('login');
      }
      setLoading(false);
    }
  };

  return (
    <Authentication loading={loading}>
      <Authentication.Card>
        <Text style={styles.loginText}>Login</Text>
        <Input
          name="name"
          label="name"
          style={styles.input}
          value={credentials.name}
          error={credentials.errors?.name}
          containerStyle={styles.containerInput}
          onInputChange={onInputChange}
        />
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
        <Input
          name="passwordConfirmation"
          label="passwordConfirmation"
          multiline={false}
          style={styles.input}
          autoCapitalize="none"
          secureTextEntry={true}
          value={credentials.passwordConfirmation}
          error={credentials.errors?.passwordConfirmation}
          containerStyle={styles.containerInput}
          onInputChange={onInputChange}
        />
        <Button
          rounded
          title="Register"
          style={styles.button}
          onPress={() => {
            submit();
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

export default Register;
