import QRCode from "qrcode";

export const generateQRCode = async (
  data: object
) => {
  return await QRCode.toDataURL(
    JSON.stringify(data)
  );
};