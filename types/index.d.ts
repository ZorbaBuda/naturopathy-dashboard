export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

type SearchParams = {
  page: string;
  limit: string;
  sort: string;
  search: string;
};

type FeaturedImage = {
  imageId: string;
  imageUrl: string;
  imageTitle: string;
  altText: string;
};

type TBlog = {
  _id: string;
  title: string;
  slug: string;
  body: string;
  author?: string;
  metaDescription: string;
  categories: string[];
  published: boolean;
  bodyImages?: string[];
  featuredImage: FeaturedImage;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type TContactForm = {
  name: string,
  phone: string,
  email: string,
  message: string,
  date: string,
  privacyConsent: boolean,
  // newsletterCheck: boolean
}

type TCategory = {
  _id: string,
  categoryName: string,
  slug: string,
  description: string,
  blogCount?: string,
  userId?: string,
  createdAt: string,
  updatedAt: string,
}

type TMedia = {
  id: string,
  imageId : string,
  imageUrl : string,
  imageTitle : string,
  altText : string,
  userId: string,
  createdAt: string,
  updatedAt: string,
}
