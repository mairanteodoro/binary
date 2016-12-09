import { BinaryPage } from './app.po';

describe('binary App', function() {
  let page: BinaryPage;

  beforeEach(() => {
    page = new BinaryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
