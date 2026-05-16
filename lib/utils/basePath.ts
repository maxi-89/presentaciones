export const BASE_PATH =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_REPO_NAME
    ? `/${process.env.NEXT_PUBLIC_REPO_NAME}`
    : '';
