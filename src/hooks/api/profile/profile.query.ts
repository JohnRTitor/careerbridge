import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./profile.apis";

import type { ProfileInfo } from "./profile.apis.schema";

export const useGetProfile = () =>
  useQuery<ProfileInfo>({
    queryKey: ["get-profile"],
    queryFn: () => getProfile(),
  });
