export class MockRequest {
  public body = {};
  get(header: string): string { return ''; }
}