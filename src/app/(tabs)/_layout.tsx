import clsx from "clsx";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabs } from "../../../constants/data";
import { colors, components } from "../../../constants/theme";

type TabIconProps = {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
};

// const TabLayout = () => (
//   <NativeTabs>
//     <NativeTabs.Trigger name="index">
//       <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
//       <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
//     </NativeTabs.Trigger>

//     <NativeTabs.Trigger name="insights">
//       <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
//       <NativeTabs.Trigger.Icon sf="eye" md="eye_tracking" />
//     </NativeTabs.Trigger>

//     <NativeTabs.Trigger name="settings">
//       <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
//       <NativeTabs.Trigger.Icon sf="gear" md="settings" />
//     </NativeTabs.Trigger>

//     <NativeTabs.Trigger name="subscriptions">
//       <NativeTabs.Trigger.Label>Subscriptions</NativeTabs.Trigger.Label>
//       <NativeTabs.Trigger.Icon sf="wallet.pass" md="wallet" />
//     </NativeTabs.Trigger>
//   </NativeTabs>
// );

const tabBar = components.tabBar;

const TabLayout = () => {
  const insets = useSafeAreaInsets();

  const TabIcon = ({ focused, icon, title }: TabIconProps) => {
    return (
      <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          <Image source={icon} resizeMode="contain" className="tabs-glyph" />
        </View>

        {/* <Text
          className={clsx(
            focused ? "text-white text-sm text-nowrap line-clamp-1" : "hidden",
          )}
        >
          {title}
        </Text> */}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} title={tab.title} />
            ),
          }}
        />
      ))}

      {/* <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="insights" options={{ title: "Insights" }} />
    <Tabs.Screen name="onboarding" options={{ title: "Onboarding" }} />
    <Tabs.Screen name="subscriptions" options={{ title: "Subscriptions" }} />
    <Tabs.Screen name="settings" options={{ title: "Settings" }} /> */}
    </Tabs>
  );
};

export default TabLayout;
