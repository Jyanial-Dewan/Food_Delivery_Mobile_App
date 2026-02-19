import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../common/constant/Themes';
import {IFoodReview} from '../../types/GeneralTypes';
import {Rating} from 'react-native-vector-rating';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import {renderUserName} from '../../common/services/utility';

interface Props {
  reviews: IFoodReview[];
  handleOpenBottomSheet: () => void;
}

const Review = ({reviews, handleOpenBottomSheet}: Props) => {
  const theme = useTheme();
  const users = useSelector((state: RootState) => state.user.users);

  return (
    <View>
      {/* Header with Add Review */}
      <View style={styles.reviewContainer}>
        <Text style={[styles.nameText, {color: COLORS.amber, marginTop: 0}]}>
          Reviews
        </Text>

        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={handleOpenBottomSheet}>
          <AntDesign name="plus" size={24} color={COLORS.blue} />
          <Text style={{fontSize: 16, fontWeight: '400', color: COLORS.blue}}>
            Add Review
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <View style={{gap: 10, marginTop: 10}}>
        {reviews.map(item => (
          <View
            key={item.review_id}
            style={{
              backgroundColor: theme.colors.onBackground,
              paddingVertical: 6,
              paddingHorizontal: 10,
              flex: 1,
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}>
              <Text
                style={{
                  color: theme.colors.surface,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {renderUserName(item.user_id, users)}
              </Text>

              <Rating
                icon={<AntDesign name="star" />}
                color={COLORS.amber}
                emptyColor="silver"
                defaultValue={item.rating}
                count={10}
                size={16}
              />
            </View>

            {item.review && (
              <Text style={{color: theme.colors.surface}}>{item.review}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  reviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addReviewButton: {flexDirection: 'row', gap: 4, alignItems: 'center'},
  nameText: {fontSize: 17, fontWeight: 'bold'},
});
