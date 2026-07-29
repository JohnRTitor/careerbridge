import { useMutation } from "@tanstack/react-query";
import { uploadFileApi } from "./api";
import type { UploadFileArgs } from "./types";

export const useSupabaseUpload = () => {
  return useMutation({
    mutationFn: (args: UploadFileArgs) => uploadFileApi(args),
  });
};
