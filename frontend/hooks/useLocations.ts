import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface State {
  id: string;
  name: string;
  code: string;
}

interface District {
  id: string;
  name: string;
  code: string;
  stateId: string;
}

export function useStates() {
  return useQuery<State[]>({
    queryKey: ["locations", "states"],
    queryFn: () => api.get("/locations/states"),
  });
}

export function useDistricts(stateId?: string) {
  return useQuery<District[]>({
    queryKey: ["locations", "districts", stateId],
    queryFn: () => api.get("/locations/districts", { stateId }),
    enabled: !!stateId,
  });
}
