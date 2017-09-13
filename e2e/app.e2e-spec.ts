import { BolenumPage } from './app.po';

describe('bolenum App', () => {
  let page: BolenumPage;

  beforeEach(() => {
    page = new BolenumPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
