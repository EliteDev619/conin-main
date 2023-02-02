import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { ABLY_PUBLIC_KEY } from '../../common';

window.Pusher = Pusher;
export const echo = new Echo({
  broadcaster: 'pusher',
  key: ABLY_PUBLIC_KEY,
  wsHost: 'realtime-pusher.ably.io',
  wsPort: 443,
  disableStats: true,
  encrypted: true,
});
