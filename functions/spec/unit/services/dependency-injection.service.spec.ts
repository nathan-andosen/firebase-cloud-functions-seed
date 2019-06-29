import * as DI from '../../../src/services/dependency-injection.service';

/**
 * Dependency injection service
 */
describe('Dependency Injection Service', () => {
  it('should inject dependencies', () => {
    class MyClass {
      sayHi(): string {
        return 'Hi';
      }
    }

    class TestClass {
      @DI.Inject(MyClass)
      myClass: MyClass;

      sayHi(): string {
        return this.myClass.sayHi();
      }
    }

    const testClass = new TestClass();
    expect(testClass.sayHi()).toEqual('Hi');
  });
});