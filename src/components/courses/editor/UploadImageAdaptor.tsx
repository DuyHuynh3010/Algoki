import axios from "axios";
import { useAuthStore } from "@/store/slices/auth.slice";

function uploadAdapter(loader: any) {
  const token = useAuthStore.getState().token;


  return {
    upload: () => {
      return new Promise((resolve) => {
        const body = new FormData();

        loader.file.then((file: any) => {
          body.append("file", file);
          axios
            .post(
              `${process.env.NEXT_PUBLIC_API_URL}/attachments/upload`,
              body,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "Authorization": `Bearer ${token}`,
                },
              },
            )

            .then((response) => {
              // handle the response

              console.log("response.data.url---", response.data.url);
              resolve({default: response.data.url});
            })

            .catch((error) => {
              // handle errors

              console.log(error);
            });
        });
      });
    },
  };
}

export default function ThisCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return uploadAdapter(loader);
  };
}
