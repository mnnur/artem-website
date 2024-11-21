import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import { db } from "@/app/lib/db";
import { RequestBodyAdmin } from "@/interface/requestBodyUpdateAdmin";

export const updateRequestUser = async (body: RequestBodyAdmin, files: File[], requestId: string) => {
  if (!files) {
    return { status: 400, message: "Invalid file" };
  }

  try {
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const fileName = `request_image/admin/${Date.now()}_${file.name}`;
        const urlRef = ref(storage, fileName);
        const uploadFile = await uploadBytes(urlRef, file);
        return getDownloadURL(uploadFile.ref);
      })
    );

    body.image = fileUrls;

    await db.request.update({
      where: {
        id: requestId,
      },
      data: {
        design_admin: body.image,
        status: body.status,
        total_price: parseInt(body.total_price),
      },
    });

    return { status: 201, message: "Request updated successfully" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal server error" };
  }
};
