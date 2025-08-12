import { useAppSelector } from "@/store";

export const useCardSpeed = () => {
  const cardSpeed = useAppSelector(state => state.user.preferences.cardSpeed);
  
  return {
    cardSpeed,
    style: {
      animation: `fadeIn ${cardSpeed*2.5}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
    }
  };
}; 