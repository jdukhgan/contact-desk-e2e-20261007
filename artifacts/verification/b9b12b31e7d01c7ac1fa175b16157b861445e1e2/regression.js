async (page) => {
  // Load through browser_run_code_unsafe(filename). Requires running seeded app.
  // Read-only UI flow; throws until both acceptance defects are corrected.
  const defects = [];
  await page.goto('http://127.0.0.1:3000');
  await page.getByRole('button', { name: /Dev Patel/ }).filter({ visible: true }).waitFor();
  await page.setViewportSize({ width: 834, height: 1112 });
  const geometry = await page.getByRole('table', { name: 'Contacts' }).evaluate(table => {
    const updated = Array.from(table.querySelectorAll('[role=columnheader]')).find(e => e.textContent === 'Updated');
    return { clientWidth: table.clientWidth, scrollWidth: table.scrollWidth, tableRight: table.getBoundingClientRect().right, updatedRight: updated.getBoundingClientRect().right };
  });
  if (geometry.updatedRight > geometry.tableRight || geometry.scrollWidth > geometry.clientWidth) defects.push('Tablet clips contact columns: ' + JSON.stringify(geometry));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('button', { name: /Dev Patel/ }).filter({ visible: true }).click();
  const trigger = page.getByRole('button', { name: 'Delete', exact: true });
  for (const close of ['Escape', 'Cancel']) {
    await trigger.click();
    await page.getByRole('alertdialog').waitFor();
    if (close === 'Escape') await page.keyboard.press('Escape');
    else await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('alertdialog').waitFor({ state: 'hidden' });
    if (!(await trigger.evaluate(e => e === document.activeElement))) defects.push(close + ' does not restore delete trigger focus');
  }
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  if (defects.length) throw new Error(defects.join('\n'));
  return { verdict: 'PASS', geometry };
}
