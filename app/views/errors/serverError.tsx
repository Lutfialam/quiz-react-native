import React from 'react';
import {Text, View} from 'react-native';

interface ServerError {
  message: string;
}

const ServerError: React.FC<ServerError> = props => {
  const {message} = props;

  return (
    <View>
      <Text>ServerError</Text>
    </View>
  );
};

export default ServerError;
