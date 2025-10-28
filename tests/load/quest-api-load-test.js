import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 300 },
    { duration: '1m', target: 0 }
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'],
    'checks': ['rate>0.95']
  }
};

const errorRate = new Rate('errors');

export default function () {
  const BASE_URL = 'https://example.com/api';

  group('Quest browsing', () => {
    const response = http.get(`${BASE_URL}/quests`);
    check(response, {
      'quest list loaded': (res) => res.status === 200,
      'quests returned': (res) => res.json('data').length > 0
    }) || errorRate.add(1);
  });

  sleep(1);

  group('Quest details', () => {
    const response = http.get(`${BASE_URL}/quests/quest-123`);
    check(response, {
      'quest loaded': (res) => res.status === 200,
      'has xp reward': (res) => res.json('data.xpReward') > 0
    }) || errorRate.add(1);
  });

  sleep(2);
}
