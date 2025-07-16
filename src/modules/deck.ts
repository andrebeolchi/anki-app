import { useMutation } from "@tanstack/react-query";
import { createDeck } from "~/interfaces/sdk/deck";

export interface ICreateDeckOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}

export const useCreateDeck = ({ onSuccess, onError }: ICreateDeckOptions = {}) => useMutation({
  mutationFn: createDeck,
  onSuccess: (data) => {
    onSuccess && onSuccess(data);
  },
  onError: (error: unknown) => {
    onError && onError(error);
  },
})