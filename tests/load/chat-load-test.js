import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '2m', target: 200 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500']
  }
};

const chatLatency = new Trend('chat_latency');

export default function chatLoadTest() {
  group('Authenticate user', () => {
    const authResponse = http.post('https://example.com/api/auth/login', {
      email: `load-test-user-${__ITER}@example.com`,
      password: 'LoadTestPass1!'
    });
    check(authResponse, {
      'auth success': (res) => res.status === 200 && res.json('token')
    });
    const token = authResponse.json('token');

    group('Join chat channel', () => {
      const joinResponse = http.post(
        'https://example.com/api/chat/join',
        { channel: 'global' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      check(joinResponse, {
        'joined channel': (res) => res.status === 200
      });
    });

    group('Send chat message', () => {
      const start = Date.now();
      const messageResponse = http.post(
        'https://example.com/api/chat/send',
        { channel: 'global', content: 'Load test message' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const latency = Date.now() - start;
      chatLatency.add(latency);

      check(messageResponse, {
        'message accepted': (res) => res.status === 202
      });
    });
  });

  sleep(1);
}
