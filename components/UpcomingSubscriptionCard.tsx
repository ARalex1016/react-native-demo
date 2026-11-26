import { Image, Text, View } from "react-native";
import { formatCurrency } from "../lib/utils";

const UpcomingSubscriptionCard = ({
  name,
  price,
  currency,
  daysLeft,
  icon,
}: UpcomingSubscription) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" resizeMode="contain" />

        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>

          <Text className="upcoming-meta">
            {daysLeft} {daysLeft === 1 ? "day" : "days"} left
          </Text>
        </View>
      </View>

      <Text className="upcoming-name">{name}</Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
