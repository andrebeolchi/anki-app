import { useNavigation } from "expo-router";
import { useEffect } from "react";

export const useNavigationOptions = (options: Partial<{}>) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions(options)
  }, []);
}