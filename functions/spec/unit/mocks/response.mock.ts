export class MockResponse {
  status(code) { return this; }
  send(data) { return this; }
  set(header: string, value: string) { return false; };
}