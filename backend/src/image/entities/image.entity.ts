export class ImageEntity {
  id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  userId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
