import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
interface IAlertProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  content: string;
  cancel: () => void;
  ok: () => void;
}
const Alert = ({
  visible,
  onDismiss,
  title,
  content,
  cancel,
  ok,
}: IAlertProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={cancel}>Cancel</Button>
          <Button onPress={ok}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export default Alert;
