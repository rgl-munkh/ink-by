export const STATUS_LABELS: Record<string, string> = {
  pending: "Хариу ирээгүй",
  quoted: "Үнийн санал ирсэн",
  accepted: "Зөвшөөрсөн",
  paid: "Төлбөр төлсөн",
  scheduled: "Цаг тохируулсан",
  completed: "Дууссан",
  rejected: "Татгалзсан",
  cancelled: "Цуцлагдсан",
};

export const BACK_LABEL = "Буцах";
export const SEND_QUOTE_BUTTON = "Цаг, Үнэ явуулах →";
export const PHONE_LABEL = "Утас";
export const EMAIL_LABEL = "Мэйл";

export const ARTIST_OVERVIEW_LABELS = {
  newRequest: "Шинэ хүсэлт",
  pendingLong: "Хүлээгдээд удаж буй",
} as const;

export const ARTIST_STATUS_LABELS: Record<string, string> = {
  ...STATUS_LABELS,
  pending: "Хариу өгөөгүй",
};

export const QUOTE_STEP_TITLE = "Өдөр болон Цаг сонгож өгөх";
export const SUGGESTED_TIME_LABEL = "Санал болгосон цаг/өдөр";
export const DAY_ABBREV = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"] as const;
export const PRICE_LABEL = "₮ Үнэлгээ бичих";
export const DURATION_LABEL = "Шивээс хийх хугцаа";
export const NOTES_LABEL = "Нэмэлт тайлбар";
export const SAVE_LABEL = "Хадгалах";
export const NEXT_LABEL = "Үргэлжлүүлэх";

export const QUOTE_LABELS = {
  price: "Үнэ",
  duration: "Хугацаа",
  date: "Огноо",
  expires: "Хүлээгдэх хугацаа",
  expired: "Хугацаа дууссан",
  accept: "Зөвшөөрөх",
  noQuotes: "Үнийн санал ирээгүй байна.",
} as const;

export const SIZE_LABELS: Record<string, string> = {
  credit_card: "Кредит картны хэмжээтэй",
  fist: "Зангидсан гарны хэмжээтэй",
  palm: "Дэлгэсэн гарны алга шиг",
  forearm: "Гарын шуу тал эсвэл бүхэлдээ",
  unsure: "Сайн мэдэхгүй байна",
};
