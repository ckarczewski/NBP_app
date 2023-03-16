import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.APP_DOMAIN as string);
  await page.waitForLoadState('domcontentloaded');
});

test.describe('Page', () => {
  test('should redirect to https://', async ({ page }) => {
    const url = process.env.APP_DOMAIN?.replace('https://', 'http://') as string;
    await page.goto(url);
  
    await expect(page).toHaveURL(/https\:\/\/.*/);
  });
});

test.describe('Header', () => {
  test('should contain Analiza waluty text', async ({ page }) => {
    const header = await page.getByText('Analiza waluty');
    await expect(header).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('should contain link leading to code repository', async ({ page }) => {
    const repoLink = await page.getByRole('link');
    await expect(repoLink).toBeVisible();
    await repoLink.click();
    await expect(page).toHaveURL('https://github.com/IIS-ZPI/ZPI2022_zaoczni_RzultePapaje');
  });

  test('should include github image & contain all team indexes', async ({ page }) => {
    const footer = await page.getByText('GitHub.comJustyna OwczarekTester oraz Scrum Master229301Bartłomiej OłubekDevops2');
    await expect(footer).toContainText('GitHub.com');
    await expect(footer).toContainText('229301');
    await expect(footer).toContainText('229300');
    await expect(footer).toContainText('229248');
    await expect(footer).toContainText('229268');
    await expect(footer).toContainText('229322');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveScreenshot('team.png');
  });
  

  test('should contain copyright footer', async ({ page }) => {
    const footer = await page.locator('#root div').filter({ hasText: '© Copyright 2023 - RzultePapaje sp. z.ł.o' }).nth(3);
    await expect(footer).toHaveScreenshot('footer.png');
  });
});

test.describe('Currency selector', () => {
  test('should show default currency', async ({ page }) => {
    const selector = await page.getByText('Wybierz walutęUSDdolar amerykańskiSprawdź');
    await expect(selector).toBeVisible();
    await expect(selector).toContainText('USD');
    await expect(selector).toHaveScreenshot('currency-selector.png');
  });

  test('should show list of currencies', async ({ page }) => {
    const selector = await page.getByText('Wybierz walutęUSDdolar amerykańskiSprawdź');
    await selector.click();
    
    const filter = await page.getByPlaceholder('Wpisz walute...');
    const list = await page.getByText('SearchUSDdolar amerykańskiEUReuroCHFfrank szwajcarskiJPYjen (Japonia)CNYyuan ren');    
    const results = await list.getByRole('button');

    await expect(filter).toBeVisible();
    await expect(filter).toBeEmpty();
    await expect(filter).toBeEditable();
    await expect(filter).toBeFocused();

    await expect(list).toBeVisible();
    await expect(results).toHaveCount(147);
  });

  test('should filter currencies', async ({ page }) => {
    await page.getByText('Wybierz walutęUSDdolar amerykańskiSprawdź').click();
    
    const filter = await page.getByPlaceholder('Wpisz walute...');

    await filter.fill('x');
    const results = await page.getByText('SearchX').getByRole('button');

    await expect(results).toHaveCount(4);
  });

  test('should filter currencies – case no results', async ({ page }) => {
    await page.getByText('Wybierz walutęUSDdolar amerykańskiSprawdź').click();
    
    const filter = await page.getByPlaceholder('Wpisz walute...');

    await filter.fill('xd');
    const list = await page.getByText('Search');
    const results = await list.getByRole('button');

    await expect(results).toHaveCount(0);
  });
  
  test('should show result image, currency name and code', async ({ page }) => {
    await page.getByText('Wybierz walutęUSDdolar amerykańskiSprawdź').click();
    
    const filter = await page.getByPlaceholder('Wpisz walute...');
    const list = await page.getByText('SearchM');

    await filter.fill('den');
    const results = await list.getByRole('button');
    const result = await list.getByRole('button', { name: 'MKD denar (Macedonia Północna)' })

    await expect(results).toHaveCount(1);
    await expect(result).toBeVisible();
    await expect(result).toContainText('MKD');
    await expect(result).toHaveScreenshot('currency-selector-result.png');
  });

  test('should change the currency', async ({ page }) => {
    await page.getByRole('button', { name: 'USD dolar amerykański' }).nth(1).click();
    
    const filter = await page.getByPlaceholder('Wpisz walute...');
    const list = await page.getByText('SearchM');
    await delay(500);
    await filter.fill('den');

    const button = await list.getByRole('button', { name: 'MKD denar (Macedonia Północna)' });
    await button.click();

    await expect(list).toBeHidden();
    await expect(filter).toBeHidden();
    
    const newCurrency = await page.getByRole('button', { name: 'MKD denar (Macedonia Północna)' })
    await expect(newCurrency).toContainText('MKD');
    await expect(newCurrency).toContainText('denar');
  });

  test('should request new currency data', async ({ page }) => {
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('session?currency=MKD') && resp.status() === 200),
      changeCurrency(page),
    ]);
  });
});

test.describe('Stats table', () => {
  test('should contain constant amount of cols and rows', async ({ page }) => {
    await page.waitForResponse(resp => resp.url().includes('session?currency=USD') && resp.status() === 200);

    const table = await page.getByRole('table');
    const rows = await table.getByRole('row');
    const cells = await table.getByRole('cell');
    const cols = [
      'Tydzień',
      '2 Tygodnie',
      'Miesiąc',
      'Kwartał',
      '6 Miesięcy',
      'Rok',
    ];
    const rowNames = [
      'Mediana',
      'Dominanta',
      'Odchylenie standardowe',
      'Współczynnik zmienności'
    ];

    await table.scrollIntoViewIfNeeded();
    await expect(table).toHaveCount(1);
    await expect(rows).toHaveCount(5);
    await expect(cells).toHaveCount(7 * 5);
    
    for (const col of cols) {
      const el = await table.getByRole('cell', { name: col });
      await expect(el).toHaveCount(1);
    }

    for (const row of rowNames) {
      const el = await table.getByRole('cell', { name: row });
      await expect(el).toHaveCount(1);
    }
  });

  test('should change data on currency change', async ({ page }) => {
    await page.waitForResponse(resp => resp.url().includes('session?currency=USD') && resp.status() === 200);

    const table = await page.getByRole('table');
    await table.scrollIntoViewIfNeeded();

    const dataBefore: Buffer = await table.screenshot();

    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('session?currency=MKD') && resp.status() === 200),
      changeCurrency(page),
    ]);

    const dataAfterwards: Buffer = await table.screenshot();

    await expect(dataBefore).not.toEqual(dataAfterwards);
  });
});

test.describe('Sessions chart', () => {
  test('should display period selector', async ({ page }) => {
    const selector = await page.getByText('Tydzień2 TygodnieMiesiącKwartał6 MiesięcyRok').first();
    const periods = await selector.getByRole('button');

    const periodNames = [
      'Tydzień',
      '2 Tygodnie',
      'Miesiąc',
      'Kwartał',
      '6 Miesięcy',
      'Rok',
    ];

    await expect(periods).toHaveCount(6);

    for (const period of periodNames) {
      const el = await selector.getByRole('button', { name: period });
      await expect(el).toHaveCount(1);
    }

    await expect(selector).toHaveScreenshot('period-selector-result.png');
  });

  test('should change active period button on click', async ({ page }) => {
    const selector = await page.getByText('Tydzień2 TygodnieMiesiącKwartał6 MiesięcyRok').first();
    const period = await page.getByRole('button', { name: 'Miesiąc' }).nth(1);
    const currentPeriod = await selector.getByRole('button', { name: 'Tydzień' });

    const activeClassRegex = /.*bg-blue-500.*/;
    await expect(currentPeriod).toHaveClass(activeClassRegex);
    await expect(period).not.toHaveClass(activeClassRegex);
    await period.click();
    await expect(period).toHaveClass(activeClassRegex);
    await expect(currentPeriod).not.toHaveClass(activeClassRegex);
  });

  test('should change chart data on period change', async ({ page }) => {
    await page.waitForResponse(resp => resp.url().includes('session?currency=USD') && resp.status() === 200);
    const period = await page.getByRole('button', { name: 'Miesiąc' }).nth(1);
    
    const chart = await page.getByRole('img').nth(3);

    const dataBefore: Buffer = await chart.screenshot();

    await period.click();

    const dataAfterwards: Buffer = await chart.screenshot();

    await expect(dataBefore).not.toEqual(dataAfterwards);
  });

  test('should change chart data on currency change', async ({ page }) => {
    await page.waitForResponse(resp => resp.url().includes('session?currency=USD') && resp.status() === 200);
    const section = await page.getByText('Analiza walutyT');

    const chart = await page.locator('canvas').nth(1);

    const dataBefore: Buffer = await chart.screenshot();

    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('session?currency=MKD') && resp.status() === 200),
      changeCurrency(page),
    ]);

    const dataAfterwards: Buffer = await chart.screenshot();

    await expect(dataBefore).not.toEqual(dataAfterwards);
  });
});

const changeCurrency = async (locator) => {
  await locator.getByRole('button', { name: 'USD dolar amerykański' }).nth(1).click();
  await locator.getByPlaceholder('Wpisz walute...').fill('den');
  await locator.getByText('SearchM').getByRole('button', { name: 'MKD denar (Macedonia Północna)' }).click();
  await locator.getByRole('button', { name: 'Sprawdź' }).nth(1).click();
}

const delay = (time: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, time));
}
