import "@/app/global.css";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import ListHeading from "../../../components/ListHeading";
import SubcriptionCard from "../../../components/SubcriptionCard";
import UpcomingSubscriptionCard from "../../../components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "../../../constants/data";
import { icons } from "../../../constants/icons";
import images from "../../../constants/images";
import { formatCurrency } from "../../../lib/utils";
const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  const { user } = useUser();

  const [expandedSubcriptionId, setExpandedSubcriptionId] = useState<
    string | null
  >(null);

  const displayName =
    user?.fullName?.trim() ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "there";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />

                <Text className="home-user-name font-medium" numberOfLines={1}>
                  {displayName}
                </Text>
              </View>

              <Image source={icons.add} className="home-add-icon" />
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>

                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscription" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubcriptionCard
            {...item}
            expanded={expandedSubcriptionId === item.id}
            onPress={() =>
              setExpandedSubcriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubcriptionId}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subcriptions yet.</Text>
        }
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
