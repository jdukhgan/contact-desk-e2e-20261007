async (page) => {
  // Run via Playwright browser_run_code_unsafe(filename) against a seeded local app.
  // Uses only read-only UI actions; Radix close autofocus runs after unmount.
  const results = [];
  await page.goto('http://127.0.0.1:3000');
  await page.getByRole('button', { name: /Dev Patel/ }).filter({ visible: true }).waitFor();
  for (const theme of ['dark', 'light']) {
    const toggle = page.getByRole('button', { name: `Switch to ${theme} theme` }).filter({ visible: true });
    if (await toggle.count()) await toggle.click();
    for (const width of [767, 768, 800, 834, 1023, 1024, 1100, 1279, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1112 });
      const table = page.getByRole('table', { name: 'Contacts', includeHidden: true });
      const geometry = await table.evaluate(table => {
        const updated = table.querySelector('[role=columnheader]:last-child');
        const dates = [...table.querySelectorAll('[role=cell]:last-child')];
        return { clientWidth: table.clientWidth, scrollWidth: table.scrollWidth,
          tableRight: table.getBoundingClientRect().right, updatedRight: updated.getBoundingClientRect().right,
          datesFit: dates.every(e => e.scrollWidth <= e.clientWidth),
          documentWidth: document.documentElement.scrollWidth };
      });
      if (geometry.documentWidth > width || (width >= 768 && (geometry.scrollWidth > geometry.clientWidth || geometry.updatedRight > geometry.tableRight || !geometry.datesFit))) throw new Error(JSON.stringify({ theme, width, geometry }));
      results.push({ theme, width, geometry });
    }
    for (const width of [1440, 834, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.getByRole('button', { name: /Dev Patel/ }).filter({ visible: true }).click();
      const trigger = page.getByRole('button', { name: 'Delete', exact: true });
      for (const close of ['Escape', 'Cancel']) {
        await trigger.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('alertdialog');
        await dialog.waitFor();
        const confirm = dialog.getByRole('button', { name: 'Delete contact', exact: true });
        if (await confirm.isEnabled()) throw new Error('Empty name permits deletion');
        await dialog.getByRole('textbox').fill('wrong');
        if (await confirm.isEnabled()) throw new Error('Wrong name permits deletion');
        await dialog.getByRole('textbox').fill('Dev Patel');
        if (!(await confirm.isEnabled())) throw new Error('Matching name does not permit deletion');
        await page.keyboard.press('Enter');
        if (!(await dialog.isVisible())) throw new Error('Enter confirmed deletion');
        for (let i = 0; i < 4; i++) {
          await page.keyboard.press('Tab');
          if (!(await dialog.evaluate(d => d.contains(document.activeElement)))) throw new Error('Focus escaped dialog');
        }
        if (close === 'Escape') await page.keyboard.press('Escape');
        else await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
        await dialog.waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement?.textContent?.trim() === 'Delete', null, { timeout: 2000 });
        if (!(await trigger.evaluate(e => e === document.activeElement))) throw new Error(`${theme}/${width}/${close} lost focus`);
        results.push({ theme, width, close, focusRestored: true, typedGuard: true, enterPrevented: true, focusTrapped: true });
      }
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    }
  }
  return { verdict: 'PASS', results };
}
