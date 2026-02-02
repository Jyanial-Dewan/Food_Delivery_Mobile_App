import ImageCropPicker from 'react-native-image-crop-picker';
import {requestCameraPermission} from '../Permissions/Permissions';

interface ImageSelectionProps {
  setPhoto: (photo: {uri: string; name: string; type: string}) => void;
  setIsPictureSelected: (change: boolean) => void;
  handleClosePress: () => void;
  setError?: (error: string) => void;
}

// Take photo using camera
export const onTakePhoto = async ({
  setPhoto,
  setIsPictureSelected,
  handleClosePress,
  setError,
}: ImageSelectionProps) => {
  try {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    const image = await ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.6,
    });
    setPhoto({
      uri: image.path,
      name: image.filename || '',
      type: image.mime || '',
    });
    setIsPictureSelected(true);
    handleClosePress();
  } catch (error: any) {
    console.log('Image picker error:', error);
    setError && setError(error);
    // setError?.('Failed to pick image');
  }
};

/* Choose Image from gallery */
export const onPickImage = async ({
  setIsPictureSelected,
  setPhoto,
  handleClosePress,
  setError,
}: ImageSelectionProps) => {
  try {
    const image = await ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.6,
    });
    console.log(image, 'image......');
    setPhoto({
      uri: image.path,
      name: image.filename || '',
      type: image.mime,
    });
    setIsPictureSelected(true);
    handleClosePress();
  } catch (error: any) {
    console.log('Image picker error:', error);
    setError && setError(error);
    // setError?.('Failed to pick image');
  }
};
