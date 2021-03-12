import { StrengthPipe } from "./strength.pipe";

describe('strength pipe', () => {

  it('should display weak if strength is 5', () => {
    let pipe = new StrengthPipe();
    let result = pipe.transform(5);
    expect(result).toEqual('5 (weak)');
  });

  it('should display strong if strength is 10', () => {
    let pipe = new StrengthPipe();
    let result = pipe.transform(10);
    expect(result).toEqual('10 (strong)');
  });

  it('should display unbelievable if strength is 20', () => {
    let pipe = new StrengthPipe();
    let result = pipe.transform(20);
    expect(result).toEqual('20 (unbelievable)');
  });

});
