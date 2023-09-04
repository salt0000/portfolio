import { setDefaultValue } from '@/utils/setDefaultValue';

export const App = {
  Url: setDefaultValue(process.env.NEXT_PUBLIC_APP_URL),
};