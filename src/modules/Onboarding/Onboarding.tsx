import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {secureStorage} from '../../utils/Storage/mmkv';
import {useTheme} from 'react-native-paper';

const {width} = Dimensions.get('window');

type OnboardingItem = {
  id: string;
  titleTop: string;
  titleBottom: string;
  desc: string;
  image: any;
  isLast?: boolean;
};

const DATA: OnboardingItem[] = [
  {
    id: '1',
    titleTop: 'Welcome to the',
    titleBottom: 'most tastiest app',
    desc: 'You know, this app is edible meaning you can eat it!',
    image: require('../../assets/Onboarding/onboarding1.png'),
  },
  {
    id: '2',
    titleTop: 'We use nitro on',
    titleBottom: 'bicycles for delivery!',
    desc: 'For very fast delivery we use nitro on bicycles, kidding, but we’re very fast.',
    image: require('../../assets/Onboarding/onboarding2.png'),
  },
  {
    id: '3',
    titleTop: "We're the besties",
    titleBottom: 'of birthday peoples',
    desc: 'We send cakes to our plus members (only one cake per person)',
    image: require('../../assets/Onboarding/onboarding3.png'),
  },
  {
    id: '4',
    titleTop: 'Join to get the',
    titleBottom: 'delicious quizzes!',
    desc: '',
    image: require('../../assets/Onboarding/onboarding4.png'),
    isLast: true,
  },
];

export default function Onboarding() {
  const theme = useTheme();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation<any>();
  const isOnboarded = secureStorage.getItem('isOnboarded');

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const handleNext = () => {
    if (index < DATA.length - 1) {
      listRef.current?.scrollToIndex({index: index + 1, animated: true});
      setIndex(index + 1);
    } else {
      console.log('Done onboarding!');
    }
  };

  const handleSkip = async () => {
    listRef.current?.scrollToIndex({index: DATA.length - 1, animated: true});
    setIndex(DATA.length - 1);
  };

  const handleLogin = async () => {
    navigation.replace('LoginScreen');
    await handleOnboarded();
  };

  const handleOnboarded = async () => {
    await secureStorage.setItem('isOnboarded', 'true');
  };

  useEffect(() => {
    (() => {
      if (isOnboarded === 'true') {
        navigation.replace('LoginScreen');
      }
    })();
  }, [isOnboarded, navigation]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Logo width={80} height={80} /> */}
        {/* <Text style={styles.headerTitle}>Onboarding {index + 1}</Text> */}
        {/* <Text style={styles.logo}>Bobo</Text> */}
        <Image
          source={require('../../assets/Logo/logo1.png')}
          style={styles.logoImage}
        />
      </View>

      <FlatList
        ref={listRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({item}) => (
          <View style={[styles.page, {width}]}>
            {/* <View style={{height: 100}} /> */}

            <View style={{gap: 30, alignItems: 'center'}}>
              {/* Illustration */}
              <View style={styles.illustrationWrap}>
                <Image source={item?.image} style={styles.illustration} />
              </View>

              {/* Title */}
              <View style={styles.textWrap}>
                <Text style={[styles.title, {color: theme.colors.surface}]}>
                  {item.titleTop}
                </Text>
                <Text style={[styles.title, {color: theme.colors.surface}]}>
                  {item.titleBottom}
                </Text>

                {!!item.desc && (
                  <Text style={[styles.desc, {color: theme.colors.surface}]}>
                    {item.desc}
                  </Text>
                )}
              </View>
            </View>

            <View style={{width: '100%'}}>
              {/* Dots */}
              <View style={[styles.dotsRow, {justifyContent: 'center'}]}>
                {DATA.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      index === i
                        ? {backgroundColor: theme.colors.primary}
                        : {backgroundColor: theme.colors.secondary},
                    ]}
                  />
                ))}
              </View>

              {/* Buttons Area */}
              {!item.isLast ? (
                <View style={styles.bottomRow}>
                  <TouchableOpacity
                    style={[
                      styles.skipBtn,
                      {backgroundColor: theme.colors.secondary},
                    ]}
                    onPress={handleSkip}>
                    <Text
                      style={[styles.skipText, {color: theme.colors.primary}]}>
                      Skip
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.nextBtn,
                      {backgroundColor: theme.colors.primary},
                    ]}
                    onPress={handleNext}>
                    <Text style={styles.nextText}>Next</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.lastPageButtons}>
                  <TouchableOpacity
                    style={[
                      styles.loginBtn,
                      {backgroundColor: theme.colors.primary},
                    ]}
                    onPress={() => handleLogin()}>
                    <Text style={styles.loginText}>Login with Email</Text>
                  </TouchableOpacity>
                  <View style={styles.signUpContainer}>
                    <Text
                      style={[
                        styles.signUpText,
                        {color: theme.colors.surface},
                      ]}>
                      Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('SignUpScreen')}>
                      <Text
                        style={[
                          styles.underlineText,
                          {color: theme.colors.primary},
                        ]}>
                        Sign up
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.orText}>or</Text>

                  <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}>
                      <Text style={styles.socialIcon}>G</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBtn}>
                      <Text style={styles.socialIcon}>f</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBtn}>
                      <Text style={styles.socialIcon}>✉</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    // paddingTop: 30,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  headerTitle: {
    color: '#BDBDBD',
    fontSize: 14,
    fontWeight: '500',
  },

  logo: {
    fontSize: 22,
    fontWeight: '800',
  },

  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  page: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  illustrationWrap: {
    height: 240,
    width: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    height: '120%',
    resizeMode: 'contain',
  },

  textWrap: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 33,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 35,
  },
  desc: {
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
    // width: '86%',
    lineHeight: 25,
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 18,
    marginBottom: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 20,
  },
  dotActive: {
    width: 18,
  },
  dotInactive: {
    backgroundColor: '#D9D9D9',
  },

  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 6,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  skipText: {
    fontWeight: '700',
  },

  nextBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
  },

  lastPageButtons: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },

  loginBtn: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    textAlign: 'center',
  },
  underlineText: {
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 5,
    fontWeight: '600',
  },

  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    width: 56,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
});
