async(page)=>{
const checks=[];const check=(v,n)=>{if(!v)throw Error(n);checks.push(n)};
await page.reload();await page.getByText('6 of 6 contacts').waitFor();
for(const query of ['DEV','Quarry','contact6@']){
await page.getByRole('searchbox').fill(query);
check((await page.locator('body').innerText()).includes('1 of 6 contacts'),'Search '+query);
}
await page.getByRole('button',{name:'Clear filters'}).click();
await page.getByLabel('Owner',{exact:true}).selectOption({label:'Mara Okafor'});
await page.getByLabel('Status',{exact:true}).selectOption('Active');
check((await page.locator('body').innerText()).includes('3 of 6 contacts'),'Combined owner and status filters');
await page.getByRole('searchbox').fill('no-such-fictional-contact');
check((await page.locator('body').innerText()).includes('No contacts match'),'Filtered empty state');
await page.getByRole('button',{name:'Clear filters'}).first().click();
await page.getByLabel('Owner',{exact:true}).selectOption('none');
check((await page.locator('body').innerText()).includes('1 of 6 contacts'),'Unassigned owner filter');
await page.getByRole('button',{name:'Clear filters'}).click();
await page.getByRole('searchbox').focus();
await page.keyboard.press('Tab');
check(await page.getByLabel('Owner',{exact:true}).evaluate(e=>e===document.activeElement),'Tab reaches owner');
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Tab');
check(await page.getByLabel('Status',{exact:true}).evaluate(e=>e===document.activeElement),'Tab reaches status');
await page.getByRole('button',{name:'Clear filters'}).click();
await page.getByRole('button',{name:/Dev Patel/}).focus();
await page.keyboard.press('Enter');
await page.getByRole('heading',{name:'Dev Patel',exact:true}).waitFor();
check(true,'Keyboard Enter opens contact');
await page.getByRole('button',{name:'Delete',exact:true}).click();
await page.keyboard.press('Tab');
check(await page.getByRole('alertdialog').evaluate(e=>e.contains(document.activeElement)),'Delete dialog traps keyboard focus');
await page.keyboard.press('Escape');
checks.push({name:'Escape restores delete trigger focus',pass:await page.getByRole('button',{name:'Delete',exact:true}).evaluate(e=>e===document.activeElement)});
await page.getByRole('button',{name:'Cancel',exact:true}).click();
return checks;
}
